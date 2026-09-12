import type { Venue, VenueNode, VenueEdge, EdgeType, NodeType } from '../../types';

const nodes: VenueNode[] = [
  // Ground Floor (Arrivals)
  { id: 'A-0-ENT', label: 'Arrivals Exit / Main Entrance', type: 'entrance', floor: 0, x: 500, y: 950, accessible: true, isDestination: true },
  { id: 'A-0-CLAIM', label: 'Baggage Claim', type: 'room', floor: 0, x: 500, y: 750, accessible: true, isDestination: true },
  { id: 'A-0-INFO', label: 'Arrivals Info Desk', type: 'information', floor: 0, x: 300, y: 850, accessible: true, isDestination: true },
  { id: 'A-0-TOIL', label: 'Arrivals Restrooms', type: 'toilet', floor: 0, x: 200, y: 750, accessible: true, isDestination: true },
  { id: 'A-0-REST', label: 'Arrivals Seating', type: 'rest_area', floor: 0, x: 800, y: 750, accessible: true, isDestination: true },
  { id: 'A-0-INT1', label: 'Arrivals Concourse A', type: 'intersection', floor: 0, x: 400, y: 600, accessible: true, isDestination: false },
  { id: 'A-0-INT2', label: 'Arrivals Concourse B', type: 'intersection', floor: 0, x: 600, y: 600, accessible: true, isDestination: false },
  
  { id: 'A-0-ELEV1', label: 'West Elevator (0)', type: 'elevator', floor: 0, x: 350, y: 550, accessible: true, isDestination: false },
  { id: 'A-0-STAIR1', label: 'West Stairs (0)', type: 'stairs', floor: 0, x: 300, y: 550, accessible: false, isDestination: false },
  { id: 'A-0-ESC1', label: 'West Escalator (0)', type: 'escalator', floor: 0, x: 250, y: 550, accessible: false, isDestination: false },

  { id: 'A-0-ELEV2', label: 'East Elevator (0)', type: 'elevator', floor: 0, x: 650, y: 550, accessible: true, isDestination: false },
  { id: 'A-0-ELEV3', label: 'Center Elevator (0)', type: 'elevator', floor: 0, x: 500, y: 550, accessible: true, isDestination: false },

  // First Floor (Departures/Check-in)
  { id: 'A-1-ENT', label: 'Departures Entrance', type: 'entrance', floor: 1, x: 500, y: 950, accessible: true, isDestination: true },
  { id: 'A-1-CHECK', label: 'Check-in Counters', type: 'check_in', floor: 1, x: 500, y: 750, accessible: true, isDestination: true },
  { id: 'A-1-INFO', label: 'Departures Info Desk', type: 'information', floor: 1, x: 300, y: 850, accessible: true, isDestination: true },
  { id: 'A-1-TOIL', label: 'Departures Restrooms', type: 'toilet', floor: 1, x: 200, y: 750, accessible: true, isDestination: true },
  { id: 'A-1-INT1', label: 'Departures Concourse A', type: 'intersection', floor: 1, x: 400, y: 600, accessible: true, isDestination: false },
  { id: 'A-1-INT2', label: 'Departures Concourse B', type: 'intersection', floor: 1, x: 600, y: 600, accessible: true, isDestination: false },
  { id: 'A-1-SEC', label: 'Security Check', type: 'security', floor: 1, x: 500, y: 500, accessible: true, isDestination: true },

  { id: 'A-1-ELEV1', label: 'West Elevator (1)', type: 'elevator', floor: 1, x: 350, y: 550, accessible: true, isDestination: false },
  { id: 'A-1-STAIR1', label: 'West Stairs (1)', type: 'stairs', floor: 1, x: 300, y: 550, accessible: false, isDestination: false },
  { id: 'A-1-ESC1', label: 'West Escalator (1)', type: 'escalator', floor: 1, x: 250, y: 550, accessible: false, isDestination: false },

  { id: 'A-1-ELEV2', label: 'East Elevator (1)', type: 'elevator', floor: 1, x: 650, y: 550, accessible: true, isDestination: false },
  { id: 'A-1-ELEV3', label: 'Center Elevator (1)', type: 'elevator', floor: 1, x: 500, y: 550, accessible: true, isDestination: false },
  { id: 'A-1-STAIR2', label: 'Center Stairs (1)', type: 'stairs', floor: 1, x: 550, y: 550, accessible: false, isDestination: false },
  { id: 'A-1-ESC2', label: 'Center Escalator (1)', type: 'escalator', floor: 1, x: 450, y: 550, accessible: false, isDestination: false },

  // Second Floor (Gates)
  { id: 'A-2-SEC_OUT', label: 'Post-Security', type: 'intersection', floor: 2, x: 500, y: 500, accessible: true, isDestination: false },
  { id: 'A-2-DUTY', label: 'Duty Free Shop', type: 'room', floor: 2, x: 500, y: 400, accessible: true, isDestination: true },
  { id: 'A-2-INT1', label: 'Airside Concourse', type: 'intersection', floor: 2, x: 500, y: 300, accessible: true, isDestination: false },
  { id: 'A-2-LOUNGE', label: 'Premium Lounge', type: 'lounge', floor: 2, x: 500, y: 200, accessible: true, isDestination: true },
  { id: 'A-2-TOIL', label: 'Airside Restrooms', type: 'toilet', floor: 2, x: 500, y: 100, accessible: true, isDestination: true },

  { id: 'A-2-WALK1', label: 'Domestic Walkway', type: 'intersection', floor: 2, x: 350, y: 300, accessible: true, isDestination: false },
  { id: 'A-2-GA1', label: 'Gate A1', type: 'gate', floor: 2, x: 200, y: 300, accessible: true, isDestination: true },
  { id: 'A-2-GA2', label: 'Gate A2', type: 'gate', floor: 2, x: 100, y: 300, accessible: true, isDestination: true },
  { id: 'A-2-GA3', label: 'Gate A3', type: 'gate', floor: 2, x: 50, y: 300, accessible: true, isDestination: true },

  { id: 'A-2-WALK2', label: 'Intl Walkway', type: 'intersection', floor: 2, x: 650, y: 300, accessible: true, isDestination: false },
  { id: 'A-2-GB1', label: 'Gate B1', type: 'gate', floor: 2, x: 800, y: 300, accessible: true, isDestination: true },
  { id: 'A-2-GB2', label: 'Gate B2', type: 'gate', floor: 2, x: 900, y: 300, accessible: true, isDestination: true },
  { id: 'A-2-GB3', label: 'Gate B3', type: 'gate', floor: 2, x: 950, y: 300, accessible: true, isDestination: true },

  { id: 'A-2-ELEV1', label: 'West Elevator (2)', type: 'elevator', floor: 2, x: 350, y: 550, accessible: true, isDestination: false },
  { id: 'A-2-ELEV2', label: 'East Elevator (2)', type: 'elevator', floor: 2, x: 650, y: 550, accessible: true, isDestination: false },
  { id: 'A-2-ELEV3', label: 'Center Elevator (2)', type: 'elevator', floor: 2, x: 500, y: 550, accessible: true, isDestination: false },
  { id: 'A-2-STAIR2', label: 'Center Stairs (2)', type: 'stairs', floor: 2, x: 550, y: 550, accessible: false, isDestination: false },
  { id: 'A-2-ESC2', label: 'Center Escalator (2)', type: 'escalator', floor: 2, x: 450, y: 550, accessible: false, isDestination: false },
];

const edgePairs: Array<[string, string, number, EdgeType, boolean]> = [
  // Ground connections
  ['A-0-ENT', 'A-0-INFO', 15, 'hallway', true],
  ['A-0-ENT', 'A-0-CLAIM', 20, 'hallway', true],
  ['A-0-CLAIM', 'A-0-TOIL', 30, 'hallway', true],
  ['A-0-CLAIM', 'A-0-REST', 30, 'hallway', true],
  ['A-0-CLAIM', 'A-0-INT1', 25, 'hallway', true],
  ['A-0-CLAIM', 'A-0-INT2', 25, 'hallway', true],
  ['A-0-INT1', 'A-0-ELEV1', 10, 'hallway', true],
  ['A-0-INT1', 'A-0-STAIR1', 15, 'hallway', true],
  ['A-0-INT1', 'A-0-ESC1', 15, 'hallway', true],
  ['A-0-INT2', 'A-0-ELEV2', 10, 'hallway', true],
  ['A-0-CLAIM', 'A-0-ELEV3', 15, 'hallway', true],

  // First connections
  ['A-1-ENT', 'A-1-INFO', 15, 'hallway', true],
  ['A-1-ENT', 'A-1-CHECK', 20, 'hallway', true],
  ['A-1-CHECK', 'A-1-TOIL', 30, 'hallway', true],
  ['A-1-CHECK', 'A-1-INT1', 25, 'hallway', true],
  ['A-1-CHECK', 'A-1-INT2', 25, 'hallway', true],
  ['A-1-INT1', 'A-1-ELEV1', 10, 'hallway', true],
  ['A-1-INT1', 'A-1-STAIR1', 15, 'hallway', true],
  ['A-1-INT1', 'A-1-ESC1', 15, 'hallway', true],
  ['A-1-INT2', 'A-1-ELEV2', 10, 'hallway', true],
  ['A-1-CHECK', 'A-1-ELEV3', 15, 'hallway', true],
  
  ['A-1-CHECK', 'A-1-SEC', 25, 'hallway', true],
  ['A-1-SEC', 'A-1-ELEV3', 10, 'hallway', true],
  ['A-1-SEC', 'A-1-STAIR2', 10, 'hallway', true],
  ['A-1-SEC', 'A-1-ESC2', 10, 'hallway', true],

  // Second connections
  ['A-2-SEC_OUT', 'A-2-DUTY', 20, 'hallway', true],
  ['A-2-DUTY', 'A-2-INT1', 30, 'hallway', true],
  ['A-2-INT1', 'A-2-LOUNGE', 20, 'hallway', true],
  ['A-2-INT1', 'A-2-TOIL', 40, 'hallway', true],
  
  // Domestic wing
  ['A-2-INT1', 'A-2-WALK1', 20, 'hallway', true],
  ['A-2-WALK1', 'A-2-GA1', 30, 'moving_walkway', true],
  ['A-2-GA1', 'A-2-GA2', 20, 'hallway', true],
  ['A-2-GA2', 'A-2-GA3', 20, 'hallway', true],
  
  // International wing
  ['A-2-INT1', 'A-2-WALK2', 20, 'hallway', true],
  ['A-2-WALK2', 'A-2-GB1', 30, 'moving_walkway', true],
  ['A-2-GB1', 'A-2-GB2', 20, 'hallway', true],
  ['A-2-GB2', 'A-2-GB3', 20, 'hallway', true],
  
  ['A-2-SEC_OUT', 'A-2-ELEV3', 10, 'hallway', true],
  ['A-2-SEC_OUT', 'A-2-STAIR2', 10, 'hallway', true],
  ['A-2-SEC_OUT', 'A-2-ESC2', 10, 'hallway', true],
  
  ['A-2-SEC_OUT', 'A-2-ELEV1', 40, 'hallway', true],
  ['A-2-SEC_OUT', 'A-2-ELEV2', 40, 'hallway', true],

  // Vertical connections
  ['A-0-ELEV1', 'A-1-ELEV1', 8, 'elevator', true],
  ['A-1-ELEV1', 'A-2-ELEV1', 8, 'elevator', true],
  
  ['A-0-ELEV2', 'A-1-ELEV2', 8, 'elevator', true],
  ['A-1-ELEV2', 'A-2-ELEV2', 8, 'elevator', true],
  
  ['A-0-ELEV3', 'A-1-ELEV3', 8, 'elevator', true],
  ['A-1-ELEV3', 'A-2-ELEV3', 8, 'elevator', true],
  
  ['A-0-STAIR1', 'A-1-STAIR1', 15, 'stairs', false],
  ['A-1-STAIR2', 'A-2-STAIR2', 15, 'stairs', false],
  
  ['A-0-ESC1', 'A-1-ESC1', 12, 'escalator', false],
  ['A-1-ESC2', 'A-2-ESC2', 12, 'escalator', false],
];

const edges: VenueEdge[] = [];
let edgeIdCounter = 1;
for (const [from, to, distance, type, accessible] of edgePairs) {
  const baseId = `air-edge-${String(edgeIdCounter++).padStart(3, '0')}`;
  const width = type === 'hallway' ? 300 : (type === 'moving_walkway' ? 200 : 150);
  const slope = type === 'ramp' ? 6 : 0;
  const hasHandrails = type === 'stairs' || type === 'ramp' || type === 'escalator';
  
  edges.push({
    id: `${baseId}-f`, from, to, distance, type, accessible, width, hasHandrails, hasTactileGuide: true, slope, blocked: false
  });
  edges.push({
    id: `${baseId}-b`, from: to, to: from, distance, type, accessible, width, hasHandrails, hasTactileGuide: true, slope, blocked: false
  });
}

export const airportVenue: Venue = {
  id: 'venue-airport',
  name: 'SkyPort Airport',
  type: 'airport',
  icon: 'plane',
  description: 'International airport with 3 main levels including Arrivals, Departures, and boarding gates.',
  floors: 3,
  floorLabels: ['Ground - Arrivals', 'First - Departures', 'Second - Gates'],
  defaultEntrance: 'A-1-ENT',
  nodes,
  edges
};
