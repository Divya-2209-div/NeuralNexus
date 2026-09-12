import type { Venue, VenueNode, VenueEdge, EdgeType, NodeType } from '../../types';

const nodes: VenueNode[] = [
  // Ground Floor (Concourse)
  { id: 'R-G-ENT', label: 'Main Entrance', type: 'entrance', floor: 0, x: 500, y: 950, accessible: true, isDestination: true },
  { id: 'R-G-INFO', label: 'Information Desk', type: 'information', floor: 0, x: 500, y: 850, accessible: true, isDestination: true },
  { id: 'R-G-TICKET', label: 'Ticket Counter', type: 'ticket_counter', floor: 0, x: 300, y: 850, accessible: true, isDestination: true },
  { id: 'R-G-WAIT', label: 'Waiting Hall', type: 'waiting_area', floor: 0, x: 700, y: 850, accessible: true, isDestination: true },
  { id: 'R-G-LUGG', label: 'Luggage Area', type: 'room', floor: 0, x: 300, y: 700, accessible: true, isDestination: true },
  { id: 'R-G-FOOD', label: 'Food Court', type: 'room', floor: 0, x: 700, y: 700, accessible: true, isDestination: true },
  { id: 'R-G-TOIL', label: 'Restrooms (Ground)', type: 'toilet', floor: 0, x: 900, y: 700, accessible: true, isDestination: true },
  { id: 'R-G-INT1', label: 'West Concourse', type: 'intersection', floor: 0, x: 400, y: 600, accessible: true, isDestination: false },
  { id: 'R-G-INT2', label: 'Central Concourse', type: 'intersection', floor: 0, x: 500, y: 600, accessible: true, isDestination: false },
  { id: 'R-G-INT3', label: 'East Concourse', type: 'intersection', floor: 0, x: 600, y: 600, accessible: true, isDestination: false },
  
  // Vertical Transportation (Ground)
  { id: 'R-G-ELEV1', label: 'Platform 1-2 Elevator (G)', type: 'elevator', floor: 0, x: 300, y: 500, accessible: true, isDestination: false },
  { id: 'R-G-STAIR1', label: 'Platform 1-2 Stairs (G)', type: 'stairs', floor: 0, x: 350, y: 500, accessible: false, isDestination: false },
  { id: 'R-G-RAMP1', label: 'Platform 1-2 Ramp (G)', type: 'ramp', floor: 0, x: 400, y: 500, accessible: true, isDestination: false },
  
  { id: 'R-G-ELEV2', label: 'Platform 3-4 Elevator (G)', type: 'elevator', floor: 0, x: 500, y: 500, accessible: true, isDestination: false },
  { id: 'R-G-STAIR2', label: 'Platform 3-4 Stairs (G)', type: 'stairs', floor: 0, x: 550, y: 500, accessible: false, isDestination: false },
  
  { id: 'R-G-STAIR3', label: 'Platform 5 Stairs (G)', type: 'stairs', floor: 0, x: 700, y: 500, accessible: false, isDestination: false },
  { id: 'R-G-RAMP2', label: 'Platform 5 Ramp (G)', type: 'ramp', floor: 0, x: 750, y: 500, accessible: true, isDestination: false },

  // Upper Level (Platforms)
  { id: 'R-U-BRIDGE', label: 'Foot Overbridge', type: 'intersection', floor: 1, x: 500, y: 400, accessible: true, isDestination: false },
  { id: 'R-U-TOIL', label: 'Restrooms (Upper)', type: 'toilet', floor: 1, x: 900, y: 400, accessible: true, isDestination: true },
  
  // Vertical Transportation (Upper)
  { id: 'R-U-ELEV1', label: 'Platform 1-2 Elevator (U)', type: 'elevator', floor: 1, x: 300, y: 500, accessible: true, isDestination: false },
  { id: 'R-U-STAIR1', label: 'Platform 1-2 Stairs (U)', type: 'stairs', floor: 1, x: 350, y: 500, accessible: false, isDestination: false },
  { id: 'R-U-RAMP1', label: 'Platform 1-2 Ramp (U)', type: 'ramp', floor: 1, x: 400, y: 500, accessible: true, isDestination: false },
  
  { id: 'R-U-ELEV2', label: 'Platform 3-4 Elevator (U)', type: 'elevator', floor: 1, x: 500, y: 500, accessible: true, isDestination: false },
  { id: 'R-U-STAIR2', label: 'Platform 3-4 Stairs (U)', type: 'stairs', floor: 1, x: 550, y: 500, accessible: false, isDestination: false },
  
  { id: 'R-U-STAIR3', label: 'Platform 5 Stairs (U)', type: 'stairs', floor: 1, x: 700, y: 500, accessible: false, isDestination: false },
  { id: 'R-U-RAMP2', label: 'Platform 5 Ramp (U)', type: 'ramp', floor: 1, x: 750, y: 500, accessible: true, isDestination: false },
  
  // Platforms
  { id: 'R-U-PLAT1', label: 'Platform 1', type: 'platform', floor: 1, x: 200, y: 300, accessible: true, isDestination: true },
  { id: 'R-U-PLAT2', label: 'Platform 2', type: 'platform', floor: 1, x: 300, y: 300, accessible: true, isDestination: true },
  { id: 'R-U-PLAT3', label: 'Platform 3', type: 'platform', floor: 1, x: 500, y: 300, accessible: true, isDestination: true },
  { id: 'R-U-PLAT4', label: 'Platform 4', type: 'platform', floor: 1, x: 600, y: 300, accessible: true, isDestination: true },
  { id: 'R-U-PLAT5', label: 'Platform 5', type: 'platform', floor: 1, x: 800, y: 300, accessible: true, isDestination: true },
];

const edgePairs: Array<[string, string, number, EdgeType, boolean]> = [
  // Ground connections
  ['R-G-ENT', 'R-G-INFO', 10, 'hallway', true],
  ['R-G-INFO', 'R-G-TICKET', 20, 'hallway', true],
  ['R-G-INFO', 'R-G-WAIT', 20, 'hallway', true],
  ['R-G-INFO', 'R-G-INT2', 25, 'hallway', true],
  ['R-G-TICKET', 'R-G-LUGG', 15, 'hallway', true],
  ['R-G-WAIT', 'R-G-FOOD', 15, 'hallway', true],
  ['R-G-FOOD', 'R-G-TOIL', 20, 'hallway', true],
  
  ['R-G-LUGG', 'R-G-INT1', 15, 'hallway', true],
  ['R-G-INT2', 'R-G-INT1', 10, 'hallway', true],
  ['R-G-INT2', 'R-G-INT3', 10, 'hallway', true],
  ['R-G-FOOD', 'R-G-INT3', 15, 'hallway', true],
  
  ['R-G-INT1', 'R-G-ELEV1', 10, 'hallway', true],
  ['R-G-INT1', 'R-G-STAIR1', 10, 'hallway', true],
  ['R-G-INT1', 'R-G-RAMP1', 10, 'hallway', true],
  
  ['R-G-INT2', 'R-G-ELEV2', 10, 'hallway', true],
  ['R-G-INT2', 'R-G-STAIR2', 10, 'hallway', true],
  
  ['R-G-INT3', 'R-G-STAIR3', 10, 'hallway', true],
  ['R-G-INT3', 'R-G-RAMP2', 10, 'hallway', true],
  
  // Vertical connections
  ['R-G-ELEV1', 'R-U-ELEV1', 8, 'elevator', true],
  ['R-G-STAIR1', 'R-U-STAIR1', 15, 'stairs', false],
  ['R-G-RAMP1', 'R-U-RAMP1', 25, 'ramp', true],
  
  ['R-G-ELEV2', 'R-U-ELEV2', 8, 'elevator', true],
  ['R-G-STAIR2', 'R-U-STAIR2', 15, 'stairs', false],
  
  ['R-G-STAIR3', 'R-U-STAIR3', 15, 'stairs', false],
  ['R-G-RAMP2', 'R-U-RAMP2', 25, 'ramp', true],
  
  // Upper connections
  ['R-U-ELEV1', 'R-U-PLAT1', 20, 'hallway', true],
  ['R-U-STAIR1', 'R-U-PLAT1', 20, 'hallway', true],
  ['R-U-RAMP1', 'R-U-PLAT1', 15, 'hallway', true],
  
  ['R-U-ELEV1', 'R-U-PLAT2', 20, 'hallway', true],
  ['R-U-STAIR1', 'R-U-PLAT2', 20, 'hallway', true],
  ['R-U-RAMP1', 'R-U-PLAT2', 15, 'hallway', true],
  
  ['R-U-ELEV1', 'R-U-BRIDGE', 30, 'hallway', true], // Connected through bridge
  
  ['R-U-ELEV2', 'R-U-PLAT3', 20, 'hallway', true],
  ['R-U-STAIR2', 'R-U-PLAT3', 20, 'hallway', true],
  ['R-U-ELEV2', 'R-U-PLAT4', 20, 'hallway', true],
  ['R-U-STAIR2', 'R-U-PLAT4', 20, 'hallway', true],
  
  ['R-U-ELEV2', 'R-U-BRIDGE', 10, 'hallway', true],
  
  ['R-U-STAIR3', 'R-U-PLAT5', 20, 'hallway', true],
  ['R-U-RAMP2', 'R-U-PLAT5', 15, 'hallway', true],
  
  ['R-U-STAIR3', 'R-U-BRIDGE', 20, 'hallway', true],
  
  ['R-U-BRIDGE', 'R-U-TOIL', 40, 'hallway', true]
];

const edges: VenueEdge[] = [];
let edgeIdCounter = 1;
for (const [from, to, distance, type, accessible] of edgePairs) {
  const baseId = `rail-edge-${String(edgeIdCounter++).padStart(3, '0')}`;
  const width = type === 'hallway' ? 250 : 150;
  const slope = type === 'ramp' ? 6 : 0;
  const hasHandrails = type === 'stairs' || type === 'ramp';
  
  edges.push({
    id: `${baseId}-f`, from, to, distance, type, accessible, width, hasHandrails, hasTactileGuide: true, slope, blocked: false
  });
  edges.push({
    id: `${baseId}-b`, from: to, to: from, distance, type, accessible, width, hasHandrails, hasTactileGuide: true, slope, blocked: false
  });
}

export const railwayVenue: Venue = {
  id: 'venue-railway',
  name: 'Central Railway Station',
  type: 'railway',
  icon: 'train',
  description: 'Major transit hub with 5 platforms, accessible ramps, and elevators.',
  floors: 2,
  floorLabels: ['Ground Concourse', 'Upper Platforms'],
  defaultEntrance: 'R-G-ENT',
  nodes,
  edges
};
