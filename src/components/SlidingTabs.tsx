// Transitions.dev — Tabs sliding (React, self-contained)
// Adapted for Psykie: Pastel Pink & Warm Cream with Rectangles & Rounded Corners
import { useEffect, useRef, useState } from "react";

const __TRANSITION_STYLES = `
:root {
  --tabs-dur: 250ms;
  --tabs-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --tabs-text-muted: #8E7A94;
  --tabs-text-active: #BE185D;
  --tabs-bar-bg: #F8F3FC;
  --tabs-pill-bg: rgba(253, 242, 248, 0.85);
}

.t-tabs {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 14px;
  background: var(--tabs-bar-bg);
  box-shadow: 
    inset 2px 2px 5px rgba(184, 155, 217, 0.18),
    inset -2px -2px 5px rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(234, 224, 250, 0.75);
}
.t-tab {
  position: relative;
  appearance: none;
  border: 0;
  background: transparent;
  height: 32px;
  padding: 4px 16px;
  color: var(--tabs-text-muted);
  cursor: pointer;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  z-index: 1;
  transition: color var(--tabs-dur) var(--tabs-ease);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.t-tab:not([aria-selected="true"]):hover,
.t-tab[aria-selected="true"] {
  color: var(--tabs-text-active);
  font-weight: 700;
}

.t-tabs-pill {
  position: absolute;
  top: 4px;
  left: 0;
  height: 32px;
  width: 0;
  background: var(--tabs-pill-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1.5px solid rgba(244, 114, 182, 0.65);
  border-radius: 10px;
  transform: translateX(0);
  box-shadow: 
    0 4px 12px -2px rgba(236, 72, 153, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.95);
  transition:
    transform var(--tabs-dur) var(--tabs-ease),
    width     var(--tabs-dur) var(--tabs-ease);
  will-change: transform, width;
  z-index: 0;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .t-tabs-pill, .t-tab { transition: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p16")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p16";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface SlidingTabsProps {
  tabs: string[];
  selectedIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function SlidingTabs({ tabs, selectedIndex, onChange, className = "" }: SlidingTabsProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [internalActive, setInternalActive] = useState(0);

  const active = selectedIndex !== undefined ? selectedIndex : internalActive;

  const moveTo = (idx: number, animate: boolean) => {
    const tab = tabRefs.current[idx];
    const pill = pillRef.current;
    if (!tab || !pill) return;
    const left = tab.offsetLeft;
    const width = tab.offsetWidth;
    if (!animate) {
      const prev = pill.style.transition;
      pill.style.transition = "none";
      pill.style.transform = `translateX(${left}px)`;
      pill.style.width = `${width}px`;
      void pill.offsetWidth;
      pill.style.transition = prev;
    } else {
      pill.style.transform = `translateX(${left}px)`;
      pill.style.width = `${width}px`;
    }
  };

  useEffect(() => {
    const id = window.requestAnimationFrame(() => moveTo(active, false));
    const onResize = () => moveTo(active, false);
    window.addEventListener("resize", onResize);
    return () => {
      window.cancelAnimationFrame(id);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  const handleTabClick = (i: number) => {
    if (selectedIndex === undefined) {
      setInternalActive(i);
    }
    moveTo(i, true);
    onChange?.(i);
  };

  return (
    <div ref={rootRef} className={`t-tabs ${className}`} role="tablist">
      <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
      {tabs.map((label, i) => (
        <button
          key={label}
          ref={(el) => { tabRefs.current[i] = el; }}
          type="button"
          className="t-tab"
          role="tab"
          aria-selected={i === active}
          onClick={() => handleTabClick(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
