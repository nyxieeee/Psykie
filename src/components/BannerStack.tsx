// Transitions.dev — Banner stacking (React, self-contained)
// Adapted for Psykie: Liquid Glass with Rectangles & Rounded Corners
import { useState } from "react";
import { Sparkle, X } from "@phosphor-icons/react";

const __TRANSITION_STYLES = `
:root {
  --stack-open: 350ms;
  --stack-close: 250ms;
  --stack-rise: 60px;
  --stack-blur: 2px;
  --stack-scale: 0.97;
  --stack-peek: 12px;
  --stack-spread-gap: 8px;
  --stack-depth-scale: 0.06;
  --stack-depth-fade: 0.4;
  --stack-depth1-blur: 1px;
  --stack-depth2-blur: 2px;
  --stack-ease: cubic-bezier(0.22, 1, 0.36, 1);
}

.t-stack {
  position: relative;
  width: 100%;
  min-height: 54px;
}
.t-stack-banner {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  transform-origin: 50% 50%;
  filter: blur(0);
  will-change: transform, opacity, filter;
  transition:
    transform var(--stack-open) var(--stack-ease),
    opacity var(--stack-open) var(--stack-ease),
    filter var(--stack-open) var(--stack-ease);
}
.t-stack-banner[data-depth="0"] {
  z-index: 3;
  transform: translateY(0) scale(1);
  opacity: 1;
}
.t-stack-banner[data-depth="1"] {
  z-index: 2;
  transform-origin: 50% 100%;
  transform: translateY(calc(var(--stack-peek) * -1))
             scale(calc(1 - var(--stack-depth-scale)));
  opacity: calc(1 - var(--stack-depth-fade));
  filter: blur(var(--stack-depth1-blur));
}
.t-stack-banner[data-depth="2"] {
  z-index: 1;
  transform-origin: 50% 100%;
  transform: translateY(calc(var(--stack-peek) * -2))
             scale(calc(1 - var(--stack-depth-scale) * 2));
  opacity: calc(1 - var(--stack-depth-fade) * 1.6);
  filter: blur(var(--stack-depth2-blur));
}
.t-stack.is-spread .t-stack-banner[data-depth="1"],
.t-stack.is-spread .t-stack-banner[data-depth="2"] {
  opacity: 1;
  filter: blur(0);
}
.t-stack.is-spread .t-stack-banner[data-depth="1"] {
  transform: translateY(calc((100% + var(--stack-spread-gap)) * -1)) scale(1);
}
.t-stack.is-spread .t-stack-banner[data-depth="2"] {
  transform: translateY(calc((100% + var(--stack-spread-gap)) * -2)) scale(1);
}
.t-stack-banner.is-enter {
  transition: none;
  transform: translateY(var(--stack-rise)) scale(var(--stack-scale));
  opacity: 0;
  filter: blur(var(--stack-blur));
}
.t-stack-banner.is-leaving {
  z-index: 0;
  transform-origin: 50% 100%;
  transform: translateY(calc(var(--stack-peek) * -3))
             scale(calc(1 - var(--stack-depth-scale) * 3));
  opacity: 0;
  filter: blur(var(--stack-blur));
  transition:
    transform var(--stack-close) var(--stack-ease),
    opacity var(--stack-close) var(--stack-ease),
    filter var(--stack-close) var(--stack-ease);
}

@media (prefers-reduced-motion: reduce) {
  .t-stack-banner { transition: none !important; transform: none !important; filter: none !important; }
}
`;

if (typeof document !== "undefined" && !document.getElementById("transitions-banner-stack")) {
  const __style = document.createElement("style");
  __style.id = "transitions-banner-stack";
  __style.textContent = __TRANSITION_STYLES;
  document.head.appendChild(__style);
}

export interface BannerItem {
  id: string;
  badge?: string;
  title: string;
  actionText?: string;
  onAction?: () => void;
}

interface BannerStackProps {
  banners: BannerItem[];
  onDismiss?: (id: string) => void;
  className?: string;
}

export function BannerStack({ banners, onDismiss, className = "" }: BannerStackProps) {
  const [isSpread, setIsSpread] = useState(false);

  if (!banners || banners.length === 0) return null;

  // We show up to 3 stacked banners
  const visibleBanners = banners.slice(0, 3);

  return (
    <div
      className={`t-stack ${isSpread ? "is-spread" : ""} ${className}`}
      onMouseEnter={() => setIsSpread(true)}
      onMouseLeave={() => setIsSpread(false)}
    >
      {visibleBanners.map((item, index) => (
        <div
          key={item.id}
          className="t-stack-banner"
          data-depth={index}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-xl border border-pink-200/60 shadow-lg shadow-pink-900/5 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 flex-shrink-0">
                <Sparkle size={16} weight="fill" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {item.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-pink-50 text-pink-700 border border-pink-200 rounded-md">
                    {item.badge}
                  </span>
                )}
                <span className="text-xs font-medium text-neutral-800">{item.title}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {item.actionText && (
                <button
                  type="button"
                  onClick={item.onAction}
                  className="text-xs font-semibold text-pink-600 hover:text-pink-700 px-2.5 py-1 rounded-lg hover:bg-pink-50 transition-colors"
                >
                  {item.actionText}
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={() => onDismiss(item.id)}
                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-pink-50 transition-colors"
                  aria-label="Dismiss banner"
                >
                  <X size={14} weight="bold" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
