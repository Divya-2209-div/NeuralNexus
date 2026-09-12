import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Locate, Plus, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Venue, Route, Barrier, VenueNode, EdgeType, NodeType } from '@/types';

interface RouteMapProps {
  venue: Venue;
  route: Route | null;
  barriers: Barrier[];
  currentFloor: number;
  onFloorChange: (floor: number) => void;
  currentPositionNodeId?: string;
}

const POI_ICONS: Record<NodeType | 'default', string> = {
  elevator: '⬍',
  stairs: '⊞',
  ramp: '⤴',
  toilet: '🚻',
  rest_area: '☘',
  entrance: '◉',
  exit: '◉',
  information: 'ℹ',
  emergency: '✚',
  platform: '🚂',
  gate: '✈',
  security: '⛨',
  pharmacy: '℞',
  room: '',
  intersection: '',
  escalator: '⬍',
  ticket_counter: '🎫',
  check_in: '✓',
  lounge: '☕',
  waiting_area: '🪑',
  default: '•',
};

const ROOM_TYPES: NodeType[] = [
  'room', 'toilet', 'rest_area', 'information', 'emergency', 
  'platform', 'gate', 'security', 'pharmacy', 'lounge', 'waiting_area', 'ticket_counter', 'check_in'
];

export const RouteMap: React.FC<RouteMapProps> = ({
  venue,
  route,
  barriers,
  currentFloor,
  onFloorChange,
  currentPositionNodeId,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Transform state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const recenter = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Filter nodes/edges for current floor
  const floorNodes = venue.nodes.filter((n) => n.floor === currentFloor);
  const floorNodeIds = new Set(floorNodes.map((n) => n.id));
  
  const floorEdges = venue.edges.filter(
    (e) => floorNodeIds.has(e.from) && floorNodeIds.has(e.to)
  );

  const routeNodesSet = new Set(route?.path || []);
  const routeEdges = route?.path.reduce((acc, nodeId, idx) => {
    if (idx < route.path.length - 1) {
      acc.push(`${nodeId}-${route.path[idx + 1]}`);
      acc.push(`${route.path[idx + 1]}-${nodeId}`);
    }
    return acc;
  }, [] as string[]) || [];

  const routeNodes = (route?.path || [])
    .map((id) => venue.nodes.find((n) => n.id === id))
    .filter((n): n is VenueNode => n !== undefined);

  // Panning
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    dragStart.current = { x: clientX - pan.x, y: clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    setPan({
      x: clientX - dragStart.current.x,
      y: clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Zooming
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    setZoom((prevZoom) => Math.max(0.5, Math.min(prevZoom - e.deltaY * zoomSensitivity, 5)));
  };

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;
    
    // Prevent default scroll behavior on wheel when hovering over SVG
    const preventScroll = (e: WheelEvent) => e.preventDefault();
    svgElement.addEventListener('wheel', preventScroll, { passive: false });
    
    return () => svgElement.removeEventListener('wheel', preventScroll);
  }, []);

  const getPinchDistance = (e: React.TouchEvent) => {
    if (e.touches.length < 2) return 0;
    return Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  };

  const pinchStartDist = useRef<number>(0);
  const pinchStartZoom = useRef<number>(1);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinchStartDist.current = getPinchDistance(e);
      pinchStartZoom.current = zoom;
    } else {
      handleMouseDown(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = getPinchDistance(e);
      const scale = dist / pinchStartDist.current;
      setZoom(Math.max(0.5, Math.min(pinchStartZoom.current * scale, 5)));
    } else {
      handleMouseMove(e);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden flex flex-col items-center">
      
      {/* Floor Switcher */}
      <div className="absolute top-4 z-10 flex space-x-2 p-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-700/50 shadow-xl">
        {Array.from(new Set(venue.nodes.map(n => n.floor))).sort((a, b) => b - a).map(floor => (
          <button
            key={floor}
            onClick={() => onFloorChange(floor)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-bold transition-all",
              floor === currentFloor 
                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]" 
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            )}
          >
            L{floor}
          </button>
        ))}
      </div>

      <style>{`
        @keyframes dashAnim {
          to { stroke-dashoffset: -20; }
        }
        @keyframes pulseMarker {
          0% { r: 10; opacity: 0.8; }
          100% { r: 25; opacity: 0; }
        }
        .animate-dash {
          animation: dashAnim 1s linear infinite;
        }
        .animate-pulse-radius {
          animation: pulseMarker 1.5s ease-out infinite;
        }
      `}</style>

      {/* SVG Map Container */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
        viewBox="0 0 1000 1000"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          <g transform={`translate(${500 * (1 - zoom) / zoom}, ${500 * (1 - zoom) / zoom})`}>
            
            {/* Building Envelope / Outline */}
            <rect x="50" y="50" width="900" height="900" rx="30" fill="#0f172a" stroke="#334155" strokeWidth="4" />

            {/* Corridors */}
            {floorEdges.map(edge => {
              if (edge.type !== 'hallway') return null;
              const n1 = floorNodes.find(n => n.id === edge.from);
              const n2 = floorNodes.find(n => n.id === edge.to);
              if (!n1 || !n2) return null;
              
              return (
                <line 
                  key={`${edge.from}-${edge.to}-corridor`}
                  x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                  stroke="rgba(255,255,255,0.03)"
                  strokeWidth="30"
                  strokeLinecap="round"
                />
              );
            })}

            {/* Regular Edges */}
            {floorEdges.map(edge => {
              const n1 = floorNodes.find(n => n.id === edge.from);
              const n2 = floorNodes.find(n => n.id === edge.to);
              const isBlocked = barriers.some(b => b.edgeId === `${edge.from}-${edge.to}` || b.edgeId === `${edge.to}-${edge.from}`);
              
              if (!n1 || !n2) return null;
              
              return (
                <g key={`${edge.from}-${edge.to}-edge`}>
                  <line
                    x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                    stroke={isBlocked ? "#ef4444" : "#475569"}
                    strokeWidth={isBlocked ? "3" : "1"}
                    strokeDasharray={isBlocked ? "5,5" : "none"}
                    opacity={isBlocked ? 1 : 0.4}
                  />
                  {isBlocked && (
                    <text 
                      x={(n1.x + n2.x)/2} 
                      y={(n1.y + n2.y)/2} 
                      fill="#ef4444"
                      fontSize="14"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontWeight="bold"
                    >
                      ✕
                    </text>
                  )}
                </g>
              );
            })}

            {/* Rooms/Facilities */}
            {floorNodes.map(node => {
              if (!ROOM_TYPES.includes(node.type)) return null;
              return (
                <rect 
                  key={`room-${node.id}`}
                  x={node.x - 30} 
                  y={node.y - 20} 
                  width="60" 
                  height="40" 
                  rx="6"
                  fill="rgba(51, 65, 85, 0.4)"
                  stroke="rgba(100, 116, 139, 0.5)"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Route Path (Glow + Line) */}
            {routeNodes.length > 1 && (
              <>
                <path
                  d={`M ${routeNodes.filter(n => n.floor === currentFloor).map(n => `${n.x},${n.y}`).join(' L ')}`}
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d={`M ${routeNodes.filter(n => n.floor === currentFloor).map(n => `${n.x},${n.y}`).join(' L ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="10, 10"
                  className="animate-dash"
                />
              </>
            )}

            {/* Nodes / Icons */}
            {floorNodes.map(node => {
              const isRouteNode = routeNodesSet.has(node.id);
              const icon = POI_ICONS[node.type] || POI_ICONS.default;
              const hasIcon = icon !== '' && icon !== '•';

              return (
                <g key={`node-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                  {node.type === 'intersection' ? (
                    <circle r={isRouteNode ? 4 : 2} fill={isRouteNode ? "#60a5fa" : "#64748b"} />
                  ) : hasIcon ? (
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={isRouteNode ? "#60a5fa" : "#94a3b8"}
                      fontSize={isRouteNode ? "16" : "14"}
                      fontWeight="bold"
                    >
                      {icon}
                    </text>
                  ) : (
                    <circle r={4} fill={isRouteNode ? "#60a5fa" : "#94a3b8"} />
                  )}
                </g>
              );
            })}

            {/* Start and End Pins */}
            {routeNodes.map((node, idx) => {
              if (node.floor !== currentFloor) return null;
              if (idx === 0 || idx === routeNodes.length - 1) {
                const isStart = idx === 0;
                const color = isStart ? "#10b981" : "#ef4444";
                return (
                  <g key={`pin-${node.id}`} transform={`translate(${node.x}, ${node.y})`}>
                    <circle className="animate-pulse-radius" fill={color} />
                    <circle r="8" fill={color} stroke="#fff" strokeWidth="2" />
                  </g>
                );
              }
              return null;
            })}

            {/* Current Position Marker */}
            {currentPositionNodeId && floorNodes.find(n => n.id === currentPositionNodeId) && (
              <g 
                transform={`translate(${floorNodes.find(n => n.id === currentPositionNodeId)?.x}, ${floorNodes.find(n => n.id === currentPositionNodeId)?.y})`}
              >
                <circle className="animate-pulse-radius" fill="#0ea5e9" />
                <circle r="8" fill="#0ea5e9" stroke="#fff" strokeWidth="2" />
                <circle r="3" fill="#fff" />
              </g>
            )}

            {/* Labels (rendered last to be on top) */}
            {floorNodes.map(node => {
              if (!node.label) return null;
              const isRouteNode = routeNodesSet.has(node.id);
              // Only render labels for important places or route nodes to avoid clutter
              if (!isRouteNode && !ROOM_TYPES.includes(node.type) && node.type !== 'entrance' && node.type !== 'exit') return null;

              return (
                <g key={`label-${node.id}`} transform={`translate(${node.x}, ${node.y + 18})`}>
                  <rect 
                    x="-40" y="-8" width="80" height="16" rx="8"
                    fill="rgba(15, 23, 42, 0.7)"
                    stroke="rgba(71, 85, 105, 0.5)"
                    strokeWidth="1"
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isRouteNode ? "#e2e8f0" : "#94a3b8"}
                    fontSize="9"
                    fontWeight={isRouteNode ? "bold" : "normal"}
                  >
                    {node.label.length > 12 ? node.label.substring(0, 10) + '...' : node.label}
                  </text>
                </g>
              );
            })}

          </g>
        </g>
      </svg>

      {/* Map Controls */}
      <div className="absolute right-4 bottom-24 z-10 flex flex-col space-y-2">
        <button 
          onClick={() => setZoom(z => Math.min(z + 0.5, 5))}
          className="p-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg text-slate-300 hover:text-white shadow-lg"
          aria-label="Zoom In"
        >
          <Plus size={20} />
        </button>
        <button 
          onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))}
          className="p-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg text-slate-300 hover:text-white shadow-lg"
          aria-label="Zoom Out"
        >
          <Minus size={20} />
        </button>
        <button 
          onClick={recenter}
          className="p-2 bg-slate-800/80 backdrop-blur-md border border-slate-700/50 rounded-lg text-blue-400 hover:text-blue-300 shadow-lg"
          aria-label="Recenter Map"
        >
          <Locate size={20} />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 p-3 rounded-xl shadow-xl text-xs max-w-[200px]">
        <h4 className="font-semibold text-slate-300 mb-2 border-b border-slate-700 pb-1">Legend</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center text-slate-400"><span className="text-[#10b981] mr-1 font-bold">●</span> Start</div>
          <div className="flex items-center text-slate-400"><span className="text-[#ef4444] mr-1 font-bold">●</span> End</div>
          <div className="flex items-center text-slate-400"><span className="text-blue-500 mr-1 font-bold">---</span> Route</div>
          <div className="flex items-center text-slate-400"><span className="text-[#ef4444] mr-1">✕</span> Blocked</div>
          <div className="flex items-center text-slate-400"><span className="text-slate-400 mr-1 w-4 text-center">⬍</span> Elevator</div>
          <div className="flex items-center text-slate-400"><span className="text-slate-400 mr-1 w-4 text-center">🚻</span> Toilet</div>
          <div className="flex items-center text-slate-400"><span className="text-slate-400 mr-1 w-4 text-center">ℹ</span> Info</div>
          <div className="flex items-center text-slate-400"><span className="text-[#0ea5e9] mr-1 font-bold">●</span> You are here</div>
        </div>
      </div>
      
    </div>
  );
};
