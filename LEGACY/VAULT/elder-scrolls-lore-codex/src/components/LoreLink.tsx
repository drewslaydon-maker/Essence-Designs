import React from 'react';
import { Sparkles, ExternalLink } from 'lucide-react';

interface LoreLinkProps {
  id: string;
  children: React.ReactNode;
  onOpenEntity?: (id: string) => void;
  className?: string;
}

export function LoreLink({ id, children, onOpenEntity, className = '' }: LoreLinkProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onOpenEntity) {
          onOpenEntity(id);
        }
      }}
      className={`inline-flex items-center gap-1 font-semibold text-[#eac368] hover:text-[#fef08a] underline decoration-[#c8983e]/60 decoration-1 underline-offset-2 hover:decoration-[#eac368] transition-all cursor-pointer ${className}`}
      title={`Inspect interconnected lore for: ${id}`}
    >
      <span>{children}</span>
      <Sparkles className="w-3 h-3 text-[#c8983e] inline opacity-70 hover:opacity-100" />
    </button>
  );
}
