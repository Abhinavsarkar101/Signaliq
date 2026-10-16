import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HelpCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HelpTooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'auto';
  className?: string;
}

export const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  position = 'auto',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; placeAbove: boolean } | null>(null);

  // Safe theme detection
  let isDarkMode = false;
  try {
    const themeContext = useTheme();
    isDarkMode = themeContext.isDark;
  } catch {
    isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  }

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = 260; // Card max width
    const tooltipHeight = 70; // Card approximate height
    
    // Calculate horizontal center, clamped inside viewport
    let left = rect.left + rect.width / 2;
    if (left - tooltipWidth / 2 < 12) {
      left = 12 + tooltipWidth / 2;
    } else if (left + tooltipWidth / 2 > window.innerWidth - 12) {
      left = window.innerWidth - 12 - tooltipWidth / 2;
    }

    // Determine whether to place above or below
    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove =
      position === 'top'
        ? true
        : position === 'bottom'
        ? false
        : spaceAbove > tooltipHeight + 16 || spaceAbove > spaceBelow;

    const top = placeAbove ? rect.top - 8 : rect.bottom + 8;
    setCoords({ top, left, placeAbove });
  };

  const handleMouseEnter = () => {
    updatePosition();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updatePosition();
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  const arrowBgColor = isDarkMode ? '#0f172a' : '#ffffff';
  const arrowBorderColor = isDarkMode ? '#334155' : '#cbd5e1';

  return (
    <span
      ref={triggerRef}
      role="button"
      tabIndex={0}
      title={content}
      aria-label={content}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          updatePosition();
          setIsOpen((prev) => !prev);
        }
      }}
      className={`relative inline-flex items-center justify-center ml-1.5 align-middle select-none text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 p-0.5 rounded cursor-help transition-colors outline-hidden hover:bg-slate-100 dark:hover:bg-slate-800 ${className}`}
    >
      <HelpCircle className="w-3.5 h-3.5 shrink-0" />

      {/* Render via Portal directly to body to bypass any parent overflow clipping */}
      {isOpen &&
        coords &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: `${coords.left}px`,
              top: `${coords.top}px`,
              transform: coords.placeAbove ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
              zIndex: 999999,
            }}
            className={`w-64 max-w-[calc(100vw-24px)] p-3 text-xs font-normal leading-relaxed rounded-xl pointer-events-none transition-all duration-150 animate-in fade-in-0 zoom-in-95 text-left border ${
              isDarkMode
                ? 'bg-slate-900 text-slate-100 border-slate-700 shadow-2xl shadow-black/80'
                : 'bg-white text-slate-800 border-slate-200/90 shadow-xl shadow-slate-400/25'
            }`}
          >
            <p className="leading-relaxed">{content}</p>

            {/* Tooltip pointer arrow with border */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                ...(coords.placeAbove
                  ? {
                      bottom: '-6px',
                      borderTop: `6px solid ${arrowBgColor}`,
                    }
                  : {
                      top: '-6px',
                      borderBottom: `6px solid ${arrowBgColor}`,
                    }),
              }}
            />
          </div>,
          document.body
        )}
    </span>
  );
};
