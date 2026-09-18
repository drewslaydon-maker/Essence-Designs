import { InventoryItem } from '../types';

export const SHOP_ITEMS: InventoryItem[] = [
  {
    id: 'item_vest',
    name: 'Kevlar-Lined Aristocrat Vest',
    description: 'A discreet armored vest worn beneath silk shirts. Absorbs a single lethal night attack or backstab.',
    cost: 45,
    effect: 'shield',
    icon: 'Shield'
  },
  {
    id: 'item_dna_scanner',
    name: 'TTT Forensic DNA Scanner',
    description: 'Scans a corpse to capture residual genetic matter of the killer, instantly identifying one prime suspect.',
    cost: 50,
    effect: 'dna_scanner',
    icon: 'Search'
  },
  {
    id: 'item_truth_serum',
    name: 'Apothecary Truth Serum',
    description: 'Forces a target to answer an inquiry truthfully during tomorrow\'s trial or public discussion.',
    cost: 40,
    effect: 'truth_serum',
    icon: 'FlaskConical'
  },
  {
    id: 'item_smoke_bomb',
    name: 'Phosphor Smoke Bomb',
    description: 'Throws the room into disarray, preventing all night actions against you for tonight.',
    cost: 35,
    effect: 'smoke_bomb',
    icon: 'Cloud'
  },
  {
    id: 'item_disguise',
    name: 'Forged Peerage Papers',
    description: 'Falsifies identity records so that Sheriff or Detective interrogations register you as Law-Abiding.',
    cost: 55,
    effect: 'disguise',
    icon: 'FileBadge'
  },
  {
    id: 'item_poison',
    name: 'Slow Nightshade Elixir',
    description: 'Coats a victim\'s goblet. The victim falls desperately ill and succumbs at the end of the next day unless treated by a Doctor.',
    cost: 65,
    effect: 'poison',
    icon: 'Skull'
  }
];
