import { Building2, Train, Plane, GraduationCap, ShoppingBag, Landmark, Bus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Venue } from '@/types';

interface VenueCardProps {
  venue: Venue;
  selected: boolean;
  onClick: () => void;
}

export function VenueCard({ venue, selected, onClick }: VenueCardProps) {
  const getIcon = () => {
    switch (venue.type) {
      case 'hospital': return <Building2 size={24} />;
      case 'railway': return <Train size={24} />;
      case 'airport': return <Plane size={24} />;
      case 'college': return <GraduationCap size={24} />;
      case 'mall': return <ShoppingBag size={24} />;
      case 'government': return <Landmark size={24} />;
      case 'bus_terminal': return <Bus size={24} />;
      default: return <Building2 size={24} />;
    }
  };

  return (
    <div 
      className={cn(
        "card card-interactive p-5 flex flex-col h-full",
        selected ? "border-primary-500 ring-1 ring-primary-500 bg-primary-50/30" : ""
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          selected ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-600"
        )}>
          {getIcon()}
        </div>
        <span className="badge bg-slate-100 text-slate-600">
          {venue.floors} {venue.floors === 1 ? 'Floor' : 'Floors'}
        </span>
      </div>
      
      <h3 className="font-bold text-lg text-slate-800 mb-1">{venue.name}</h3>
      <p className="text-sm text-slate-500 line-clamp-2 mt-auto">{venue.description}</p>
    </div>
  );
}

