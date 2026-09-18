import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  Compass, 
  Heart, 
  ArrowRight,
  ShieldAlert,
  Flame,
  Crown
} from 'lucide-react';
import { UnifiedLoreEntity, resolveEntity } from '../utils/loreResolver';

interface InterconnectedDossierModalProps {
  entityId: string | null;
  onClose: () => void;
  onSelectEntity: (id: string) => void;
  onNavigateToView: (view: 'vivec' | 'pantheon' | 'races' | 'artifacts' | 'morrowind' | 'oblivion' | 'deepLore' | 'codex') => void;
}

export function InterconnectedDossierModal({
  entityId,
  onClose,
  onSelectEntity,
  onNavigateToView
}: InterconnectedDossierModalProps) {
  if (!entityId) return null;

  const entity: UnifiedLoreEntity | undefined = resolveEntity(entityId);

  if (!entity) return null;

  const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
    gods: { bg: 'bg-[#f59e0b]/20', text: 'text-[#fef08a]', border: 'border-[#f59e0b]/40' },
    artifacts: { bg: 'bg-[#a855f7]/20', text: 'text-[#d8b4fe]', border: 'border-[#a855f7]/40' },
    races: { bg: 'bg-[#10b981]/20', text: 'text-[#6ee7b7]', border: 'border-[#10b981]/40' },
    vivec: { bg: 'bg-[#c8983e]/20', text: 'text-[#eac368]', border: 'border-[#c8983e]/40' },
    characters: { bg: 'bg-[#3b82f6]/20', text: 'text-[#93c5fd]', border: 'border-[#3b82f6]/40' },
    metaphysics: { bg: 'bg-[#ec4899]/20', text: 'text-[#f472b6]', border: 'border-[#ec4899]/40' },
    cyrodiil_guide: { bg: 'bg-[#06b6d4]/20', text: 'text-[#67e8f9]', border: 'border-[#06b6d4]/40' }
  };

  const style = categoryColors[entity.category] || { bg: 'bg-[#c8983e]/20', text: 'text-[#eac368]', border: 'border-[#c8983e]/40' };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#c8983e]/40 bg-[#12131b] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#212433] bg-[#161824] flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase font-bold border ${style.bg} ${style.text} ${style.border}`}>
                {entity.category}
              </span>
              {entity.godOrCreator && (
                <span className="text-xs font-mono text-[#94a3b8]">
                  Associated God: <strong className="text-[#e2ded5]">{entity.godOrCreator}</strong>
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#f8f5ee]">
              {entity.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#c8983e] italic font-serif">
              "{entity.subtitle}"
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#1d1f2d] text-[#8c887e] hover:text-[#f8f5ee] hover:bg-[#282b3d] transition-colors"
            title="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-[#c7c2b6]">
          {/* Summary Box */}
          <div className="p-4 rounded-xl bg-[#191b28] border border-[#2c3044] text-[#e3dfd6]">
            {entity.summary}
          </div>

          {/* Deep Lore */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono uppercase font-bold text-[#eac368] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#eac368]" />
              Deep Lore & Kirkbride Metaphysics
            </h4>
            <div className="text-xs sm:text-sm whitespace-pre-line text-[#d8d3c5] space-y-3 bg-[#0d0e14] p-4 rounded-xl border border-[#212330]">
              {entity.deepLore}
            </div>
          </div>

          {/* Wife / Oblivion Note */}
          {entity.beginnerNote && (
            <div className="rounded-xl border border-[#3b82f6]/40 bg-[#101729] p-4 space-y-1">
              <div className="text-xs font-mono uppercase font-bold text-[#93c5fd] flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                Oblivion In-Game Spotlight (For Your Wife):
              </div>
              <p className="text-xs sm:text-sm text-[#cbd5e1]">
                {entity.beginnerNote}
              </p>
            </div>
          )}

          {/* Oblivion Location if present */}
          {entity.oblivionLocation && (
            <div className="rounded-xl border border-[#eab308]/40 bg-[#19170e] p-4 space-y-1">
              <div className="text-xs font-mono uppercase font-bold text-[#fef08a] flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#eab308]" />
                Where To Find It in Cyrodiil Right Now:
              </div>
              <p className="text-xs sm:text-sm text-[#fef9c3]">
                {entity.oblivionLocation}
              </p>
            </div>
          )}

          {/* Interconnected Cross References */}
          {entity.crossReferences && entity.crossReferences.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-[#212433]">
              <div className="text-xs font-mono uppercase font-bold text-[#8c887e]">
                Interconnected Topics in the Archive:
              </div>
              <div className="flex flex-wrap gap-2">
                {entity.crossReferences.map((refId) => {
                  const refEntity = resolveEntity(refId);
                  const label = refEntity ? refEntity.title : refId;
                  return (
                    <button
                      key={refId}
                      onClick={() => onSelectEntity(refId)}
                      className="px-3 py-1.5 rounded-lg text-xs font-mono bg-[#1c1e2b] border border-[#2e3247] text-[#93c5fd] hover:text-[#f8f5ee] hover:border-[#c8983e] transition-all flex items-center gap-1.5"
                    >
                      <span>{label}</span>
                      <ArrowRight className="w-3 h-3 text-[#60a5fa]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#212433] bg-[#141622] flex items-center justify-between gap-3">
          <span className="text-xs font-mono text-[#8c887e]">
            Aurbic Lore Archive Connection
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1c1e2b] text-[#94a3b8] hover:text-[#f8f5ee] transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                onNavigateToView(entity.viewTarget);
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#c8983e] text-[#121008] font-bold hover:bg-[#eac368] transition-colors flex items-center gap-2 shadow"
            >
              <span>Jump to Section</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
