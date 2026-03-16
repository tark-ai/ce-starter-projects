function CEGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 914 1000"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Commerce Engine"
    >
      <path d="M365.436 1000H776.54L913.575 863.655V727.311H365.436V1000Z" fill="#00BF6F" />
      <path d="M274.069 1000H137.081L0.0461426 863.655V727.311H274.069V1000Z" fill="#8EDD65" />
      <path d="M274.069 363.639H0V636.328H274.069V363.639Z" fill="#3CDBC0" />
      <path
        d="M776.54 636.363H502.409C466.163 636.363 431.401 621.998 405.771 596.428C380.142 570.859 365.743 536.179 365.743 500.018C365.743 463.858 380.142 429.178 405.771 403.608C431.401 378.039 466.163 363.674 502.409 363.674H776.54C812.786 363.674 847.547 378.039 873.177 403.608C898.807 429.178 913.206 463.858 913.206 500.018C913.206 536.179 898.807 570.859 873.177 596.428C847.547 621.998 812.786 636.363 776.54 636.363Z"
        fill="#8EDD65"
      />
      <path
        d="M776.509 272.724C749.495 272.651 723.108 264.593 700.682 249.567C678.256 234.541 660.796 213.222 650.509 188.302C640.221 163.382 637.567 135.979 642.882 109.555C648.197 83.1311 661.242 58.8712 680.37 39.8399C699.498 20.8085 723.85 7.85942 750.35 2.62827C776.851 -2.60288 804.311 0.118578 829.262 10.4489C854.213 20.7792 875.536 38.2549 890.536 60.6686C905.537 83.0823 913.543 109.429 913.543 136.379C913.47 172.581 898.997 207.274 873.304 232.839C847.61 258.403 812.796 272.748 776.509 272.724Z"
        fill="#3CDBC0"
      />
      <path d="M548.139 0H137.081L0 136.36V272.704H548.2L548.139 0Z" fill="#00BF6F" />
    </svg>
  );
}

export function PoweredByBadge() {
  return (
    <a
      href="https://www.commercengine.io"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-lg"
    >
      <CEGlyph className="h-4 w-4 shrink-0" />
      <span className="text-xs font-medium text-neutral-700 whitespace-nowrap">
        Powered by Commerce Engine
      </span>
    </a>
  );
}
