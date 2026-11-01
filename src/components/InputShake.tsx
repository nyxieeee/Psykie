// Transitions.dev — Error state shake (React, self-contained)
import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";

const __TRANSITION_STYLES = `
:root {
  --shake-distance: 6px;
  --shake-overshoot: 4px;
  --shake-dur-a: 80ms;
  --shake-dur-b: 60ms;
  --shake-ease: cubic-bezier(0.22, 1, 0.36, 1);
  --revert-hold: 3000ms;
  --revert-dur: 280ms;
}

.t-input-wrap {
  width: 100%;
}

.t-input {
  transition: border-color 150ms ease-out;
  will-change: transform;
}
.t-input.is-error {
  transition: border-color var(--revert-dur, 280ms) ease-out;
}

.t-error-msg {
  opacity: 0;
  visibility: hidden;
  font-size: 12px;
  color: #BE185D;
  margin-top: 4px;
  margin-bottom: 0;
  font-weight: 500;
  transition:
    opacity    var(--revert-dur, 280ms) ease-out,
    visibility 0s linear var(--revert-dur, 280ms);
}
.t-input-wrap.is-error .t-error-msg {
  opacity: 1;
  visibility: visible;
  transition:
    opacity    var(--revert-dur, 280ms) ease-out,
    visibility 0s linear 0s;
}

.t-input.is-shaking {
  animation: t-input-shake calc(
      var(--shake-dur-a) * 2 + var(--shake-dur-b) * 2
    ) linear;
}
@keyframes t-input-shake {
  0%      { transform: translateX(0);                                 animation-timing-function: var(--shake-ease); }
  28.57%  { transform: translateX(var(--shake-distance));             animation-timing-function: var(--shake-ease); }
  57.14%  { transform: translateX(calc(var(--shake-distance) * -1)); animation-timing-function: var(--shake-ease); }
  78.57%  { transform: translateX(var(--shake-overshoot));            animation-timing-function: var(--shake-ease); }
  100%    { transform: translateX(0); }
}

@media (prefers-reduced-motion: reduce) {
  .t-input { animation: none !important; transform: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-p12")) {
  const __style = document.createElement("style");
  __style.id = "transitions-p12";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

function readMs(name: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name).trim();
  const n = parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

export interface InputShakeHandle {
  trigger: () => void;
  cancel: () => void;
}

interface InputShakeProps {
  children: React.ReactNode;
  message?: string;
  onCancel?: () => void;
  className?: string;
}

export const InputShake = forwardRef<InputShakeHandle, InputShakeProps>(({
  children,
  message = "Please provide valid input.",
  onCancel,
  className = ""
}, ref) => {
  const inputRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const [error, setError] = useState(false);

  const trigger = () => {
    if (!inputRef.current) return;
    setError(true);
    inputRef.current.classList.remove("is-shaking");
    void inputRef.current.offsetWidth;
    inputRef.current.classList.add("is-shaking");

    if (timerRef.current) window.clearTimeout(timerRef.current);
    const shakeMs =
      readMs("--shake-dur-a", 80) * 2 +
      readMs("--shake-dur-b", 60) * 2;
    const hold = readMs("--revert-hold", 3000);
    timerRef.current = window.setTimeout(() => {
      setError(false);
      timerRef.current = null;
    }, shakeMs + hold);
  };

  const cancel = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setError(false);
    onCancel?.();
  };

  useImperativeHandle(ref, () => ({
    trigger,
    cancel
  }));

  return (
    <div className={`t-input-wrap ${error ? "is-error" : ""} ${className}`}>
      <div
        ref={inputRef}
        className={`t-input ${error ? "is-error" : ""}`}
        onInput={cancel}
      >
        {children}
      </div>
      {message && <p className="t-error-msg">{message}</p>}
    </div>
  );
});

InputShake.displayName = "InputShake";
