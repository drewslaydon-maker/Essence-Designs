import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalShellProps {
  id?: string;
  isOpen?: boolean;
  onClose?: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: 'amber' | 'cyan' | 'purple' | 'emerald' | 'rose';
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  id,
  isOpen = true,
  onClose,
  title,
  subtitle,
  badge,
  badgeColor = 'amber',
  icon,
  headerRight,
  children,
  footer,
  maxWidthClass = 'max-w-xl sm:max-w-2xl',
}) => {
  // Close on Escape
  useEffect(() => {
    if (!onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const badgeColorStyles = {
    amber: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
    cyan: 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300',
    purple: 'bg-purple-500/15 border-purple-400/40 text-purple-300',
    emerald: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
    rose: 'bg-rose-500/15 border-rose-400/40 text-rose-300',
  };

  return (
    <div
      id={id || 'universal-modal-overlay'}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
    >
      <div
        className={`relative w-full ${maxWidthClass} bg-slate-900/95 border border-amber-500/40 ring-1 ring-amber-400/15 rounded-2xl shadow-2xl shadow-black/90 flex flex-col max-h-[88vh] overflow-hidden animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Filigree Accent Bar */}
        <div className="h-1 bg-gradient-to-r from-amber-600/30 via-amber-400 to-amber-600/30 shrink-0" />

        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-950/75 border-b border-slate-800/90 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                {icon}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-amber-200 text-sm sm:text-base tracking-wide truncate">
                  {title}
                </h3>
                {badge && (
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColorStyles[badgeColor]}`}
                  >
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <span className="text-[11px] text-slate-400 truncate">
                  {subtitle}
                </span>
              )}
            </div>
          </div>

          {/* Right Header Section (Custom actions + Close button) */}
          <div className="flex items-center gap-2 shrink-0">
            {headerRight}
            {onClose && (
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 text-slate-300 hover:text-amber-300 transition-colors active:scale-95"
                title="Close [Esc]"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-4 text-slate-200 text-sm">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="px-5 py-3.5 bg-slate-950/80 border-t border-slate-800/90 flex items-center justify-end gap-2.5 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
