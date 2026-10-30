import { execSync } from 'node:child_process';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';

import type { FullConfig, FullResult, Reporter, Suite, TestCase, TestResult } from '@playwright/test/reporter';

// Streams a run into the QA dashboard (dashboard/ in this repo, Next.js + Supabase on Vercel):
// the test catalog on begin, each test's final attempt in batches, and the run outcome on end.
//
// A no-op unless DASHBOARD_URL and DASHBOARD_INGEST_TOKEN are set. It never fails or slows a run
// by more than its request timeouts: every network error is logged once and the reporter goes quiet.
//
// Shards of one GitHub run share GITHUB_RUN_ID-GITHUB_RUN_ATTEMPT and land in one execution. A run
// the dashboard dispatched passes DASHBOARD_RUN_ID so the reporter fills in that queued row.

const BATCH_SIZE = 50;
const REQUEST_TIMEOUT_MS = 15_000;
const CASE_ID = /\b(MS-[A-Z0-9]+-\d{3,})\b/;
// eslint-disable-next-line no-control-regex
const ANSI = /\u001b\[[0-9;]*m/g;

type ResultStatus = 'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted' | 'flaky';

type CatalogEntry = {
  file: string;
  title: string;
  fullTitle: string;
  caseId: string | null;
  line: number | null;
  tags: string[];
  suiteTitle: string;
  area: string | null;
};

type ResultEntry = {
  file: string;
  fullTitle: string;
  browserProject: string;
  status: ResultStatus;
  retries: number;
  durationMs: number;
  errorMessage: string | null;
  errorStack: string | null;
  attachments: { name: string; contentType: string; path?: string }[];
  annotations: { type: string; description?: string }[];
  startedAt: string | null;
};

export function caseIdOf(title: string): string | null {
  return CASE_ID.exec(title)?.[1] ?? null;
}

// The final status of a test, as the dashboard records it. Called on every attempt; a retry's
// call overwrites the previous one.
export function statusOf(test: Pick<TestCase, 'outcome'>, result: Pick<TestResult, 'status'>): ResultStatus {
  switch (test.outcome()) {
    case 'flaky':
      return 'flaky';
    case 'skipped':
      return 'skipped';
    case 'expected':
      return result.status === 'skipped' ? 'skipped' : 'passed';
    default:
      return result.status === 'timedOut' || result.status === 'interrupted' ? result.status : 'failed';
  }
}

// npm script names carry the suite (`test:smoke` → smoke); CI sets DASHBOARD_SUITE explicitly.
export function suiteLabel(env: NodeJS.ProcessEnv): string | null {
  if (env.DASHBOARD_SUITE) return env.DASHBOARD_SUITE;
  const script = env.npm_lifecycle_event;
  return script?.startsWith('test:') ? script.slice('test:'.length) : null;
}

function stripAnsi(text: string | undefined): string | null {
  return text ? text.replace(ANSI, '') : null;
}

function git(command: string): string | null {
  try {
    return execSync(`git ${command}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null;
  } catch {
    return null;
  }
}

export default class DashboardReporter implements Reporter {
  private readonly url = process.env.DASHBOARD_URL?.replace(/\/+$/, '');
  private readonly token = process.env.DASHBOARD_INGEST_TOKEN;
  private readonly project = process.env.DASHBOARD_PROJECT || 'musticker';
  private enabled = Boolean(this.url && this.token);

  private repoRoot = process.cwd();
  private testDir = process.cwd();
  private executionId: Promise<string | null> = Promise.resolve(null);
  private readonly pending = new Map<string, ResultEntry>();
  private readonly inFlight: Promise<unknown>[] = [];

  onBegin(config: FullConfig, suite: Suite): void {
    if (!this.enabled) return;

    this.repoRoot = config.configFile ? path.dirname(config.configFile) : process.cwd();
    this.testDir = config.projects[0]?.testDir ?? config.rootDir;

    const catalog = new Map<string, CatalogEntry>();
    for (const test of suite.allTests()) {
      const entry = this.catalogEntry(test);
      catalog.set(`${entry.file}\u0000${entry.fullTitle}`, entry);
    }

    const env = process.env;
    const ciRunUrl =
      env.GITHUB_SERVER_URL && env.GITHUB_REPOSITORY && env.GITHUB_RUN_ID
        ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`
        : null;
    const projects = config.projects.map((p) => p.name);
    const grep = config.projects[0]?.grep;

    this.executionId = this.post<{ executionId: string }>({
      type: 'begin',
      project: this.project,
      run: {
        executionId: env.DASHBOARD_RUN_ID || null,
        externalId: env.GITHUB_RUN_ID ? `${env.GITHUB_RUN_ID}-${env.GITHUB_RUN_ATTEMPT ?? '1'}` : `local-${env.E2E_RUN_ID ?? Date.now()}`,
        environment: env.E2E_ENVIRONMENT || null,
        browserProject: projects.length > 1 ? 'all-desktop' : projects[0] || null,
        suite: suiteLabel(env),
        grep: grep instanceof RegExp && grep.source !== '.*' ? grep.source : null,
        trigger: env.CI ? 'ci' : 'local',
        branch: env.GITHUB_HEAD_REF || env.GITHUB_REF_NAME || git('rev-parse --abbrev-ref HEAD'),
        commitSha: env.GITHUB_SHA || git('rev-parse HEAD'),
        ciRunUrl,
        reportUrl: env.DASHBOARD_REPORT_URL || null,
        shardsTotal: config.shard?.total ?? 1,
        startedAt: new Date().toISOString()
      },
      catalog: [...catalog.values()]
    }).then((response) => response?.executionId ?? null);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (!this.enabled) return;

    const { file, fullTitle } = this.identify(test);
    const error = result.errors[0] ?? result.error;
    this.pending.set(test.id, {
      file,
      fullTitle,
      browserProject: test.parent.project()?.name || 'default',
      status: statusOf(test, result),
      retries: result.retry,
      durationMs: result.duration,
      errorMessage: stripAnsi(error?.message),
      errorStack: stripAnsi(error?.stack),
      attachments: result.attachments.map((a) => ({
        name: a.name,
        contentType: a.contentType,
        ...(a.path ? { path: path.relative(this.repoRoot, a.path).split(path.sep).join('/') } : {})
      })),
      annotations: result.annotations.map((a) => ({ type: a.type, ...(a.description ? { description: a.description } : {}) })),
      startedAt: result.startTime.toISOString()
    });

    if (this.pending.size >= BATCH_SIZE) this.flush();
  }

  async onEnd(result: FullResult): Promise<void> {
    if (!this.enabled) return;

    this.flush();
    await Promise.all(this.inFlight);
    const executionId = await this.executionId;
    if (!executionId) return;

    await this.post({ type: 'end', executionId, status: result.status, finishedAt: new Date().toISOString() });
    const base = this.url;
    console.log(`Dashboard: ${base}/executions/${executionId}`);
  }

  printsToStdio(): boolean {
    return false;
  }

  private flush(): void {
    if (this.pending.size === 0) return;
    const results = [...this.pending.values()];
    this.pending.clear();
    this.inFlight.push(
      this.executionId.then((executionId) =>
        executionId ? this.post({ type: 'results', executionId, project: this.project, results }) : null
      )
    );
  }

  private identify(test: TestCase): { file: string; fullTitle: string } {
    return {
      file: path.relative(this.repoRoot, test.location.file).split(path.sep).join('/'),
      // titlePath: ['', project, file, ...describes, title]
      fullTitle: test.titlePath().slice(3).join(' › ')
    };
  }

  private catalogEntry(test: TestCase): CatalogEntry {
    const { file, fullTitle } = this.identify(test);
    const titles = test.titlePath().slice(3);
    const area = path.relative(this.testDir, path.dirname(test.location.file)).split(path.sep).join('/');
    return {
      file,
      title: test.title,
      fullTitle,
      caseId: caseIdOf(test.title),
      line: test.location.line,
      tags: [...new Set(test.tags)],
      // A top-level describe mirrors a workbook Sub-Area; a file without one is its own suite.
      suiteTitle: titles.length > 1 ? titles[0] : path.basename(file),
      area: area && !area.startsWith('..') ? area : null
    };
  }

  private async post<T>(body: unknown): Promise<T | null> {
    if (!this.enabled) return null;
    try {
      return JSON.parse(await request(`${this.url}/api/ingest/runs`, this.token!, JSON.stringify(body))) as T;
    } catch (error) {
      this.enabled = false;
      console.warn(`Dashboard reporter disabled for this run: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }
}

// node:http rather than fetch: undici's pooled keep-alive sockets, still open when Playwright exits,
// crash Node on Windows (`Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)`, exit 127).
function request(url: string, token: string, body: string): Promise<string> {
  const target = new URL(url);
  const send = target.protocol === 'https:' ? https.request : http.request;

  return new Promise((resolve, reject) => {
    const req = send(
      target,
      {
        method: 'POST',
        agent: false,
        timeout: REQUEST_TIMEOUT_MS,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          Authorization: `Bearer ${token}`,
          Connection: 'close'
        }
      },
      (res) => {
        let text = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => (text += chunk));
        res.on('end', () => {
          const status = res.statusCode ?? 0;
          if (status >= 200 && status < 300) resolve(text);
          else reject(new Error(`HTTP ${status}: ${text.slice(0, 300)}`));
        });
      }
    );
    req.on('timeout', () => req.destroy(new Error(`timed out after ${REQUEST_TIMEOUT_MS} ms`)));
    req.on('error', reject);
    req.end(body);
  });
}
