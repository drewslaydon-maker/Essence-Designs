import React from 'react';
import { 
  Gavel, 
  ShieldCheck, 
  Skull, 
  Axe, 
  Sparkles, 
  Crown, 
  Coins, 
  Scale, 
  Beer, 
  HeartPulse, 
  Search, 
  Soup, 
  Palette, 
  Music, 
  Dices,
  HelpCircle,
  LucideIcon
} from 'lucide-react';
import { RoleId, Faction } from '../types';
import { ROLES } from '../data/roles';

interface RoleBadgeProps {
  roleId: RoleId;
  showFaction?: boolean;
  size?: 'sm' | 'md' | 'lg';
  isUnknown?: boolean;
  onClick?: () => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Gavel,
  ShieldCheck,
  Skull,
  Axe,
  Sparkles,
  Crown,
  Coins,
  Scale,
  Beer,
  HeartPulse,
  Search,
  Soup,
  Palette,
  Music,
  Dices
};

const FACTION_COLORS: Record<Faction, string> = {
  'Town': 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  'Outlaw': 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800',
  'Neutral Evil': 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-900/60 dark:text-stone-300 dark:border-stone-700',
  'Neutral Chaos': 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/50 dark:text-fuchsia-300 dark:border-fuchsia-800',
  'Neutral Barter': 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  'Artisan & Flavor': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800'
};

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  roleId,
  showFaction = true,
  size = 'md',
  isUnknown = false,
  onClick
}) => {
  if (isUnknown) {
    return (
      <span
        id={`role-badge-unknown-${Math.random().toString(36).substring(2, 6)}`}
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-stone-300 bg-stone-100 text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-400 select-none"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span>Hidden Identity</span>
      </span>
    );
  }

  const role = ROLES[roleId];
  if (!role) return null;

  const IconComponent = ICON_MAP[role.icon] || HelpCircle;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2'
  }[size];

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  }[size];

  return (
    <div 
      id={`role-badge-${roleId}`}
      onClick={onClick}
      className={`inline-flex items-center ${sizeClasses} rounded-md font-semibold border ${role.badgeColor} shadow-xs transition-colors ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      title={`${role.name}: ${role.tagline} (${role.faction}) - Prerogative: ${role.prerogativeLevel}`}
    >
      <IconComponent className={iconSizes} style={{ color: role.accentColor }} />
      <span className="whitespace-nowrap">{role.name}</span>
      {showFaction && (
        <span 
          className={`ml-1 px-1.5 py-0.2 rounded text-[10px] uppercase tracking-wider font-bold border ${FACTION_COLORS[role.faction]}`}
        >
          {role.faction}
        </span>
      )}
    </div>
  );
};
