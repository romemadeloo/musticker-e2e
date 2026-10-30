import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <h1 className="text-lg font-semibold">Not found</h1>
        <p className="mt-1 text-sm text-ink-2">It may have been deleted or pruned by the retention policy.</p>
        <Link href="/" className="btn mt-4">
          Back to dashboard
        </Link>
      </div>
    </main>
  );
}
