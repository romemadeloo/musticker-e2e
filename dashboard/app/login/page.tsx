import { signIn, sendMagicLink } from './actions';

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; sent?: string }> }) {
  const { next = '/', error, sent } = await searchParams;

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="card w-full max-w-sm p-6">
        <div className="mb-5 flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-xs font-bold text-white">PW</div>
          <div>
            <h1 className="text-base font-semibold">Musticker QA Dashboard</h1>
            <p className="text-xs text-muted">Sign in with your Supabase account</p>
          </div>
        </div>

        {error && <p className="mb-3 text-sm text-critical-text">{error}</p>}
        {sent && <p className="mb-3 text-sm text-good-text">Check your inbox for a sign-in link.</p>}

        <form className="space-y-3">
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
          <button formAction={signIn} className="btn btn-primary w-full justify-center">
            Sign in
          </button>
          <button formAction={sendMagicLink} formNoValidate className="btn w-full justify-center">
            Email me a sign-in link
          </button>
        </form>
        <p className="mt-4 text-xs text-muted">Accounts are created by an admin in Supabase → Authentication → Users.</p>
      </div>
    </main>
  );
}
