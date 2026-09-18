import React from 'react';
import { 
  Shield, 
  Shirt, 
  Hammer, 
  Flame, 
  Smile, 
  Sparkles, 
  Sun, 
  Zap, 
  ShieldAlert, 
  ShoppingBag, 
  Wrench, 
  Crosshair, 
  Lamp, 
  Music, 
  Box, 
  Crown, 
  Heart,
  Coffee,
  Disc,
  FileText,
  Trash2,
  UserCheck,
  Bug,
  Skull,
  HelpCircle
} from 'lucide-react';

interface ItemIconProps {
  name: string;
  className?: string;
}

export const ItemIcon: React.FC<ItemIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Shield': return <Shield className={className} />;
    case 'Shirt': return <Shirt className={className} />;
    case 'Hammer': return <Hammer className={className} />;
    case 'Flame': return <Flame className={className} />;
    case 'Smile': return <Smile className={className} />;
    case 'Sparkles': return <Sparkles className={className} />;
    case 'Sun': return <Sun className={className} />;
    case 'Zap': return <Zap className={className} />;
    case 'ShieldAlert': return <ShieldAlert className={className} />;
    case 'ShoppingBag': return <ShoppingBag className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Crosshair': return <Crosshair className={className} />;
    case 'Lamp': return <Lamp className={className} />;
    case 'Music': return <Music className={className} />;
    case 'Box': return <Box className={className} />;
    case 'Crown': return <Crown className={className} />;
    case 'Heart': return <Heart className={className} />;
    case 'Coffee': return <Coffee className={className} />;
    case 'Disc': return <Disc className={className} />;
    case 'FileText': return <FileText className={className} />;
    case 'Trash2': return <Trash2 className={className} />;
    case 'UserCheck': return <UserCheck className={className} />;
    case 'Bug': return <Bug className={className} />;
    case 'Skull': return <Skull className={className} />;
    default: return <HelpCircle className={className} />;
  }
};
