// Transitions.dev — Shimmer text (React, self-contained)

const __TRANSITION_STYLES = `
:root {
  --shimmer-dur: 2200ms;
  --shimmer-base: #7A6572;
  --shimmer-highlight: #FFFFFF;
  --shimmer-band: 350%;
  --shimmer-ease: linear;
}

.t-shimmer {
  position: relative;
  display: inline-block;
  color: var(--shimmer-base);
}
.t-shimmer::before {
  content: attr(data-text);
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image: linear-gradient(
    90deg,
    transparent          0%,
    transparent         35%,
    var(--shimmer-highlight) 50%,
    transparent         65%,
    transparent        100%
  );
  background-size: var(--shimmer-band) 100%;
  background-repeat: no-repeat;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: t-shimmer var(--shimmer-dur) var(--shimmer-ease) infinite;
}
@keyframes t-shimmer {
  0%   { background-position: 100% 0; }
  100% { background-position: 0% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .t-shimmer::before { animation: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p15")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p15";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface ShimmerProps {
  children: string;
  className?: string;
}

export function Shimmer({ children, className = "" }: ShimmerProps) {
  return (
    <span className={`t-shimmer ${className}`} data-text={children}>
      {children}
    </span>
  );
}
