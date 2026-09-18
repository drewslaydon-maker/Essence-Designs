import React, { useState } from 'react';
import { PlayerStats, Item, Quest } from '../types';
import { Shield, Sword, Check, Heart, Sparkles, BookOpen, Key, Award, Coins } from 'lucide-react';
import { sound } from '../engine/Audio';
import { ModalShell } from './ModalShell';

interface InventoryModalProps {
  stats: PlayerStats;
  quests: Record<string, Quest>;
  initialTab?: 'gear' | 'quests' | 'abilities';
  onClose: () => void;
  onEquipWeapon: (item: Item) => void;
  onEquipArmor: (item: Item) => void;
  onUseConsumable: (item: Item) => void;
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  stats,
  quests,
  initialTab = 'gear',
  onClose,
  onEquipWeapon,
  onEquipArmor,
  onUseConsumable,
}) => {
  const [activeTab, setActiveTab] = useState<'gear' | 'quests' | 'abilities'>(initialTab);
  const [selectedItem, setSelectedItem] = useState<Item | null>(stats.inventory[0] || null);

  const handleEquip = (item: Item) => {
    sound.playDialogueBlip();
    if (item.type === 'weapon') {
      onEquipWeapon(item);
    } else if (item.type === 'armor') {
      onEquipArmor(item);
    } else if (item.type === 'consumable') {
      onUseConsumable(item);
    }
  };

  return (
    <ModalShell
      id="inventory-modal"
      isOpen={true}
      onClose={onClose}
      title="Adventurer's Grimoire"
      badge={`Lv. ${stats.level}`}
      badgeColor="amber"
      subtitle="Equipment, Quest Annals & Spectral Arts"
      icon={<BookOpen className="w-4 h-4 text-amber-300" />}
      maxWidthClass="max-w-2xl"
      headerRight={
        <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/40 rounded-full text-xs text-amber-300 font-semibold shadow-inner">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>{stats.gold} Gold</span>
        </div>
      }
    >
      {/* Tab Selection */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('gear')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'gear'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
          }`}
        >
          <Sword className="w-3.5 h-3.5" />
          <span>Equipment & Bag</span>
        </button>

        <button
          onClick={() => setActiveTab('quests')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'quests'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Quest Log</span>
        </button>

        <button
          onClick={() => setActiveTab('abilities')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'abilities'
              ? 'bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Unlocked Arts</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pt-1">
          {activeTab === 'gear' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column: Currently Equipped & Stats */}
              <div className="flex flex-col gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Equipped Gear & Attributes
                </h3>

                {/* Equipped Weapon */}
                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Sword className="w-4 h-4 text-rose-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {stats.equippedWeapon ? stats.equippedWeapon.name : 'Unarmed'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {stats.equippedWeapon ? `+${stats.equippedWeapon.value} Attack` : 'None'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-rose-950/60 text-rose-300 border border-rose-800/60 rounded">
                    Weapon
                  </span>
                </div>

                {/* Equipped Armor */}
                <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">
                        {stats.equippedArmor ? stats.equippedArmor.name : 'Cloth Garb'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {stats.equippedArmor ? `+${stats.equippedArmor.value} Defense` : 'None'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-cyan-950/60 text-cyan-300 border border-cyan-800/60 rounded">
                    Armor
                  </span>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between p-1.5 bg-slate-900/80 rounded">
                    <span>Attack:</span>
                    <span className="font-bold text-rose-400">{stats.atk}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-slate-900/80 rounded">
                    <span>Defense:</span>
                    <span className="font-bold text-cyan-400">{stats.def}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-slate-900/80 rounded">
                    <span>Health:</span>
                    <span className="font-bold text-emerald-400">{stats.hp}/{stats.maxHp}</span>
                  </div>
                  <div className="flex justify-between p-1.5 bg-slate-900/80 rounded">
                    <span>Mana:</span>
                    <span className="font-bold text-blue-400">{stats.mp}/{stats.maxMp}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Inventory Bag */}
              <div className="flex flex-col gap-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Inventory Bag ({stats.inventory.length} items)
                </h3>

                <div className="flex flex-col gap-1.5 max-h-56 overflow-y-auto pr-1">
                  {stats.inventory.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedItem(item)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                        selectedItem?.id === item.id
                          ? 'bg-amber-950/40 border-amber-400/80 text-amber-200'
                          : 'bg-slate-900 hover:bg-slate-800/80 border-slate-700 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.type === 'weapon' ? (
                          <Sword className="w-4 h-4 text-rose-400" />
                        ) : item.type === 'armor' ? (
                          <Shield className="w-4 h-4 text-cyan-400" />
                        ) : item.type === 'key' ? (
                          <Key className="w-4 h-4 text-yellow-400" />
                        ) : (
                          <Heart className="w-4 h-4 text-emerald-400" />
                        )}
                        <div>
                          <div className="text-xs font-bold">{item.name}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {item.type !== 'key' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEquip(item);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-amber-600 hover:text-slate-950 text-slate-200 rounded-lg text-[10px] font-bold transition-colors"
                        >
                          {item.type === 'consumable' ? 'Drink' : 'Equip'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : activeTab === 'quests' ? (
            /* Quests Tab */
            <div className="flex flex-col gap-4">
              {(Object.values(quests) as Quest[]).map((q) => (
                <div
                  key={q.id}
                  className="bg-slate-950/70 border border-slate-700 rounded-xl p-4 flex flex-col gap-3 shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h4 className="font-bold text-sm text-cyan-300">{q.title}</h4>
                      <span className="text-[11px] text-slate-400">Quest Giver: {q.giver}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        q.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-600'
                      }`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">{q.description}</p>

                  {/* Objectives List */}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                      Objectives:
                    </span>
                    {q.objectives.map((obj) => (
                      <div
                        key={obj.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                      >
                        <span className={obj.completed ? 'text-slate-400 line-through' : 'text-slate-200'}>
                          {obj.description}
                        </span>
                        <span className="font-mono text-[11px] text-cyan-400">
                          {obj.current}/{obj.target}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80 text-xs text-amber-300">
                    <Award className="w-4 h-4" />
                    <span>Rewards: {q.rewards.gold}g • {q.rewards.xp} XP</span>
                    {q.rewards.unlockName && (
                      <span className="text-purple-300 font-semibold">• {q.rewards.unlockName}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Unlocked Abilities Tab */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stats.unlockedAbilities.map((ab, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-950/60 border border-purple-800/50 rounded-xl flex items-start gap-3 shadow-md"
                >
                  <div className="p-2 rounded-lg bg-purple-900/40 border border-purple-500/40 text-purple-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-200">{ab}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {ab === 'Phase Shift'
                        ? 'Tap [Q] or the Shift button to toggle between the Physical plane and the Interstice dimension to reveal hidden spectral paths.'
                        : ab === 'Power Strike'
                        ? 'Hit the center of the timing slider during combat to deal 220% critical damage.'
                        : ab === 'Astral Dash'
                        ? 'Press [Space] to instantly dash forward across traps and through hostile phantoms.'
                        : 'Expanded parry window and spectral damage dampening.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </ModalShell>
  );
};
