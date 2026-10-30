// Decorative illustration for the welcome card: a browser window running a test, with floating
// result chips. Pure SVG + CSS motion, so it themes with the card and costs no image request.
export function HeroArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute right-0 bottom-0 hidden h-full w-[46%] sm:block">
      <div className="absolute top-6 right-10 h-24 w-24 rounded-full bg-white/10" />
      <div className="absolute right-[42%] bottom-6 h-12 w-12 rounded-full bg-white/10" />
      <svg viewBox="0 0 260 200" className="absolute right-4 bottom-0 h-[92%]">
        <defs>
          <linearGradient id="hero-window" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#e3f3ff" stopOpacity="0.95" />
          </linearGradient>
        </defs>
        <rect x="30" y="34" width="190" height="166" rx="16" fill="url(#hero-window)" />
        <rect x="30" y="34" width="190" height="28" rx="16" fill="#cfe9ff" />
        <rect x="30" y="50" width="190" height="12" fill="#cfe9ff" />
        <circle cx="48" cy="48" r="4.5" fill="#f2557a" />
        <circle cx="62" cy="48" r="4.5" fill="#fab219" />
        <circle cx="76" cy="48" r="4.5" fill="#13c27a" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i} transform={`translate(48 ${80 + i * 28})`}>
            <rect width="18" height="18" rx="6" fill={i === 2 ? '#fde3ea' : '#dcf7ea'} />
            <path d={i === 2 ? 'M5.5 5.5l7 7m0-7l-7 7' : 'M4.5 9.5l3 3 6-7'} stroke={i === 2 ? '#f2557a' : '#13c27a'} strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="28" y="3" width={[96, 120, 80, 104][i]} height="5" rx="2.5" fill="#9cc9ee" />
            <rect x="28" y="11" width={[60, 72, 54, 66][i]} height="4" rx="2" fill="#cfe2f3" />
          </g>
        ))}
      </svg>
      <div className="animate-float absolute top-8 right-[52%] rounded-2xl bg-white px-3 py-2 text-[12px] font-extrabold text-[#0b7fe6] shadow-lg">
        ✓ passed
      </div>
      <div className="animate-float absolute right-2 bottom-24 rounded-2xl bg-white px-3 py-2 text-[12px] font-extrabold text-[#8965e5] shadow-lg" style={{ animationDelay: '1.2s' }}>
        @smoke
      </div>
    </div>
  );
}
