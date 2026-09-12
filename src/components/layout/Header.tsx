import { Menu, ChevronRight, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ACCESSIBILITY_PROFILES } from '@/data/profiles';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const { state } = useApp();
  const profileInfo = state.selectedProfile ? ACCESSIBILITY_PROFILES.find(p => p.id === state.selectedProfile) : null;

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-4">
        <button 
          className="lg:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100/80 transition-colors"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        
        <div className="hidden sm:flex items-center text-xs font-semibold text-slate-500">
          <span className="text-slate-400">AccessLens AI</span>
          <ChevronRight size={14} className="mx-1 text-slate-300" />
          {state.selectedVenue ? (
            <>
              <span className="text-slate-700 font-bold">{state.selectedVenue.name}</span>
              <ChevronRight size={14} className="mx-1 text-slate-300" />
            </>
          ) : null}
          <span className="text-indigo-600 font-extrabold">{title}</span>
        </div>
        
        <h1 className="sm:hidden text-base font-extrabold text-slate-900">{title}</h1>
      </div>
      
      <div className="flex items-center gap-3">
        {profileInfo ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: profileInfo.color }} />
            <span className="hidden md:inline">{profileInfo.label}</span>
          </div>
        ) : (
          <span className="demo-badge text-[10px]">
            <ShieldCheck size={12} /> AI READY
          </span>
        )}
      </div>
    </header>
  );
}

