// Transitions.dev — Success check (React, self-contained)
import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";

const __TRANSITION_STYLES = `
:root {
  --check-opacity-dur: 500ms;
  --check-rotate-dur: 500ms;
  --check-rotate-from: 80deg;
  --check-bob-dur: 500ms;
  --check-y-amount: 20px;
  --check-blur-dur: 500ms;
  --check-blur-from: 6px;
  --check-path-dur: 500ms;
  --check-path-delay: 80ms;
  --check-ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --check-ease-opacity: cubic-bezier(0.22, 1, 0.36, 1);
  --check-ease-rotate: cubic-bezier(0.22, 1, 0.36, 1);
  --check-ease-bob: cubic-bezier(0.34, 1.35, 0.64, 1);
  --check-ease-path: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-success-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  opacity: 0;
  will-change: transform, opacity, filter;
}
.t-success-check svg { display: block; overflow: visible; }
.t-success-check svg path {
  stroke-dasharray: 40;
  stroke-dashoffset: 40;
}

.t-success-check[data-state="in"] {
  opacity: 1;
  animation:
    t-check-fade   var(--check-opacity-dur) var(--check-ease-opacity) forwards,
    t-check-rotate var(--check-rotate-dur)  var(--check-ease-rotate)  forwards,
    t-check-blur   var(--check-blur-dur)    var(--check-ease-out)     forwards,
    t-check-bob    var(--check-bob-dur)     var(--check-ease-bob)     forwards;
}
.t-success-check[data-state="in"] svg path {
  animation: t-check-draw var(--check-path-dur) var(--check-ease-path) var(--check-path-delay, 0ms) forwards;
}

@keyframes t-check-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes t-check-rotate {
  from { transform: rotate(var(--check-rotate-from)); }
  to   { transform: rotate(0deg); }
}
@keyframes t-check-blur {
  from { filter: blur(var(--check-blur-from)); }
  to   { filter: blur(0); }
}
@keyframes t-check-bob {
  from { transform: translateY(var(--check-y-amount)); }
  to   { transform: translateY(0); }
}
@keyframes t-check-draw { to { stroke-dashoffset: 0; } }

@media (prefers-reduced-motion: reduce) {
  .t-success-check { animation: none !important; opacity: 1; }
  .t-success-check svg path { animation: none !important; stroke-dashoffset: 0 !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p10")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p10";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

export interface SuccessCheckHandle {
  show: () => void;
  reset: () => void;
}

interface SuccessCheckProps {
  children?: React.ReactNode;
  active?: boolean;
  className?: string;
  size?: number;
}

export const SuccessCheck = forwardRef<SuccessCheckHandle, SuccessCheckProps>(({
  children,
  active = false,
  className = "",
  size = 20
}, ref) => {
  const [state, setState] = useState<"in" | "out">(active ? "in" : "out");
  const checkRef = useRef<HTMLSpanElement>(null);

  const show = () => {
    setState("out");
    requestAnimationFrame(() => {
      if (checkRef.current) void checkRef.current.offsetWidth;
      setState("in");
    });
  };

  const reset = () => {
    setState("out");
  };

  useImperativeHandle(ref, () => ({
    show,
    reset
  }));

  useEffect(() => {
    if (active) {
      show();
    } else {
      setState("out");
    }
  }, [active]);

  return (
    <span
      ref={checkRef}
      className={`t-success-check ${className}`}
      data-state={state}
      aria-hidden="true"
    >
      {children ? children : (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 13l4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
});

SuccessCheck.displayName = "SuccessCheck";
