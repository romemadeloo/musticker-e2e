'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

// A thin bar across the top of the window while the next page loads. The App Router has no
// navigation events, so it starts on clicks of same-origin links and on form submits, and finishes
// when the URL changes (or after a safety timeout, e.g. a form that stays on the same page).
export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null);
  const safety = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loading = useRef(false);

  const clearTimers = () => {
    if (trickle.current) clearInterval(trickle.current);
    if (safety.current) clearTimeout(safety.current);
    if (hide.current) clearTimeout(hide.current);
  };

  const finish = useCallback(() => {
    if (!loading.current) return;
    loading.current = false;
    clearTimers();
    setProgress(100);
    hide.current = setTimeout(() => {
      setVisible(false);
      hide.current = setTimeout(() => setProgress(0), 250);
    }, 220);
  }, []);

  const start = useCallback(() => {
    if (loading.current) return;
    loading.current = true;
    clearTimers();
    setProgress(8);
    setVisible(true);
    // Fast at first, slowing as it approaches 90%; the rest waits for the page.
    trickle.current = setInterval(() => setProgress((p) => (p < 90 ? p + (90 - p) * 0.12 : p)), 200);
    safety.current = setTimeout(finish, 12_000);
  }, [finish]);

  // The URL changed: the new page has rendered.
  useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      // Same page (or an in-page anchor): nothing will load.
      if (url.pathname === location.pathname && url.search === location.search) return;
      // Route handlers that download files (CSV export) never change the URL.
      if (url.pathname.startsWith('/api/')) return;
      start();
    };
    const onSubmit = (e: SubmitEvent) => {
      if (e.defaultPrevented) return;
      start();
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('submit', onSubmit, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('submit', onSubmit, true);
    };
  }, [start]);

  useEffect(() => clearTimers, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      <div
        className="h-full rounded-r-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--accent), #8965e5)',
          boxShadow: '0 0 10px var(--accent), 0 0 4px var(--accent)',
          transition: progress === 0 ? 'none' : 'width 0.2s ease-out'
        }}
      />
    </div>
  );
}
