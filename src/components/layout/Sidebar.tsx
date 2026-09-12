import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Navigation, ScanLine, Volume2, VolumeX, X, ChevronRight, Eye } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { ACCESSIBILITY_PROFILES } from '@/data/profiles';

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean; setMobileOpen: (open: boolean) => void }) {
  const { state, toggleVoice } = useApp();
  const profileInfo = state.selectedProfile ? ACCESSIBILITY_PROFILES.find(p => p.id === state.selectedProfile) : null;
  const activeBarriersCount = state.barriers.length;

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/navigate', icon: Navigation, label: 'Navigate' },
    { to: '/scan', icon: ScanLine, label: 'Scan My Path' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden" 
          onClick={closeMobile} 
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 text-white transform transition-transform duration-300 ease-out lg:translate-x-0 flex flex-col shadow-2xl",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-500/30">
              <Eye size={20} />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white">AccessLens <span className="text-indigo-400">AI</span></span>
              <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Public Navigation</span>
            </div>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-white" 
            onClick={closeMobile}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-6">
          <nav className="space-y-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobile}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200",
                  isActive 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" 
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <link.icon size={18} className="flex-shrink-0" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="space-y-3.5 pt-4 border-t border-slate-800/80">
            <h3 className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Live App Status
            </h3>
            
            {state.selectedVenue ? (
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <p className="text-[10px] text-slate-400 font-semibold mb-0.5">Active Venue</p>
                <p className="text-xs font-bold text-white truncate">{state.selectedVenue.name}</p>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
                No venue selected
              </div>
            )}

            {profileInfo ? (
              <NavLink 
                to="/profile" 
                onClick={closeMobile}
                className="block p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-colors"
              >
                <p className="text-[10px] text-slate-400 font-semibold mb-1 flex items-center justify-between">
                  Profile <ChevronRight size={12} />
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: profileInfo.color }} />
                  <p className="text-xs font-bold text-white truncate">{profileInfo.label}</p>
                </div>
              </NavLink>
            ) : (
              <NavLink 
                to="/profile" 
                onClick={closeMobile}
                className="block p-3 rounded-xl border border-dashed border-slate-700 text-slate-400 text-xs hover:border-indigo-500 hover:text-indigo-300 transition-colors"
              >
                Set Accessibility Profile
              </NavLink>
            )}

            {activeBarriersCount > 0 && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-between text-xs">
                <span className="text-rose-200 font-medium">Active Hazards</span>
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white font-extrabold text-[10px]">{activeBarriersCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Speech Guidance Toggle */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={toggleVoice}
            className={cn(
              "flex items-center justify-between w-full px-3.5 py-3 rounded-xl text-xs font-bold transition-all",
              state.voiceEnabled 
                ? "bg-indigo-950/80 border border-indigo-500/50 text-indigo-200" 
                : "bg-slate-800/60 text-slate-400 hover:text-white"
            )}
          >
            <div className="flex items-center gap-2.5">
              {state.voiceEnabled ? <Volume2 size={18} className="text-indigo-400" /> : <VolumeX size={18} className="text-slate-500" />}
              Speech Guidance
            </div>
            <div className={cn(
              "w-7 h-3.5 rounded-full relative transition-colors",
              state.voiceEnabled ? "bg-indigo-500" : "bg-slate-700"
            )}>
              <div className={cn(
                "absolute top-0.5 w-2.5 h-2.5 bg-white rounded-full transition-transform",
                state.voiceEnabled ? "left-4" : "left-0.5"
              )} />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
