import { useState } from 'react';
import { Check, Info, Settings, Sparkles, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ACCESSIBILITY_PROFILES } from '@/data/profiles';
import { ProfileCard } from '@/components/navigation/ProfileCard';

export default function ProfilePage() {
  const { state, setProfile } = useApp();
  const [localProfile, setLocalProfile] = useState<string>(state.selectedProfile || ACCESSIBILITY_PROFILES[0].id);
  const [isSaved, setIsSaved] = useState(false);

  const selectedInfo = ACCESSIBILITY_PROFILES.find(p => p.id === localProfile)!;

  const handleSave = () => {
    setProfile(localProfile as any);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900">Accessibility Profile</h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose how AccessLens AI optimizes indoor graph routes and live alerts for your personal mobility needs.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold self-start md:self-auto">
          <Sparkles size={14} className="text-indigo-600" />
          AI Route Customization Active
        </div>
      </div>

      {/* Grid of 5 Profiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ACCESSIBILITY_PROFILES.map(p => (
          <ProfileCard 
            key={p.id} 
            profile={p} 
            selected={localProfile === p.id}
            onClick={() => setLocalProfile(p.id)}
          />
        ))}
      </div>

      {/* Active Rules Breakdown Box */}
      <div className="card p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2.5">
            <Settings size={20} className="text-indigo-600" />
            Active Routing Rules for <span style={{ color: selectedInfo.color }}>{selectedInfo.label}</span>
          </h3>
          <span className="badge badge-success flex items-center gap-1">
            <ShieldCheck size={14} /> Profile Ready
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedInfo.routingRules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-3 p-4 bg-slate-50/80 rounded-xl border border-slate-200/80">
              <div className="mt-0.5 p-1 rounded-full text-white shrink-0" style={{ backgroundColor: selectedInfo.color }}>
                <Check size={12} />
              </div>
              <p className="text-xs font-semibold text-slate-800 leading-relaxed">{rule}</p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-indigo-50/80 border border-indigo-200/80 rounded-xl text-xs text-indigo-950 flex gap-3">
          <Info size={18} className="shrink-0 text-indigo-600 mt-0.5" />
          <p className="leading-relaxed">
            This profile automatically applies custom penalty weights and path restrictions to the A* graph search engine. Unavailable pathways (like stairs for wheelchairs) are completely avoided.
          </p>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button 
            onClick={handleSave}
            className="btn-primary px-8 py-3 rounded-xl font-extrabold text-sm"
            disabled={localProfile === state.selectedProfile && !isSaved}
          >
            {isSaved ? <><Check size={18} /> Profile Saved & Active</> : 'Save Accessibility Profile'}
          </button>
          
          {localProfile !== state.selectedProfile && (
            <span className="text-xs font-bold text-amber-600 animate-pulse">Unsaved profile selection</span>
          )}
        </div>
      </div>
    </div>
  );
}
