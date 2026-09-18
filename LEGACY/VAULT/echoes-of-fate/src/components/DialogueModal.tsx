import React from 'react';
import { DialogueNode, DialogueChoice } from '../types';
import { ArrowRight, User, MessageCircle } from 'lucide-react';
import { sound } from '../engine/Audio';
import { ModalShell } from './ModalShell';

interface DialogueModalProps {
  node: DialogueNode;
  onSelectChoice: (choice: DialogueChoice) => void;
  onClose: () => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  node,
  onSelectChoice,
  onClose,
}) => {
  const handleChoiceClick = (choice: DialogueChoice) => {
    sound.playDialogueBlip();
    onSelectChoice(choice);
  };

  return (
    <ModalShell
      id="dialogue-modal"
      isOpen={true}
      onClose={onClose}
      title={node.speaker}
      badge="Dialogue"
      badgeColor="amber"
      subtitle="Resident of the Realm"
      icon={<User className="w-4 h-4 text-amber-300" />}
      maxWidthClass="max-w-xl"
      footer={
        node.choices.length === 0 ? (
          <button
            id="dialogue-close-btn"
            onClick={onClose}
            className="py-2 px-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg active:scale-95 transition-all"
          >
            Continue [E]
          </button>
        ) : undefined
      }
    >
      {/* Speech Text Box */}
      <div className="relative bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 sm:p-5 shadow-inner">
        <MessageCircle className="absolute top-3 right-3 w-5 h-5 text-amber-400/20 pointer-events-none" />
        <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-sans pr-6">
          "{node.text}"
        </p>
      </div>

      {/* Interactive Choices */}
      {node.choices.length > 0 && (
        <div className="flex flex-col gap-2 pt-1">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 font-semibold px-1">
            Choose Your Response:
          </span>
          <div className="flex flex-col gap-2">
            {node.choices.map((choice, idx) => (
              <button
                key={idx}
                id={`dialogue-choice-${idx}`}
                onClick={() => handleChoiceClick(choice)}
                className="w-full py-3 px-4 bg-slate-950/50 hover:bg-amber-950/40 active:bg-amber-950/70 border border-slate-700/80 hover:border-amber-400/70 rounded-xl text-left text-xs sm:text-sm font-medium text-slate-200 hover:text-amber-200 flex items-center justify-between transition-all group active:scale-[0.99] shadow-sm"
              >
                <span className="leading-snug">{choice.text}</span>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 ml-2 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </ModalShell>
  );
};

