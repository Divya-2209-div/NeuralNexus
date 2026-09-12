import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Navigation, ScanLine, AlertTriangle, MapPin, AlertCircle, Info, 
  CheckCircle, Clock, Search, Sparkles, ArrowRight, ShieldCheck, Footprints, Eye
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ACCESSIBILITY_PROFILES } from '@/data/profiles';
import { venues } from '@/data/venues';

export default function DashboardPage() {
  const { state, setVenue } = useApp();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const profileInfo = state.selectedProfile ? ACCESSIBILITY_PROFILES.find(p => p.id === state.selectedProfile) : null;

  const filteredVenues = venues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVenueClick = (venue: typeof venues[0]) => {
    setVenue(venue);
    navigate('/navigate');
  };

  return (
    <div className="space-y-8 animate-fade-in-up pb-8">
      {/* HERO / BRANDING SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-8 md:p-10 shadow-2xl border border-indigo-700/40">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-indigo-200 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-cyan-400" />
            Hackathon Track 1 • Access & Inclusion
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            AccessLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">AI</span>
          </h1>
          
          <p className="text-indigo-100/90 text-base md:text-lg max-w-2xl leading-relaxed">
            AI-Powered Accessible Navigation for Public Spaces. Finding the safest, most accessible route tailored to your exact mobility and visual needs.
          </p>

          {/* Quick Destination Search */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search venue (e.g. Hospital, Airport, Railway...)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-32 py-3.5 bg-white/95 backdrop-blur-md rounded-2xl text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-400/40 shadow-xl border border-white/20"
              />
              <button
                onClick={() => navigate('/navigate')}
                className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-xs font-bold rounded-xl"
              >
                Find Route <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Active Profile Status Badge */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold">
            {profileInfo ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: profileInfo.color }} />
                <span>Active Profile: <strong className="text-white">{profileInfo.label}</strong></span>
                <Link to="/profile" className="text-cyan-300 underline hover:text-white ml-1">Change</Link>
              </div>
            ) : (
              <Link to="/profile" className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 hover:bg-amber-500/30 transition-colors">
                ⚠️ No Accessibility Profile Set — Click to Configure
              </Link>
            )}

            <div className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck size={16} />
              <span>Universal Active Rerouting Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS ROW */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          to="/navigate" 
          className="group card card-interactive p-6 flex items-center gap-5 hover:border-indigo-400/60 transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
            <Footprints size={28} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">Start Navigation</h3>
            <p className="text-xs text-slate-500 mt-1">Multi-floor accessible routes & active mode</p>
          </div>
        </Link>
        
        <Link 
          to="/scan" 
          className="group card card-interactive p-6 flex items-center gap-5 hover:border-cyan-400/60 transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-700 text-white flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
            <ScanLine size={28} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-cyan-600 transition-colors">Scan My Path</h3>
            <p className="text-xs text-slate-500 mt-1">Computer Vision obstacle & sign reader</p>
          </div>
        </Link>
        
        <Link 
          to="/navigate" 
          className="group card card-interactive p-6 flex items-center gap-5 hover:border-amber-400/60 transition-all duration-300"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">Report Barrier</h3>
            <p className="text-xs text-slate-500 mt-1">Report blocked paths & trigger rerouting</p>
          </div>
        </Link>
      </section>

      {/* FEATURED VENUES DISPLAY */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Supported Demo Venues</h2>
            <p className="text-xs text-slate-500 mt-0.5">Select a venue to launch interactive multi-level navigation</p>
          </div>
          <Link to="/navigate" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            View All Venues <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVenues.map(v => (
            <div
              key={v.id}
              onClick={() => handleVenueClick(v)}
              className="card card-interactive p-6 flex flex-col justify-between hover:border-indigo-400/60 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="badge badge-primary uppercase text-[10px] tracking-wider">{v.type}</span>
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{v.floors} Levels</span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors mb-1.5">{v.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{v.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">{v.nodes.length} Key Checkpoints</span>
                <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Navigate Now <ArrowRight size={14} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECENT ACTIVITY & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Recent Alerts & Routes) */}
        <div className="lg:col-span-2 space-y-6">
          <section className="card p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle size={18} className="text-indigo-600" />
              Live Accessibility Alerts
            </h3>
            
            {state.alerts.length > 0 ? (
              <div className="space-y-3">
                {state.alerts.slice(0, 3).map((alert) => (
                  <div key={alert.id} className={cn(
                    "p-4 rounded-xl border flex gap-3 text-xs",
                    alert.type === 'warning' ? "bg-amber-50/80 border-amber-200 text-amber-900" :
                    alert.type === 'success' ? "bg-emerald-50/80 border-emerald-200 text-emerald-900" :
                    "bg-blue-50/80 border-blue-200 text-blue-900"
                  )}>
                    <div className="mt-0.5 shrink-0">
                      {alert.type === 'warning' ? <AlertTriangle size={16} className="text-amber-600" /> :
                       alert.type === 'success' ? <CheckCircle size={16} className="text-emerald-600" /> :
                       <Info size={16} className="text-blue-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{alert.title}</h4>
                      <p className="text-slate-600 mt-0.5">{alert.message}</p>
                      <span className="text-[10px] text-slate-400 mt-1 block font-mono">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                No active hazards or alerts in your vicinity.
              </div>
            )}
          </section>

          <section className="card p-6">
            <h3 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              Recent Route History
            </h3>
            
            {state.recentRoutes.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {state.recentRoutes.slice(0, 4).map((route) => (
                  <div key={route.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{route.venueName}</p>
                      <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                        {route.from} <span className="text-slate-300">→</span> {route.to}
                      </p>
                    </div>
                    <Link to="/navigate" className="text-indigo-600 hover:text-indigo-700 font-bold">
                      Re-navigate
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                No recent routes calculated yet. Start navigating to build your history.
              </div>
            )}
          </section>
        </div>

        {/* Right Column (Platform Stats & Insights) */}
        <div className="space-y-6">
          <section className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="card p-5 border-l-4 border-l-indigo-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Venues Ready</h4>
                <MapPin size={18} className="text-indigo-600" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{venues.length}</p>
            </div>
            
            <div className="card p-5 border-l-4 border-l-amber-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Hazards</h4>
                <AlertTriangle size={18} className="text-amber-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{state.barriers.length}</p>
            </div>
            
            <div className="card p-5 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Routes Generated</h4>
                <Navigation size={18} className="text-emerald-500" />
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{state.recentRoutes.length}</p>
            </div>
          </section>
          
          <div className="card p-6 glass-dark text-white rounded-2xl space-y-3">
            <h4 className="font-extrabold text-sm text-cyan-300 flex items-center gap-2">
              <Eye size={18} />
              Real-Time CV Rerouting Engine
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              AccessLens AI dynamically recalculates graph paths in real-time when physical obstacles (cleaning carts, broken elevators, blocked ramps) are detected by computer vision or reported by users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
