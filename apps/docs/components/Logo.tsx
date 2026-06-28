/** Tessera mark: hexagon cluster with the detached coral tile (the "ejected component"). */
export function Logo({ size = 28 }: { size?: number }) {
  const hex = "M8 0 L15 4 L15 12 L8 16 L1 12 L1 4 Z";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient id="tessera-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <g fill="url(#tessera-grad)">
        <path d={hex} transform="translate(9 4)" />
        <path d={hex} transform="translate(2 16)" />
        <path d={hex} transform="translate(16 16)" />
        <path d={hex} transform="translate(9 28)" />
        <path d={hex} transform="translate(23 28)" />
      </g>
      <path d={hex} transform="translate(30 2)" fill="#ff6b5e" />
    </svg>
  );
}
