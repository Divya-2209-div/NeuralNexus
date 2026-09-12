import { useState, useMemo, useCallback, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { venues } from '@/data/venues';
import { ACCESSIBILITY_PROFILES } from '@/data/profiles';
import { buildGraph } from '@/engine/graph';
import { findRoute } from '@/engine/router';
import { VenueCard } from '@/components/navigation/VenueCard';
import { ProfileCard } from '@/components/navigation/ProfileCard';
import { RouteMap } from '@/components/navigation/RouteMap';
import { RouteInstructions } from '@/components/navigation/RouteInstructions';
import { BarrierReporter } from '@/components/navigation/BarrierReporter';
import { ActiveWalkingMode } from '@/components/navigation/ActiveWalkingMode';
import { formatDistance, formatTime } from '@/lib/utils';
import type { Venue, AccessibilityProfile, Route as RouteType } from '@/types';
import {
  MapPin, Navigation, ChevronRight, RotateCcw, AlertTriangle, CheckCircle2, Sparkles, Footprints
} from 'lucide-react';

export default function NavigatePage() {
  const { state, setVenue, setProfile, setRoute, addRecentRoute } = useApp();

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(state.selectedVenue);
  const [selectedProfile, setSelectedProfileLocal] = useState<AccessibilityProfile | null>(state.selectedProfile);
  const [startNodeId, setStartNodeId] = useState<string>('');
  const [endNodeId, setEndNodeId] = useState<string>('');
  const [currentRoute, setCurrentRoute] = useState<RouteType | null>(state.currentRoute);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [currentFloor, setCurrentFloor] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isWalkingMode, setIsWalkingMode] = useState(false);
  const [walkingStepIndex, setWalkingStepIndex] = useState(0);

  // Build graph when venue changes
  const graph = useMemo(() => {
    if (!selectedVenue) return null;
    return buildGraph(selectedVenue);
  }, [selectedVenue]);

  // Get destination nodes
  const destinationNodes = useMemo(() => {
    if (!selectedVenue) return [];
    return selectedVenue.nodes.filter(n => n.isDestination).sort((a, b) => a.label.localeCompare(b.label));
  }, [selectedVenue]);

  // Set default start when venue changes
  useEffect(() => {
    if (selectedVenue) {
      setStartNodeId(selectedVenue.defaultEntrance);
      setEndNodeId('');
      setCurrentRoute(null);
      setRouteError(null);
      setCurrentFloor(0);
      setIsWalkingMode(false);
    }
  }, [selectedVenue]);

  // Recalculate route when barriers change
  useEffect(() => {
    if (currentRoute && selectedVenue && selectedProfile && startNodeId && endNodeId) {
      // Rebuild graph to reset all edge states
      const freshGraph = buildGraph(selectedVenue);
      // Apply only active barriers
      state.barriers.forEach(b => {
        if (b.active && b.venueId === selectedVenue.id) {
          freshGraph.setEdgeBlockedStatus(b.edgeId, true);
        }
      });
      try {
        const newRoute = findRoute(freshGraph, startNodeId, endNodeId, selectedProfile);
        setCurrentRoute(newRoute);
        setRoute(newRoute);
        setRouteError(null);
      } catch {
        setRouteError('No accessible route available with current barriers. Try removing some barriers.');
      }
    }
  }, [state.barriers]);

  const handleVenueSelect = (venue: Venue) => {
    setSelectedVenue(venue);
    setVenue(venue);
    setCurrentRoute(null);
    setRouteError(null);
    setIsWalkingMode(false);
  };

  const handleProfileSelect = (profile: AccessibilityProfile) => {
    setSelectedProfileLocal(profile);
    setProfile(profile);
    setCurrentRoute(null);
    setRouteError(null);
    setIsWalkingMode(false);
  };

  const handleCalculateRoute = useCallback(() => {
    if (!graph || !selectedProfile || !startNodeId || !endNodeId) return;

    setIsCalculating(true);
    setRouteError(null);
    setIsWalkingMode(false);

    // Rebuild graph to reset all edge states
    const freshGraph = buildGraph(selectedVenue!);

    // Apply active barriers
    state.barriers.forEach(b => {
      if (b.active && b.venueId === selectedVenue?.id) {
        freshGraph.setEdgeBlockedStatus(b.edgeId, true);
      }
    });

    // Small delay for UX animation
    setTimeout(() => {
      try {
        const route = findRoute(freshGraph, startNodeId, endNodeId, selectedProfile);
        setCurrentRoute(route);
        setRoute(route);
        
        addRecentRoute({
          venueId: selectedVenue!.id,
          venueName: selectedVenue!.name,
          from: graph.getNode(startNodeId)?.label || startNodeId,
          to: graph.getNode(endNodeId)?.label || endNodeId,
          profile: selectedProfile,
        });
      } catch (err: any) {
        setRouteError(err.message || 'No route found. The destination may be unreachable with your accessibility profile and current barriers.');
      } finally {
        setIsCalculating(false);
      }
    }, 400);
  }, [graph, selectedProfile, startNodeId, endNodeId, selectedVenue, state.barriers]);

  const handleReset = () => {
    setCurrentRoute(null);
    setRouteError(null);
    setRoute(null);
    setIsWalkingMode(false);
    setWalkingStepIndex(0);
  };

  // Determine wizard step
  const wizardStep = !selectedVenue ? 1 : !selectedProfile ? 2 : !currentRoute ? 3 : 4;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Navigate</h1>
        <p className="text-sm text-gray-500 mt-1">Find the best accessible route for your needs</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 px-1">
        {[
          { step: 1, label: 'Venue' },
          { step: 2, label: 'Profile' },
          { step: 3, label: 'Route' },
          { step: 4, label: 'Navigate' },
        ].map(({ step, label }) => (
          <div key={step} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                wizardStep > step
                  ? 'bg-green-500 text-white'
                  : wizardStep === step
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {wizardStep > step ? <CheckCircle2 size={16} /> : step}
            </div>
            <span className={`text-xs font-medium hidden sm:inline ${wizardStep >= step ? 'text-gray-700' : 'text-gray-400'}`}>
              {label}
            </span>
            {step < 4 && <ChevronRight size={14} className="text-gray-300 hidden sm:inline" />}
          </div>
        ))}
      </div>

      {/* Step 1: Venue Selection */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
          Select a Venue
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {venues.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              selected={selectedVenue?.id === venue.id}
              onClick={() => handleVenueSelect(venue)}
            />
          ))}
        </div>
      </section>

      {/* Step 2: Profile Selection */}
      {selectedVenue && (
        <section className="animate-fade-in-up">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Accessibility Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {ACCESSIBILITY_PROFILES.map(profile => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                selected={selectedProfile === profile.id}
                onClick={() => handleProfileSelect(profile.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Step 3: Route Configuration */}
      {selectedVenue && selectedProfile && !currentRoute && (
        <section className="animate-fade-in-up">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Navigation size={20} className="text-indigo-600" />
              Configure Route
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Start Location */}
              <div>
                <label htmlFor="start-node" className="block text-sm font-medium text-gray-700 mb-1.5">
                  <MapPin size={14} className="inline mr-1 text-green-500" />
                  Start Location
                </label>
                <select
                  id="start-node"
                  value={startNodeId}
                  onChange={e => setStartNodeId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Select start...</option>
                  {destinationNodes.map(node => (
                    <option key={node.id} value={node.id}>
                      {node.label} (Floor {node.floor})
                    </option>
                  ))}
                </select>
              </div>

              {/* Destination */}
              <div>
                <label htmlFor="end-node" className="block text-sm font-medium text-gray-700 mb-1.5">
                  <MapPin size={14} className="inline mr-1 text-red-500" />
                  Destination
                </label>
                <select
                  id="end-node"
                  value={endNodeId}
                  onChange={e => setEndNodeId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                >
                  <option value="">Select destination...</option>
                  {destinationNodes
                    .filter(n => n.id !== startNodeId)
                    .map(node => (
                      <option key={node.id} value={node.id}>
                        {node.label} (Floor {node.floor})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              id="calculate-route-btn"
              onClick={handleCalculateRoute}
              disabled={!startNodeId || !endNodeId || isCalculating}
              className="btn-primary w-full md:w-auto"
            >
              {isCalculating ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Calculating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Calculate Accessible Route
                </>
              )}
            </button>

            {routeError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertTriangle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700">{routeError}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Step 4: Route Results & Start Walking Action */}
      {currentRoute && selectedVenue && selectedProfile && (
        <section className="animate-fade-in-up space-y-4">
          {/* Route Summary Bar with UNIVERSAL START WALKING BUTTON */}
          <div className="card p-5 border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50/40 via-white to-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-4 text-slate-700 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase text-slate-400">Distance</span>
                    <span className="text-base font-bold text-slate-900">{formatDistance(currentRoute.totalDistance)}</span>
                  </div>
                  <div className="w-px h-5 bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase text-slate-400">Est. Time</span>
                    <span className="text-base font-bold text-slate-900">{formatTime(currentRoute.estimatedTime)}</span>
                  </div>
                  <div className="w-px h-5 bg-slate-200" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold uppercase text-slate-400">Score</span>
                    <span className={`text-base font-bold ${currentRoute.accessibilityScore >= 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {currentRoute.accessibilityScore}/100
                    </span>
                  </div>
                </div>
                
                {currentRoute.warnings.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentRoute.warnings.map((w, i) => (
                      <span key={i} className="badge badge-warning text-xs">{w}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsWalkingMode(true)}
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/30 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
                >
                  <Footprints size={20} className="animate-bounce" />
                  START WALKING MODE
                </button>

                <button onClick={handleReset} className="btn-secondary text-sm">
                  <RotateCcw size={14} />
                  New Route
                </button>
              </div>
            </div>
          </div>

          {/* ACTIVE WALKING MODE OVERLAY */}
          {isWalkingMode && (
            <ActiveWalkingMode
              route={currentRoute}
              venue={selectedVenue}
              profile={selectedProfile}
              onEndWalking={() => {
                setIsWalkingMode(false);
                setWalkingStepIndex(0);
              }}
              onFloorChange={setCurrentFloor}
              onStepChange={(idx) => setWalkingStepIndex(idx)}
            />
          )}

          {/* Map + Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3">
              <RouteMap
                venue={selectedVenue}
                route={currentRoute}
                barriers={state.barriers}
                currentFloor={currentFloor}
                onFloorChange={setCurrentFloor}
                currentPositionNodeId={isWalkingMode ? currentRoute.steps[walkingStepIndex]?.nodeId : undefined}
              />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <RouteInstructions route={currentRoute} activeStepIndex={0} />
              <BarrierReporter venue={selectedVenue} />
            </div>
          </div>
          {/* Route Error with current route */}
          {routeError && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Route Recalculation Failed</p>
                <p className="text-sm text-red-600 mt-1">{routeError}</p>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
