// Transitions.dev — Panel reveal (React, self-contained)
import React from "react";

const __TRANSITION_STYLES = `
:root {
  --panel-open-dur: 400ms;
  --panel-close-dur: 350ms;
  --panel-translate-y: calc(187px * 0.5);
  --panel-blur: 2px;
  --panel-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-panel-slide {
  transform: translateY(var(--panel-translate-y));
  opacity: 0;
  filter: blur(var(--panel-blur));
  pointer-events: none;
  transition:
    transform var(--panel-close-dur) var(--panel-ease),
    opacity   var(--panel-close-dur) var(--panel-ease),
    filter    var(--panel-close-dur) var(--panel-ease);
  will-change: transform, opacity, filter;
}
.t-panel-slide[data-open="true"] {
  transform: translateY(0);
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
  transition:
    transform var(--panel-open-dur) var(--panel-ease),
    opacity   var(--panel-open-dur) var(--panel-ease),
    filter    var(--panel-open-dur) var(--panel-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-panel-slide { transition: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p3")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p3";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface PanelRevealProps {
  children: React.ReactNode;
  isOpen?: boolean;
  className?: string;
}

export function PanelReveal({ children, isOpen = true, className = "" }: PanelRevealProps) {
  return (
    <div style={{ overflow: "hidden" }} className={`rounded-xl ${className}`}>
      <div className="t-panel-slide" data-open={isOpen ? "true" : "false"}>
        {children}
      </div>
    </div>
  );
}
