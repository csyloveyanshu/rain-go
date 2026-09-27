/**
 * Shared look for pieces: glossy water drops on glass. Put <DropDefs /> once inside
 * each board <svg>, then draw pieces with <Bead /> inside <g filter="url(#drop-shadow)">.
 * Units are board units (1 = one grid step).
 */
export function DropDefs() {
  return (
    <defs>
      <filter id="goo" x="-5%" y="-5%" width="110%" height="110%">
        <feGaussianBlur stdDeviation="0.09" />
        <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
      </filter>
      <filter id="drop-shadow" x="-5%" y="-5%" width="110%" height="115%">
        <feDropShadow dx="0.04" dy="0.09" stdDeviation="0.07" floodOpacity="0.28" />
      </filter>
      <radialGradient id="ink" cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#3a3a3a" />
        <stop offset="0.55" stopColor="#0b0b0b" />
        <stop offset="1" stopColor="#000" />
      </radialGradient>
      <radialGradient id="milk" cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.7" stopColor="#ecece8" />
        <stop offset="1" stopColor="#c9c9c4" />
      </radialGradient>
    </defs>
  );
}

/** Highlights that make a disc read as a drop. */
export function Sheen({ x, y, r = 0.41, dark }: { x: number; y: number; r?: number; dark: boolean }) {
  const k = r / 0.41;
  return (
    <g pointerEvents="none">
      <ellipse
        cx={x - 0.13 * k}
        cy={y - 0.17 * k}
        rx={0.13 * k}
        ry={0.07 * k}
        transform={`rotate(-30 ${x - 0.13 * k} ${y - 0.17 * k})`}
        fill="#fff"
        opacity={dark ? 0.55 : 0.95}
      />
      <path
        d={`M${x - 0.22 * k} ${y + 0.25 * k} Q${x} ${y + 0.38 * k} ${x + 0.24 * k} ${y + 0.22 * k}`}
        stroke="#fff"
        strokeWidth={0.035 * k}
        fill="none"
        strokeLinecap="round"
        opacity={dark ? 0.16 : 0.6}
      />
    </g>
  );
}

/** One drop-shaped piece. `dark` picks ink (black) or milk (white). */
export function Bead({
  x,
  y,
  r = 0.41,
  dark,
  className,
  opacity,
  standalone = false,
}: {
  x: number;
  y: number;
  r?: number;
  dark: boolean;
  className?: string;
  opacity?: number;
  /**
   * Draw the drop without url(#...) paints or SVG filters. This layered version
   * is intentionally conservative for mobile WebKit, where duplicate SVG ids
   * and animated filtered groups can occasionally make the painted body vanish.
   */
  standalone?: boolean;
}) {
  if (standalone) {
    const edge = dark ? "#000" : "#c9c9c4";
    const body = dark ? "#090909" : "#ecece8";
    const crown = dark ? "#303030" : "#fff";

    return (
      <g className={className} opacity={opacity}>
        {/* A tiny offset base gives depth without an SVG filter. */}
        <circle cx={x + r * 0.035} cy={y + r * 0.08} r={r} fill="#000" opacity={dark ? 0.3 : 0.18} />
        <circle cx={x} cy={y} r={r} fill={edge} />
        <circle cx={x} cy={y - r * 0.025} r={r * 0.94} fill={body} />
        {/* The lighter upper disc and shared sheen keep the water-drop look. */}
        <circle cx={x - r * 0.07} cy={y - r * 0.11} r={r * 0.72} fill={crown} opacity={dark ? 0.42 : 0.7} />
        <Sheen x={x} y={y} r={r} dark={dark} />
      </g>
    );
  }

  return (
    <g className={className} opacity={opacity}>
      <circle cx={x} cy={y} r={r} fill={dark ? "url(#ink)" : "url(#milk)"} stroke={dark ? "none" : "rgb(0 0 0 / 0.12)"} strokeWidth={0.015} />
      <Sheen x={x} y={y} r={r} dark={dark} />
    </g>
  );
}

/** Thin ring on the last move plus an optional one-shot ripple (re-keyed by `k`). */
export function LastMark({ x, y, r = 0.51, dark, k, ripple = true }: { x: number; y: number; r?: number; dark: boolean; k: number | string; ripple?: boolean }) {
  const stroke = dark ? "#0b0b0b" : "#8f8f8b";
  return (
    <g pointerEvents="none">
      <circle cx={x} cy={y} r={r} fill="none" stroke={stroke} strokeWidth={0.03} opacity={0.5} />
      {ripple && <circle key={k} className="ripple" cx={x} cy={y} r={r} fill="none" stroke={stroke} strokeWidth={0.03} />}
    </g>
  );
}
