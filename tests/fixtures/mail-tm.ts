// Free, keyless disposable-inbox API (https://docs.mail.tm/) used by full-payment e2e tests to
// solve the checkout's guest-email OTP gate and to read the resulting order-confirmation email.
// No account/API key required -- accounts are created on demand per test run.
const MAIL_TM_BASE_URL = 'https://api.mail.tm';

// Connection blips clear quickly; the rate limit needs a longer, more patient backoff, so 429 gets
// its own budget -- 5s, 10s, 15s, 20s, ~50s in total.
const RATE_LIMIT_ATTEMPTS = 5;

export type MailTmAccount = {
  address: string;
  token: string;
};

export type MailTmMessage = {
  id: string;
  subject: string;
  text?: string;
  /** mail.tm splits an HTML body into parts; only the full message (not the inbox listing) has it. */
  html?: string[];
  from?: { address?: string };
  createdAt?: string;
};

export async function createMailTmAccount(): Promise<MailTmAccount> {
  const domains = await mailTmFetch<{ 'hydra:member': Array<{ domain: string }> }>('/domains');
  const domain = domains['hydra:member'][0]?.domain;
  if (!domain) {
    throw new Error('mail.tm returned no available domains');
  }

  const address = `musticker-e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@${domain}`;
  const password = `E2e-${Math.random().toString(36).slice(2, 10)}!`;

  await mailTmFetch('/accounts', { method: 'POST', body: JSON.stringify({ address, password }) });
  const { token } = await mailTmFetch<{ token: string }>('/token', {
    method: 'POST',
    body: JSON.stringify({ address, password })
  });

  return { address, token };
}

export async function waitForMailTmMessage(
  account: MailTmAccount,
  predicate: (message: MailTmMessage) => boolean,
  timeoutMs = 60_000
): Promise<MailTmMessage> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const match = (await listMailTmMessages(account)).find(predicate);
    if (match) {
      return readMailTmMessage(account, match.id);
    }

    await new Promise((resolve) => setTimeout(resolve, 3_000));
  }

  throw new Error(`Timed out after ${timeoutMs}ms waiting for a matching mail.tm message`);
}

/**
 * Every message that arrived since the caller last looked, oldest first and read in full. `seen`
 * holds the ids already handed out and is updated, so calling this after each step of a journey
 * attributes each email to the step that sent it.
 *
 * Returns as soon as `count` new messages are in, or once `timeoutMs` has passed with whatever
 * arrived by then -- the caller asserts on the count, so a missing email reads as a test failure
 * naming the step, not a timeout here. Without `count` it always waits the full time, which is how
 * an unknown number of emails is collected.
 */
export async function waitForNewMailTmMessages(
  account: MailTmAccount,
  seen: Set<string>,
  { count, timeoutMs }: { count?: number; timeoutMs: number }
): Promise<MailTmMessage[]> {
  const deadline = Date.now() + timeoutMs;
  let fresh: MailTmMessage[];

  for (;;) {
    fresh = (await listMailTmMessages(account)).filter((message) => !seen.has(message.id));
    if ((count !== undefined && fresh.length >= count) || Date.now() >= deadline) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, 3_000));
  }

  fresh.forEach((message) => seen.add(message.id));
  const messages = await Promise.all(fresh.map((message) => readMailTmMessage(account, message.id)));
  return messages.sort((a, b) => (a.createdAt ?? '').localeCompare(b.createdAt ?? ''));
}

/** The message's readable body: the plain-text part, or the HTML with its tags stripped. */
export function mailTmBody(message: MailTmMessage): string {
  const text = message.text?.trim();
  if (text) {
    return text;
  }

  return (message.html ?? [])
    .join('\n')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** The inbox's newest page (30 messages), as summaries without the body. */
async function listMailTmMessages(account: MailTmAccount): Promise<MailTmMessage[]> {
  const page = await mailTmFetch<{ 'hydra:member': MailTmMessage[] }>('/messages', {
    headers: { Authorization: `Bearer ${account.token}` }
  });

  return page['hydra:member'];
}

async function readMailTmMessage(account: MailTmAccount, id: string): Promise<MailTmMessage> {
  return mailTmFetch<MailTmMessage>(`/messages/${id}`, {
    headers: { Authorization: `Bearer ${account.token}` }
  });
}

// The OTP body also contains a "© Copyright 2026" footer, whose year is itself a plausible
// 4-digit match, so candidates that look like a copyright year are skipped rather than relying on
// the OTP happening to appear first in the text.
export function extractOtpCode(message: MailTmMessage): string {
  const source = `${message.text ?? ''} ${message.subject ?? ''}`;
  const candidates = [...source.matchAll(/\b(\d{4})\b/g)].map((match) => match[1]);
  const otp = candidates.find((candidate) => !/^20\d{2}$/.test(candidate));

  if (!otp) {
    throw new Error(`Could not find an OTP code in mail.tm message "${message.subject}"`);
  }

  return otp;
}

// mail.tm is a free, no-SLA service; brief connection-level blips are retried a few times rather
// than failing the whole test outright. HTTP-level errors are real API errors and surface
// immediately -- except 429, which is the shared rate limit rather than anything wrong with the
// request. Several suites now mint a mailbox per test (registration, password rotation, guest
// checkout), so a run can legitimately bump into it; those back off and retry instead of failing.
async function mailTmFetch<T>(path: string, options: RequestInit = {}, attempt = 1): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${MAIL_TM_BASE_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) }
    });
  } catch (error) {
    if (attempt >= 3) {
      throw error;
    }

    await new Promise((resolve) => setTimeout(resolve, attempt * 1_000));
    return mailTmFetch<T>(path, options, attempt + 1);
  }

  if (response.status === 429 && attempt < RATE_LIMIT_ATTEMPTS) {
    await new Promise((resolve) => setTimeout(resolve, attempt * 5_000));
    return mailTmFetch<T>(path, options, attempt + 1);
  }

  if (!response.ok) {
    throw new Error(`mail.tm ${path} failed: ${response.status} ${await response.text()}`);
  }

  return response.json() as Promise<T>;
}
