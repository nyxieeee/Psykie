// Transitions.dev — Accordion expand (React, self-contained)
// Adapted for Psykie: Pastel Pink & Warm Cream with Rectangles & Rounded Corners
import React, { useState } from "react";

const __TRANSITION_STYLES = `
:root {
  --acc-expand: 250ms;
  --acc-collapse: 250ms;
  --acc-chevron: 250ms;
  --acc-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-acc {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(241, 227, 235, 0.8);
  border-radius: 12px; /* Rectangles with rounded corners */
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.t-acc[data-open="true"] {
  border-color: rgba(244, 167, 199, 0.7);
  box-shadow: 0 4px 12px -2px rgba(219, 39, 119, 0.05);
}

.t-acc-head {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  color: #261822;
  text-align: left;
  transition: background-color 0.15s ease;
}
.t-acc-head:hover {
  background: rgba(253, 242, 246, 0.5);
}

.t-acc-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--acc-collapse) var(--acc-ease);
}
.t-acc[data-open="true"] .t-acc-panel {
  grid-template-rows: 1fr;
  transition: grid-template-rows var(--acc-expand) var(--acc-ease);
}

.t-acc-panel-inner {
  overflow: hidden;
  opacity: 0;
  filter: blur(2px);
  padding: 0 16px;
  transition:
    opacity var(--acc-collapse) var(--acc-ease),
    filter var(--acc-collapse) var(--acc-ease),
    padding var(--acc-collapse) var(--acc-ease);
}
.t-acc[data-open="true"] .t-acc-panel-inner {
  opacity: 1;
  filter: blur(0);
  padding: 4px 16px 16px 16px;
  transition:
    opacity var(--acc-expand) var(--acc-ease),
    filter var(--acc-expand) var(--acc-ease),
    padding var(--acc-expand) var(--acc-ease);
}

.t-acc-chevron {
  display: inline-flex;
  transform: scaleY(1);
  transform-origin: center;
  transition: transform var(--acc-chevron) var(--acc-ease);
  color: #7A6572;
}
.t-acc-chevron path { vector-effect: non-scaling-stroke; }
.t-acc[data-open="true"] .t-acc-chevron {
  transform: scaleY(-1);
  color: #DB2777;
}

@media (prefers-reduced-motion: reduce) {
  .t-acc-panel, .t-acc-panel-inner, .t-acc-chevron {
    transition: none !important;
  }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p21")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p21";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  badge?: React.ReactNode;
}

export function Accordion({ title, children, defaultOpen = false, className = "", badge }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`t-acc ${className}`} data-open={open ? "true" : "false"}>
      <button
        type="button"
        className="t-acc-head"
        aria-expanded={open ? "true" : "false"}
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-2.5">
          <span>{title}</span>
          {badge}
        </div>
        <span className="t-acc-chevron" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6.5L8 10.5L12 6.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      <div className="t-acc-panel">
        <div className="t-acc-panel-inner">{children}</div>
      </div>
    </div>
  );
}
