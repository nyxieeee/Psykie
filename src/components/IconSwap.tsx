// Transitions.dev — Icon swap (React, self-contained)
import React, { useState } from "react";

const __TRANSITION_STYLES = `
:root {
  --icon-swap-dur: 250ms;
  --icon-swap-blur: 2px;
  --icon-swap-start-scale: 0.25;
  --icon-swap-ease: ease-in-out;
}

.t-icon-swap {
  position: relative;
  display: inline-grid;
  align-items: center;
  justify-content: center;
}
.t-icon-swap .t-icon {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    opacity   var(--icon-swap-dur) var(--icon-swap-ease),
    filter    var(--icon-swap-dur) var(--icon-swap-ease),
    transform var(--icon-swap-dur) var(--icon-swap-ease);
  will-change: opacity, filter, transform;
}
.t-icon-swap[data-state="a"] .t-icon[data-icon="a"],
.t-icon-swap[data-state="b"] .t-icon[data-icon="b"] {
  opacity: 1;
  filter: blur(0);
  transform: scale(1);
  pointer-events: auto;
}
.t-icon-swap[data-state="a"] .t-icon[data-icon="b"],
.t-icon-swap[data-state="b"] .t-icon[data-icon="a"] {
  opacity: 0;
  filter: blur(var(--icon-swap-blur));
  transform: scale(var(--icon-swap-start-scale));
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .t-icon-swap .t-icon { transition: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p5")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p5";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface IconSwapProps {
  iconA: React.ReactNode;
  iconB: React.ReactNode;
  state?: "a" | "b";
  onToggle?: (nextState: "a" | "b") => void;
  className?: string;
  ariaLabel?: string;
}

export function IconSwap({
  iconA,
  iconB,
  state: controlledState,
  onToggle,
  className = "",
  ariaLabel = "Toggle icon"
}: IconSwapProps) {
  const [internalState, setInternalState] = useState<"a" | "b">("a");
  const currentState = controlledState !== undefined ? controlledState : internalState;

  const handleToggle = () => {
    const next = currentState === "a" ? "b" : "a";
    if (controlledState === undefined) {
      setInternalState(next);
    }
    onToggle?.(next);
  };

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleToggle}
      className={`inline-flex items-center justify-center p-1.5 rounded-lg text-neutral-600 hover:text-pink-600 hover:bg-pink-50 transition-colors focus:outline-none ${className}`}
    >
      <span className="t-icon-swap" data-state={currentState}>
        <span className="t-icon" data-icon="a">{iconA}</span>
        <span className="t-icon" data-icon="b">{iconB}</span>
      </span>
    </button>
  );
}
