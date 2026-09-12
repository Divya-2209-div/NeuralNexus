import { Accessibility, EyeOff, EarOff, HeartHandshake, Brain, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AccessibilityProfileInfo } from '@/types';

interface ProfileCardProps {
  profile: AccessibilityProfileInfo;
  selected: boolean;
  onClick: () => void;
}

export function ProfileCard({ profile, selected, onClick }: ProfileCardProps) {
  const getIcon = () => {
    switch (profile.icon) {
      case 'wheelchair': return <Accessibility size={24} />;
      case 'eye-off': return <EyeOff size={24} />;
      case 'ear-off': return <EarOff size={24} />;
      case 'brain': return <Brain size={24} />;
      case 'heart-handshake': return <HeartHandshake size={24} />;
      default: return <Accessibility size={24} />;
    }
  };

  return (
    <div 
      className={cn(
        "card card-interactive p-5 flex flex-col h-full text-left transition-all duration-300 transform",
        selected 
          ? "ring-2 shadow-lg scale-[1.02]" 
          : "hover:scale-[1.01]"
      )}
      onClick={onClick}
      style={{
        backgroundColor: selected ? `${profile.color}15` : undefined,
        borderColor: selected ? profile.color : undefined,
        boxShadow: selected ? `0 10px 25px -5px ${profile.color}35` : undefined
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform"
          style={{ backgroundColor: profile.color }}
        >
          {getIcon()}
        </div>

        {selected && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs shadow"
            style={{ backgroundColor: profile.color }}
          >
            <Check size={14} />
          </div>
        )}
      </div>
      
      <h3 className="font-extrabold text-base text-slate-900 mb-1">{profile.label}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-4">{profile.description}</p>
      
      <div className="mt-auto space-y-1.5 pt-2 border-t border-slate-100/80">
        {profile.routingRules.slice(0, 2).map((rule, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 font-medium">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: profile.color }} />
            <span className="truncate">{rule}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

