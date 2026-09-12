import type { Venue, VenueNode, VenueEdge, EdgeType, NodeType } from '../../types';

const nodes: VenueNode[] = [
  { id: 'H-G-ENT', label: 'Main Entrance', type: 'entrance', floor: 0, x: 500, y: 950, accessible: true, isDestination: true },
  { id: 'H-G-REC', label: 'Reception', type: 'information', floor: 0, x: 500, y: 850, accessible: true, isDestination: true },
  { id: 'H-G-INT1', label: 'Lobby Intersection', type: 'intersection', floor: 0, x: 500, y: 750, accessible: true, isDestination: false },
  { id: 'H-G-ER', label: 'Emergency Room', type: 'emergency', floor: 0, x: 200, y: 750, accessible: true, isDestination: true },
  { id: 'H-G-PHARM', label: 'Pharmacy', type: 'pharmacy', floor: 0, x: 800, y: 750, accessible: true, isDestination: true },
  { id: 'H-G-INT2', label: 'West Corridor', type: 'intersection', floor: 0, x: 350, y: 600, accessible: true, isDestination: false },
  { id: 'H-G-INT3', label: 'East Corridor', type: 'intersection', floor: 0, x: 650, y: 600, accessible: true, isDestination: false },
  { id: 'H-G-ELEV1', label: 'West Elevator (G)', type: 'elevator', floor: 0, x: 300, y: 600, accessible: true, isDestination: false },
  { id: 'H-G-STAIR1', label: 'West Stairs (G)', type: 'stairs', floor: 0, x: 250, y: 600, accessible: false, isDestination: false },
  { id: 'H-G-ELEV2', label: 'East Elevator (G)', type: 'elevator', floor: 0, x: 700, y: 600, accessible: true, isDestination: false },
  { id: 'H-G-STAIR2', label: 'East Stairs (G)', type: 'stairs', floor: 0, x: 750, y: 600, accessible: false, isDestination: false },
  { id: 'H-G-CAFE', label: 'Cafeteria', type: 'room', floor: 0, x: 800, y: 500, accessible: true, isDestination: true },
  { id: 'H-G-TOIL', label: 'Ground Washroom', type: 'toilet', floor: 0, x: 200, y: 500, accessible: true, isDestination: true },
  { id: 'H-G-REST', label: 'Lobby Rest Area', type: 'rest_area', floor: 0, x: 500, y: 650, accessible: true, isDestination: true },

  { id: 'H-1-INFO', label: 'F1 Information', type: 'information', floor: 1, x: 500, y: 850, accessible: true, isDestination: true },
  { id: 'H-1-INT1', label: 'F1 West Corridor', type: 'intersection', floor: 1, x: 350, y: 600, accessible: true, isDestination: false },
  { id: 'H-1-INT2', label: 'F1 East Corridor', type: 'intersection', floor: 1, x: 650, y: 600, accessible: true, isDestination: false },
  { id: 'H-1-RAD', label: 'Radiology', type: 'room', floor: 1, x: 200, y: 750, accessible: true, isDestination: true },
  { id: 'H-1-CARD', label: 'Cardiology', type: 'room', floor: 1, x: 800, y: 750, accessible: true, isDestination: true },
  { id: 'H-1-ELEV1', label: 'West Elevator (F1)', type: 'elevator', floor: 1, x: 300, y: 600, accessible: true, isDestination: false },
  { id: 'H-1-STAIR1', label: 'West Stairs (F1)', type: 'stairs', floor: 1, x: 250, y: 600, accessible: false, isDestination: false },
  { id: 'H-1-ELEV2', label: 'East Elevator (F1)', type: 'elevator', floor: 1, x: 700, y: 600, accessible: true, isDestination: false },
  { id: 'H-1-STAIR2', label: 'East Stairs (F1)', type: 'stairs', floor: 1, x: 750, y: 600, accessible: false, isDestination: false },
  { id: 'H-1-TOIL', label: 'F1 Washroom', type: 'toilet', floor: 1, x: 200, y: 500, accessible: true, isDestination: true },
  { id: 'H-1-REST', label: 'F1 Rest Area', type: 'rest_area', floor: 1, x: 800, y: 500, accessible: true, isDestination: true },
  { id: 'H-1-RAMP1', label: 'F1 Internal Ramp', type: 'ramp', floor: 1, x: 500, y: 700, accessible: true, isDestination: false },
  { id: 'H-1-INT3', label: 'F1 North Corridor', type: 'intersection', floor: 1, x: 500, y: 750, accessible: true, isDestination: false },

  { id: 'H-2-INFO', label: 'F2 Information', type: 'information', floor: 2, x: 500, y: 850, accessible: true, isDestination: true },
  { id: 'H-2-INT1', label: 'F2 West Corridor', type: 'intersection', floor: 2, x: 350, y: 600, accessible: true, isDestination: false },
  { id: 'H-2-INT2', label: 'F2 East Corridor', type: 'intersection', floor: 2, x: 650, y: 600, accessible: true, isDestination: false },
  { id: 'H-2-INT3', label: 'F2 North Corridor', type: 'intersection', floor: 2, x: 500, y: 750, accessible: true, isDestination: false },
  { id: 'H-2-WARD', label: 'General Ward', type: 'room', floor: 2, x: 800, y: 750, accessible: true, isDestination: true },
  { id: 'H-2-ICU', label: 'ICU', type: 'room', floor: 2, x: 200, y: 750, accessible: true, isDestination: true },
  { id: 'H-2-SURG', label: 'Surgery', type: 'room', floor: 2, x: 500, y: 400, accessible: true, isDestination: true },
  { id: 'H-2-ELEV1', label: 'West Elevator (F2)', type: 'elevator', floor: 2, x: 300, y: 600, accessible: true, isDestination: false },
  { id: 'H-2-STAIR1', label: 'West Stairs (F2)', type: 'stairs', floor: 2, x: 250, y: 600, accessible: false, isDestination: false },
  { id: 'H-2-ELEV2', label: 'East Elevator (F2)', type: 'elevator', floor: 2, x: 700, y: 600, accessible: true, isDestination: false },
  { id: 'H-2-STAIR2', label: 'East Stairs (F2)', type: 'stairs', floor: 2, x: 750, y: 600, accessible: false, isDestination: false },
  { id: 'H-2-TOIL', label: 'F2 Washroom', type: 'toilet', floor: 2, x: 200, y: 500, accessible: true, isDestination: true },
  { id: 'H-2-REST', label: 'F2 Rest Area', type: 'rest_area', floor: 2, x: 800, y: 500, accessible: true, isDestination: true },
];

const edgePairs: Array<[string, string, number, EdgeType, boolean]> = [
  // Ground Floor
  ['H-G-ENT', 'H-G-REC', 10, 'hallway', true],
  ['H-G-REC', 'H-G-INT1', 10, 'hallway', true],
  ['H-G-INT1', 'H-G-ER', 30, 'hallway', true],
  ['H-G-INT1', 'H-G-PHARM', 30, 'hallway', true],
  ['H-G-INT1', 'H-G-REST', 10, 'hallway', true],
  ['H-G-REST', 'H-G-INT2', 20, 'hallway', true],
  ['H-G-REST', 'H-G-INT3', 20, 'hallway', true],
  ['H-G-INT2', 'H-G-ELEV1', 5, 'hallway', true],
  ['H-G-INT2', 'H-G-STAIR1', 10, 'hallway', true],
  ['H-G-INT2', 'H-G-TOIL', 20, 'hallway', true],
  ['H-G-INT3', 'H-G-ELEV2', 5, 'hallway', true],
  ['H-G-INT3', 'H-G-STAIR2', 10, 'hallway', true],
  ['H-G-INT3', 'H-G-CAFE', 25, 'hallway', true],
  ['H-G-INT2', 'H-G-INT3', 30, 'hallway', true], // Connected corridor

  // First Floor
  ['H-1-INFO', 'H-1-INT3', 10, 'hallway', true],
  ['H-1-INT3', 'H-1-RAD', 30, 'hallway', true],
  ['H-1-INT3', 'H-1-CARD', 30, 'hallway', true],
  ['H-1-INT3', 'H-1-RAMP1', 10, 'hallway', true],
  ['H-1-RAMP1', 'H-1-INT1', 15, 'ramp', true], // Ramp alternative route
  ['H-1-RAMP1', 'H-1-INT2', 15, 'ramp', true],
  ['H-1-INT1', 'H-1-ELEV1', 5, 'hallway', true],
  ['H-1-INT1', 'H-1-STAIR1', 10, 'hallway', true],
  ['H-1-INT1', 'H-1-TOIL', 20, 'hallway', true],
  ['H-1-INT2', 'H-1-ELEV2', 5, 'hallway', true],
  ['H-1-INT2', 'H-1-STAIR2', 10, 'hallway', true],
  ['H-1-INT2', 'H-1-REST', 25, 'hallway', true],
  ['H-1-INT1', 'H-1-INT2', 30, 'hallway', true], // Connected corridor

  // Second Floor
  ['H-2-INFO', 'H-2-INT3', 10, 'hallway', true],
  ['H-2-INT3', 'H-2-ICU', 30, 'hallway', true],
  ['H-2-INT3', 'H-2-WARD', 30, 'hallway', true],
  ['H-2-INT3', 'H-2-INT1', 25, 'hallway', true],
  ['H-2-INT3', 'H-2-INT2', 25, 'hallway', true],
  ['H-2-INT1', 'H-2-ELEV1', 5, 'hallway', true],
  ['H-2-INT1', 'H-2-STAIR1', 10, 'hallway', true],
  ['H-2-INT1', 'H-2-TOIL', 20, 'hallway', true],
  ['H-2-INT2', 'H-2-ELEV2', 5, 'hallway', true],
  ['H-2-INT2', 'H-2-STAIR2', 10, 'hallway', true],
  ['H-2-INT2', 'H-2-REST', 25, 'hallway', true],
  ['H-2-INT1', 'H-2-INT2', 30, 'hallway', true], // Connected corridor
  ['H-2-INT1', 'H-2-SURG', 30, 'hallway', true],
  ['H-2-INT2', 'H-2-SURG', 30, 'hallway', true], // Multi-path to surgery

  // Floor Connections (Elevators & Stairs)
  ['H-G-ELEV1', 'H-1-ELEV1', 5, 'elevator', true],
  ['H-1-ELEV1', 'H-2-ELEV1', 5, 'elevator', true],
  ['H-G-ELEV2', 'H-1-ELEV2', 5, 'elevator', true],
  ['H-1-ELEV2', 'H-2-ELEV2', 5, 'elevator', true],
  ['H-G-STAIR1', 'H-1-STAIR1', 12, 'stairs', false],
  ['H-1-STAIR1', 'H-2-STAIR1', 12, 'stairs', false],
  ['H-G-STAIR2', 'H-1-STAIR2', 12, 'stairs', false],
  ['H-1-STAIR2', 'H-2-STAIR2', 12, 'stairs', false],
];

const edges: VenueEdge[] = [];
let edgeIdCounter = 1;
for (const [from, to, distance, type, accessible] of edgePairs) {
  const baseId = `hosp-edge-${String(edgeIdCounter++).padStart(3, '0')}`;
  const width = type === 'hallway' ? 200 : 150;
  const slope = type === 'ramp' ? 5 : 0;
  const hasHandrails = type === 'stairs' || type === 'ramp';
  
  edges.push({
    id: `${baseId}-f`, from, to, distance, type, accessible, width, hasHandrails, hasTactileGuide: true, slope, blocked: false
  });
  edges.push({
    id: `${baseId}-b`, from: to, to: from, distance, type, accessible, width, hasHandrails, hasTactileGuide: true, slope, blocked: false
  });
}

export const hospitalVenue: Venue = {
  id: 'venue-hospital',
  name: 'CarePoint Medical Center',
  type: 'hospital',
  icon: 'hospital',
  description: 'A comprehensive modern medical facility with emergency, radiology, and surgical wards.',
  floors: 3,
  floorLabels: ['Ground Floor', 'First Floor', 'Second Floor'],
  defaultEntrance: 'H-G-ENT',
  nodes,
  edges
};
