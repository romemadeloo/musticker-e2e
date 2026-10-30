'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button className="btn" type="button" onClick={() => window.print()}>
      <Printer size={14} aria-hidden /> Print / PDF
    </button>
  );
}
