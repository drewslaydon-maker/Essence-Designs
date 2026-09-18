import React, { useState } from 'react';
import { PlayerProfile, EquipmentSlot, EquipmentItem, ItemRarity } from '../types';
import { ItemIcon } from './ItemIcon';
import { Sparkles, Shield, Hammer, Zap, Play, CheckCircle2 } from 'lucide-react';
import { sound } from '../audio/soundEngine';

interface ArmoryModalProps {
  profile: PlayerProfile;
  onEquipItem: (item: EquipmentItem) => void;
  onUnequipSlot: (slot: EquipmentSlot) => void;
  onStartGame: () => void;
}

const RARITY_STYLES: Record<ItemRarity, { border: string; bg: string; text: string; badge: string }> = {
  common: {
    border: 'border-stone-700',
    bg: 'bg-stone-900',
    text: 'text-stone-300',
    badge: 'bg-stone-800 text-stone-400 border-stone-700',
  },
  rare: {
    border: 'border-blue-500/60',
    bg: 'bg-blue-950/30',
    text: 'text-blue-300',
    badge: 'bg-blue-900/50 text-blue-300 border-blue-600/50',
  },
  epic: {
    border: 'border-purple-500/60',
    bg: 'bg-purple-950/30',
    text: 'text-purple-300',
    badge: 'bg-purple-900/50 text-purple-300 border-purple-600/50',
  },
  mythic: {
    border: 'border-amber-400/80',
    bg: 'bg-amber-950/40',
    text: 'text-amber-300',
    badge: 'bg-amber-900/60 text-amber-200 border-amber-400/60 shadow-sm shadow-amber-500/20',
  },
};

export const ArmoryModal: React.FC<ArmoryModalProps> = ({
  profile,
  onEquipItem,
  onUnequipSlot,
  onStartGame,
}) => {
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<string>('all');
  const [activeItemDetails, setActiveItemDetails] = useState<EquipmentItem | null>(null);

  // Compute stats
  const aggregateStats = () => {
    let miningSpeed = 0;
    let chiselSpeed = 0;
    let pocketCapacity = 28; // standard OSRS backpack size!
    let minionDamage = 0;
    let barrierShieldBonus = 0;
    let tokenBonus = 0;
    let critChiselChance = 0;

    // From equipped items
    (Object.values(profile.equipped) as (EquipmentItem | null)[]).forEach((item) => {
      if (!item) return;
      if (item.stats.miningSpeed) miningSpeed += item.stats.miningSpeed;
      if (item.stats.chiselSpeed) chiselSpeed += item.stats.chiselSpeed;
      if (item.stats.pocketCapacity) pocketCapacity += item.stats.pocketCapacity;
      if (item.stats.minionDamage) minionDamage += item.stats.minionDamage;
      if (item.stats.barrierShieldBonus) barrierShieldBonus += item.stats.barrierShieldBonus;
      if (item.stats.tokenBonus) tokenBonus += item.stats.tokenBonus;
      if (item.stats.critChiselChance) critChiselChance += item.stats.critChiselChance;
    });

    // From upgrades
    const pocketLvl = profile.upgrades['deep_pockets'] || 0;
    pocketCapacity += pocketLvl * 4;

    const speedLvl = profile.upgrades['caffeine_drip'] || 0;
    chiselSpeed += speedLvl * 15;
    miningSpeed += speedLvl * 15;

    const barrierLvl = profile.upgrades['barrier_reinforcement'] || 0;
    barrierShieldBonus += barrierLvl * 10;

    const golemLvl = profile.upgrades['golem_steroids'] || 0;
    minionDamage += golemLvl * 18;

    return {
      miningSpeed,
      chiselSpeed,
      pocketCapacity,
      minionDamage,
      barrierShieldBonus,
      tokenBonus,
      critChiselChance: Math.min(Math.round(critChiselChance * 100), 75),
    };
  };

  const stats = aggregateStats();

  const slots: { key: EquipmentSlot; label: string }[] = [
    { key: 'head', label: 'Headgear' },
    { key: 'body', label: 'Robes & Attire' },
    { key: 'tool', label: 'Chisel & Quarry Tool' },
    { key: 'offhand', label: 'Off-Hand Relic' },
    { key: 'pet', label: 'Rift Familiar (Pet)' },
  ];

  const filteredInventory = profile.inventory.filter((item) => {
    if (selectedSlotFilter === 'all') return true;
    return item.slot === selectedSlotFilter;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-bold text-stone-100 tracking-tight">Apprentice Dressing Room</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Wardrobe of Questionable Power
            </span>
          </div>
          <p className="text-xs text-stone-400 max-w-xl">
            Equip eccentric relics pulled from the Cosmic Vending Machine to alter your mining speed, pocket capacity, and golem attack power before sealing the next rift.
          </p>
        </div>

        <button
          id="armory-launch-game-btn"
          onClick={() => {
            sound.playPortalSfx();
            onStartGame();
          }}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 transition active:scale-95"
        >
          <Play className="w-4 h-4 fill-stone-950" />
          <span>Enter the Rift</span>
        </button>
      </div>

      {/* Main Grid: Paper Doll + Computed Stats + Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Paper Doll Slots (5 cols) */}
        <div className="lg:col-span-5 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Equipped Loadout</span>
            </h3>
            <span className="text-xs text-stone-500">Click item to inspect</span>
          </div>

          <div className="space-y-2.5">
            {slots.map(({ key, label }) => {
              const item = profile.equipped[key];
              const rarityStyle = item ? RARITY_STYLES[item.rarity] : null;

              return (
                <div
                  key={key}
                  id={`slot-${key}`}
                  onClick={() => item && setActiveItemDetails(item)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                    item
                      ? `${rarityStyle?.bg} ${rarityStyle?.border} hover:brightness-110`
                      : 'bg-stone-950/40 border-dashed border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border shadow-inner ${
                        item
                          ? `${rarityStyle?.border} bg-stone-900/90 text-amber-300`
                          : 'border-stone-800 bg-stone-900 text-stone-600'
                      }`}
                    >
                      {item ? (
                        <ItemIcon name={item.iconName} className="w-5 h-5 text-amber-300" />
                      ) : (
                        <span className="text-xs font-mono text-stone-600">?</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block">
                        {label}
                      </span>
                      <h4 className={`text-sm font-semibold tracking-tight ${item ? rarityStyle?.text : 'text-stone-500 italic'}`}>
                        {item ? item.name : 'Empty Slot'}
                      </h4>
                    </div>
                  </div>

                  {item && (
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded border ${rarityStyle?.badge}`}>
                        {item.rarity}
                      </span>
                      <button
                        id={`unequip-btn-${key}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUnequipSlot(key);
                        }}
                        className="text-xs text-stone-400 hover:text-rose-400 px-2 py-1 rounded bg-stone-900 hover:bg-stone-800 border border-stone-700 transition"
                        title="Unequip item"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Apprentice Stats Summary */}
          <div className="pt-3 border-t border-stone-800/80 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">Total Combat & Crafting Buffs</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                <span className="text-stone-400">Mining Haste:</span>
                <span className="font-mono font-bold text-amber-400">+{stats.miningSpeed}%</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                <span className="text-stone-400">Chisel Haste:</span>
                <span className="font-mono font-bold text-amber-400">+{stats.chiselSpeed}%</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                <span className="text-stone-400">Essence Pocket:</span>
                <span className="font-mono font-bold text-emerald-400">{stats.pocketCapacity} slots</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                <span className="text-stone-400">Minion Power:</span>
                <span className="font-mono font-bold text-cyan-400">+{stats.minionDamage}%</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                <span className="text-stone-400">Barrier Overshield:</span>
                <span className="font-mono font-bold text-indigo-400">+{stats.barrierShieldBonus}%</span>
              </div>
              <div className="p-2 rounded-lg bg-stone-950/60 border border-stone-800 flex items-center justify-between">
                <span className="text-stone-400">Crit Chisel Chance:</span>
                <span className="font-mono font-bold text-rose-400">{stats.critChiselChance}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inventory & Inspection (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                  <Hammer className="w-4 h-4 text-amber-400" />
                  <span>Stash Inventory</span>
                </h3>
                <p className="text-xs text-stone-500">Collected gear waiting to be deployed</p>
              </div>

              {/* Slot Filter Pills */}
              <div className="flex flex-wrap gap-1">
                {['all', 'head', 'body', 'tool', 'offhand', 'pet'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedSlotFilter(filter)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition ${
                      selectedSlotFilter === filter
                        ? 'bg-amber-600 text-stone-950'
                        : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Inventory List */}
            {filteredInventory.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-stone-800 rounded-xl space-y-2">
                <p className="text-sm text-stone-400">No spare gear found for this slot.</p>
                <p className="text-xs text-stone-500">
                  Earn Elemental & Catalytic tokens in the Rift Chamber to pull weird relics from the Cosmic Vending Machine!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                {filteredInventory.map((item) => {
                  const rarityStyle = RARITY_STYLES[item.rarity];
                  const isEquipped = profile.equipped[item.slot]?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      id={`inv-item-${item.id}`}
                      onClick={() => setActiveItemDetails(item)}
                      className={`p-3 rounded-xl border transition flex flex-col justify-between gap-2 cursor-pointer ${
                        rarityStyle.bg
                      } ${rarityStyle.border} ${isEquipped ? 'ring-2 ring-amber-500/50' : 'hover:brightness-110'}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-2 rounded-lg bg-stone-900 border ${rarityStyle.border}`}>
                            <ItemIcon name={item.iconName} className={`w-4 h-4 ${rarityStyle.text}`} />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold leading-tight ${rarityStyle.text}`}>
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-stone-400 uppercase tracking-wide">
                              {item.slot}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded border ${rarityStyle.badge}`}>
                          {item.rarity}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800/60">
                        <span className="text-[11px] text-stone-400 line-clamp-1 italic">
                          {item.flavorText}
                        </span>
                        {isEquipped ? (
                          <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Equipped
                          </span>
                        ) : (
                          <button
                            id={`equip-btn-${item.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              sound.playChiselSfx();
                              onEquipItem(item);
                            }}
                            className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-stone-950 text-[10px] font-bold tracking-wide transition shadow-sm"
                          >
                            Equip
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Item Inspector Panel */}
          {activeItemDetails && (
            <div className="p-4 rounded-xl bg-stone-950/90 border border-stone-800 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg border ${RARITY_STYLES[activeItemDetails.rarity].border} bg-stone-900`}>
                    <ItemIcon name={activeItemDetails.iconName} className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${RARITY_STYLES[activeItemDetails.rarity].text}`}>
                      {activeItemDetails.name}
                    </h4>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400">
                      Slot: {activeItemDetails.slot} • {activeItemDetails.rarity}
                    </span>
                  </div>
                </div>

                {profile.equipped[activeItemDetails.slot]?.id !== activeItemDetails.id && (
                  <button
                    onClick={() => {
                      sound.playChiselSfx();
                      onEquipItem(activeItemDetails);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold tracking-wide transition"
                  >
                    Equip to {activeItemDetails.slot}
                  </button>
                )}
              </div>

              <p className="text-xs text-stone-300">{activeItemDetails.description}</p>
              <p className="text-xs text-amber-400/90 italic font-serif">{activeItemDetails.flavorText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
