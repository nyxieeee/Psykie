import { ViewportOverlay } from './ViewportOverlay'
// Transitions.dev — Modal open / close (React, self-contained)
// Adapted for Psykie: 3D Liquid Glass with Rectangles & Rounded Corners
import React, { useEffect, useState } from "react";
import { X } from "@phosphor-icons/react";

const __TRANSITION_STYLES = `
:root {
  --modal-open-dur: 250ms;
  --modal-close-dur: 150ms;
  --modal-scale: 0.96;
  --modal-scale-close: 0.96;
  --modal-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(25, 13, 22, 0.25);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--modal-open-dur) var(--modal-ease);
}
.t-modal-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}
.t-modal-backdrop.is-closing {
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--modal-close-dur) var(--modal-ease);
}

.t-modal {
  transform-origin: center;
  transform: scale(var(--modal-scale));
  opacity: 0;
  pointer-events: none;
  transition:
    transform var(--modal-open-dur) var(--modal-ease),
    opacity   var(--modal-open-dur) var(--modal-ease);
  will-change: transform, opacity;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 16px; /* Rectangles with rounded corners */
  box-shadow:
    0 20px 40px -15px rgba(219, 39, 119, 0.12),
    0 8px 16px -6px rgba(0, 0, 0, 0.06),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.9);
  width: 100%;
  max-width: 560px;
  overflow: hidden;
}
.t-modal.is-open {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}
.t-modal.is-closing {
  transform: scale(var(--modal-scale-close));
  opacity: 0;
  pointer-events: none;
  transition:
    transform var(--modal-close-dur) var(--modal-ease),
    opacity   var(--modal-close-dur) var(--modal-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-modal, .t-modal-backdrop { transition: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p7")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p7";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

function readMs(name: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

interface TransitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function TransitionsModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth
}: TransitionsModalProps) {
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");

  useEffect(() => {
    if (isOpen) {
      setState("open");
    } else {
      setState(prev => (prev === "open" ? "closing" : prev));
    }
  }, [isOpen]);

  useEffect(() => {
    if (state !== "closing") return;
    const ms = readMs("--modal-close-dur", 150);
    const id = window.setTimeout(() => {
      setState("closed");
      onClose();
    }, ms);
    return () => window.clearTimeout(id);
  }, [state, onClose]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && state === "open") {
        setState("closing");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state]);

  if (state === "closed") return null;

  return (
    <ViewportOverlay onDismiss={() => setState("closing")}
      className={
        "t-modal-backdrop" +
        (state === "open" ? " is-open" : "") +
        (state === "closing" ? " is-closing" : "")
      }
      onClick={() => setState("closing")}
    >
      <div
        style={maxWidth ? { maxWidth } : undefined}
        className={
          "t-modal" +
          (state === "open" ? " is-open" : "") +
          (state === "closing" ? " is-closing" : "")
        }
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100/60">
            <h3 className="text-base font-semibold text-neutral-800 tracking-tight">{title}</h3>
            <button
              type="button"
              onClick={() => setState("closing")}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-pink-50 transition-colors"
              aria-label="Close modal"
            >
              <X size={18} weight="bold" />
            </button>
          </div>
        )}
        <div className="p-5">
          {children}
        </div>
      </div>
    </ViewportOverlay>
  );
}
