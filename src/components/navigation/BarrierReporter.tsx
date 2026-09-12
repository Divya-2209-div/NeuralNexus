import { useState, useMemo, useEffect } from 'react';
import { AlertTriangle, MapPin, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Venue, BarrierType } from '@/types';

interface BarrierReporterProps {
  venue: Venue;
}

export function BarrierReporter({ venue }: BarrierReporterProps) {
  const { state, addBarrier, removeBarrier } = useApp();
  
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<BarrierType>('path_obstructed');
  const [edgeId, setEdgeId] = useState('');
  const [description, setDescription] = useState('Pathway obstructed');

  const venueActiveBarriers = state.barriers.filter(b => b.venueId === venue.id && b.active);

  useEffect(() => {
    switch (type) {
      case 'elevator_unavailable': setDescription('Elevator out of service'); break;
      case 'ramp_blocked': setDescription('Ramp blocked or under maintenance'); break;
      case 'stairs_blocked': setDescription('Stairway blocked'); break;
      case 'path_obstructed': setDescription('Pathway obstructed'); break;
      case 'door_inaccessible': setDescription('Door not accessible'); break;
    }
    setEdgeId('');
  }, [type]);

  const filteredEdges = useMemo(() => {
    const edgeMap = new Map();
    venue.edges.forEach(edge => {
      if (type === 'elevator_unavailable' && edge.type !== 'elevator') return;
      if (type === 'ramp_blocked' && edge.type !== 'ramp') return;
      if (type === 'stairs_blocked' && edge.type !== 'stairs') return;
      if (type === 'path_obstructed' && edge.type !== 'hallway') return;
      
      const sortedIds = [edge.from, edge.to].sort().join('-');
      if (!edgeMap.has(sortedIds)) {
        edgeMap.set(sortedIds, edge);
      }
    });
    return Array.from(edgeMap.values());
  }, [venue.edges, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeId || !description) return;

    addBarrier({
      type,
      edgeId,
      description,
      venueId: venue.id
    });

    setIsOpen(false);
    setEdgeId('');
    setDescription('');
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" />
          Active Barriers
        </h3>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-sm font-medium text-primary-600 hover:text-primary-700"
        >
          {isOpen ? 'Cancel' : 'Report Barrier'}
        </button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200 animate-fade-in-up">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Barrier Type</label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value as BarrierType)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white p-2 border"
              >
                <option value="path_obstructed">Path Obstructed</option>
                <option value="elevator_unavailable">Elevator Unavailable</option>
                <option value="ramp_blocked">Ramp Blocked</option>
                <option value="stairs_blocked">Stairs Blocked</option>
                <option value="door_inaccessible">Door Inaccessible</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location / Path</label>
              <select 
                value={edgeId} 
                onChange={(e) => setEdgeId(e.target.value)}
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white p-2 border"
                required
              >
                <option value="">Select a path...</option>
                {filteredEdges.map((edge: any) => {
                  const from = venue.nodes.find(n => n.id === edge.from)?.label;
                  const to = venue.nodes.find(n => n.id === edge.to)?.label;
                  return (
                    <option key={edge.id} value={edge.id}>
                      {from} to {to} ({edge.type})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <input 
                type="text" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Cleaning cart blocking the hallway"
                className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm bg-white p-2 border"
                required
              />
            </div>

            <button type="submit" className="w-full btn-primary bg-amber-500 hover:bg-amber-600 shadow-amber-500/30">
              Submit Report (Triggers Reroute)
            </button>
          </div>
        </form>
      )}

      {venueActiveBarriers.length > 0 ? (
        <div className="space-y-2">
          {venueActiveBarriers.map(barrier => {
            const edge = venue.edges.find(e => e.id === barrier.edgeId);
            const from = venue.nodes.find(n => n.id === edge?.from)?.label;
            const to = venue.nodes.find(n => n.id === edge?.to)?.label;

            return (
              <div key={barrier.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="flex gap-3 items-start">
                  <div className="mt-0.5 text-amber-500"><AlertTriangle size={16} /></div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{barrier.description}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={10} /> {from} → {to}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => removeBarrier(barrier.id)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                  title="Mark as resolved"
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4 text-center bg-slate-50 border border-dashed border-slate-200 rounded-lg text-sm text-slate-500">
          No active barriers reported at {venue.name}.
        </div>
      )}
    </div>
  );
}
