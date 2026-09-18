import React, { useState } from 'react';
import { 
  Beer, 
  ShoppingBag, 
  Coins, 
  Shield, 
  Search, 
  FlaskConical, 
  Cloud, 
  FileBadge, 
  Skull, 
  X, 
  Check,
  Ear,
  MessageSquare
} from 'lucide-react';
import { Player, InventoryItem } from '../types';
import { SHOP_ITEMS } from '../data/items';

interface TavernShopModalProps {
  humanPlayer: Player;
  onBuyItem: (item: InventoryItem) => void;
  onClose: () => void;
  tavernRumors: string[];
}

const ITEM_ICONS: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-5 h-5 text-teal-400" />,
  Search: <Search className="w-5 h-5 text-cyan-400" />,
  FlaskConical: <FlaskConical className="w-5 h-5 text-amber-400" />,
  Cloud: <Cloud className="w-5 h-5 text-stone-400" />,
  FileBadge: <FileBadge className="w-5 h-5 text-indigo-400" />,
  Skull: <Skull className="w-5 h-5 text-rose-400" />
};

export const TavernShopModal: React.FC<TavernShopModalProps> = ({
  humanPlayer,
  onBuyItem,
  onClose,
  tavernRumors
}) => {
  const [activeTab, setActiveTab] = useState<'shop' | 'rumors'>('shop');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePurchase = (item: InventoryItem) => {
    if (humanPlayer.coins < item.cost) {
      setFeedback(`Insufficient sovereigns! You need ${item.cost}g, but hold only ${humanPlayer.coins}g.`);
      return;
    }
    onBuyItem(item);
    setFeedback(`Acquired ${item.name}! Added to your active inventory.`);
  };

  return (
    <div 
      id="tavern-shop-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-stone-900 border border-amber-800 text-stone-100 rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-700/60 text-amber-400 flex items-center justify-center shrink-0">
              {activeTab === 'shop' ? <ShoppingBag className="w-5 h-5" /> : <Beer className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Dusk Bazaar & Hearth Whispers
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                The Gilded Flagon: Merchant & Tavern Quarters
              </h2>
            </div>
          </div>

          <button
            id="btn-close-shop"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-400 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Close Tavern Bazaar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Purse */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button
              id="tab-merchant-shop"
              onClick={() => setActiveTab('shop')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'shop'
                  ? 'bg-amber-600 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Merchant's Bazaar
            </button>
            <button
              id="tab-tavern-rumors"
              onClick={() => setActiveTab('rumors')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                activeTab === 'rumors'
                  ? 'bg-amber-600 text-stone-950'
                  : 'bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <Ear className="w-3.5 h-3.5" />
              Tavern Whispers ({tavernRumors.length})
            </button>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-950 rounded-lg border border-amber-800/40 text-xs font-bold text-amber-300">
            <Coins className="w-4 h-4 text-amber-400" />
            <span>Purse: {humanPlayer.coins} Sovereigns</span>
          </div>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div className="mb-4 p-2.5 rounded-lg bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs font-semibold flex items-center justify-between">
            <span>{feedback}</span>
            <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Tab 1: Shop Items */}
        {activeTab === 'shop' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {SHOP_ITEMS.map((item) => {
              const canAfford = humanPlayer.coins >= item.cost;
              const alreadyHas = humanPlayer.items.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="p-3.5 bg-stone-950/70 border border-stone-800 hover:border-stone-700 rounded-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        {ITEM_ICONS[item.icon] || <Shield className="w-5 h-5 text-amber-400" />}
                        <h4 className="text-xs font-bold text-white">{item.name}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-0.5">
                        <Coins className="w-3 h-3" />
                        {item.cost}g
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-800/60 flex items-center justify-between">
                    {alreadyHas ? (
                      <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> In Inventory
                      </span>
                    ) : (
                      <span className="text-[10px] text-stone-500">
                        {canAfford ? 'Ready to purchase' : 'Need more coin'}
                      </span>
                    )}

                    <button
                      id={`btn-buy-${item.id}`}
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford || alreadyHas}
                      className="py-1 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-stone-950 transition-colors cursor-pointer"
                    >
                      {alreadyHas ? 'Equipped' : 'Barter'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Tavern Whispers */}
        {activeTab === 'rumors' && (
          <div className="space-y-2.5 mb-4">
            <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-xl text-xs text-amber-300 flex items-center gap-2">
              <Beer className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                The Tavern Keeper overhears nocturnal ramblings over pints of spiced cider.
              </span>
            </div>

            {tavernRumors.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 italic bg-stone-950/50 rounded-xl border border-stone-800">
                The patrons have been tight-lipped. No rumors have surfaced yet.
              </div>
            ) : (
              <ul className="space-y-2">
                {tavernRumors.map((rumor, idx) => (
                  <li 
                    key={idx}
                    className="p-3 bg-stone-950/80 border border-stone-800 rounded-xl text-xs text-stone-300 italic flex items-start gap-2.5"
                  >
                    <span className="text-amber-500 font-bold not-italic font-mono">#{idx + 1}</span>
                    <span>"{rumor}"</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-stone-800 flex justify-end">
          <button
            id="btn-leave-tavern"
            onClick={onClose}
            className="min-h-[44px] py-2.5 px-6 rounded-xl font-bold text-xs bg-stone-800 hover:bg-stone-700 active:bg-stone-600 text-stone-200 transition-all cursor-pointer shadow-xs"
          >
            Leave Bazaar & Return
          </button>
        </div>

      </div>
    </div>
  );
};
