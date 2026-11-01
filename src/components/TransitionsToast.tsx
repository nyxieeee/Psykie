// Transitions.dev — Toast open / close (React, self-contained)
// Adapted for Psykie: Liquid Glass with Rectangles & Rounded Corners
import { useEffect } from "react";
import { CheckCircle, Info, WarningCircle, X } from "@phosphor-icons/react";

const __TRANSITION_STYLES = `
:root {
  --toast-open: 350ms;
  --toast-close: 250ms;
  --toast-distance: 16px;
  --toast-blur: 2px;
  --toast-scale: 0.97;
  --toast-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-toast {
  opacity: 0;
  transform: translateY(var(--toast-distance)) scale(var(--toast-scale));
  filter: blur(var(--toast-blur));
  will-change: transform, opacity, filter;
  transition:
    opacity var(--toast-close) var(--toast-ease),
    transform var(--toast-close) var(--toast-ease),
    filter var(--toast-close) var(--toast-ease);
  pointer-events: none;
}
.t-toast.is-open {
  opacity: 1;
  transform: translateY(0) scale(1);
  filter: blur(0);
  pointer-events: auto;
  transition:
    opacity var(--toast-open) var(--toast-ease),
    transform var(--toast-open) var(--toast-ease),
    filter var(--toast-open) var(--toast-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-toast { transition: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p22")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p22";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

interface TransitionsToastProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  type?: "success" | "info" | "warning";
  durationMs?: number;
}

export function TransitionsToast({
  isOpen,
  onClose,
  title,
  description,
  type = "success",
  durationMs = 4000
}: TransitionsToastProps) {
  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => {
      onClose();
    }, durationMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, durationMs, onClose]);

  const icons = {
    success: <CheckCircle size={20} weight="fill" className="text-emerald-500 flex-shrink-0" />,
    info: <Info size={20} weight="fill" className="text-pink-500 flex-shrink-0" />,
    warning: <WarningCircle size={20} weight="fill" className="text-amber-500 flex-shrink-0" />
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <div
        className={`t-toast ${isOpen ? "is-open" : ""}`}
        role="status"
        aria-hidden={!isOpen}
      >
        <div className="flex items-start gap-3 p-4 min-w-[300px] max-w-[400px] bg-white/95 backdrop-blur-xl border border-white/90 shadow-xl shadow-pink-900/5 rounded-xl">
          {icons[type]}
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-neutral-800 leading-tight">{title}</h4>
            {description && <p className="text-xs text-neutral-500 mt-1 leading-normal">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-pink-50 transition-colors"
            aria-label="Close notification"
          >
            <X size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}
