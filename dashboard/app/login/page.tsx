import { signIn, sendMagicLink } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; sent?: string }> }) {
  const { next = '/', error, sent } = await searchParams;

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div aria-hidden className="animate-float pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[var(--accent)] opacity-15 blur-3xl" />
      <div aria-hidden className="animate-float pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-[#8965e5] opacity-15 blur-3xl" style={{ animationDelay: '1.5s' }} />

      <div className="card relative w-full max-w-[420px] p-8">
        <div className="mb-7 flex items-center gap-3">
          <svg width="40" height="32" viewBox="0 0 34 28" aria-hidden>
            <path d="M3 24 L11 4 L17 16 L23 4 L31 24" fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="3" cy="24" r="3" fill="#8965e5" />
          </svg>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Musticker QA</h1>
            <p className="text-sm font-semibold text-[var(--muted)]">Playwright test dashboard</p>
          </div>
        </div>

        <h2 className="text-[22px] font-extrabold tracking-tight">Welcome back</h2>
        <p className="mb-6 text-sm text-ink-2">Sign in with your dashboard account.</p>

        {error && <p className="mb-4 rounded-2xl bg-[var(--critical-soft)] px-4 py-3 text-sm font-semibold text-critical-text">{error}</p>}
        {sent && <p className="mb-4 rounded-2xl bg-[var(--good-soft)] px-4 py-3 text-sm font-semibold text-good-text">Check your inbox for a sign-in link.</p>}

        <form className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" required autoComplete="email" className="input w-full" />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" autoComplete="current-password" className="input w-full" />
          </div>
          <button formAction={signIn} className="btn btn-primary w-full justify-center !py-3">
            Sign in
          </button>
          <div className="flex items-center gap-3 text-xs font-semibold text-[var(--muted)]">
            <span className="h-px flex-1 bg-[var(--border)]" /> or <span className="h-px flex-1 bg-[var(--border)]" />
          </div>
          <button formAction={sendMagicLink} formNoValidate className="btn w-full justify-center !py-3">
            Email me a sign-in link
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-[var(--muted)]">Accounts are created by an admin in Supabase → Authentication → Users.</p>
      </div>
    </main>
  );
}
