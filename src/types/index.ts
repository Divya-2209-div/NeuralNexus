// ============================================================
// AccessLens AI — Core Type Definitions
// ============================================================

// --- Accessibility Profiles ---

export type AccessibilityProfile = 
  | 'wheelchair'
  | 'visual_impairment'
  | 'hearing_impairment'
  | 'cognitive'
  | 'elderly';

export interface AccessibilityProfileInfo {
  id: AccessibilityProfile;
  label: string;
  icon: string;
  description: string;
  color: string;
  routingRules: string[];
}

// --- Venue Graph ---

export type NodeType = 
  | 'entrance'
  | 'room'
  | 'platform'
  | 'gate'
  | 'intersection'
  | 'elevator'
  | 'stairs'
  | 'ramp'
  | 'toilet'
  | 'rest_area'
  | 'exit'
  | 'escalator'
  | 'information'
  | 'ticket_counter'
  | 'security'
  | 'check_in'
  | 'lounge'
  | 'pharmacy'
  | 'emergency'
  | 'waiting_area';

export type EdgeType = 
  | 'hallway'
  | 'stairs'
  | 'elevator'
  | 'ramp'
  | 'escalator'
  | 'outdoor'
  | 'moving_walkway';

export interface VenueNode {
  id: string;
  label: string;
  type: NodeType;
  floor: number;
  x: number;          // 0-1000 for SVG rendering
  y: number;          // 0-1000 for SVG rendering
  accessible: boolean;
  isDestination: boolean;  // Can be selected as a destination
  facilities?: string[];
  description?: string;
}

export interface VenueEdge {
  id: string;
  from: string;
  to: string;
  distance: number;       // meters
  type: EdgeType;
  accessible: boolean;    // wheelchair-passable
  width: number;          // cm
  hasHandrails: boolean;
  hasTactileGuide: boolean;
  slope: number;          // gradient percentage, 0 = flat
  blocked: boolean;
}

export type VenueType = 'hospital' | 'railway' | 'airport' | 'college' | 'mall' | 'government' | 'bus_terminal';

export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  icon: string;
  description: string;
  floors: number;
  floorLabels: string[];
  nodes: VenueNode[];
  edges: VenueEdge[];
  defaultEntrance: string;  // node id
}

// --- Routing ---

export interface RouteStep {
  nodeId: string;
  label: string;
  instruction: string;
  floor: number;
  type: EdgeType | 'start' | 'end';
  distance: number;
  accessibilityNote?: string;
}

export interface Route {
  path: string[];           // ordered node IDs
  steps: RouteStep[];
  totalDistance: number;
  estimatedTime: number;    // seconds
  accessibilityScore: number; // 0-100
  warnings: string[];
  avoidedObstacles: string[];
}

export interface RouteRequest {
  venueId: string;
  startNodeId: string;
  endNodeId: string;
  profile: AccessibilityProfile;
}

// --- Barriers ---

export type BarrierType = 
  | 'elevator_unavailable'
  | 'ramp_blocked'
  | 'path_obstructed'
  | 'stairs_blocked'
  | 'door_inaccessible';

export interface Barrier {
  id: string;
  edgeId: string;
  nodeId?: string;
  type: BarrierType;
  description: string;
  reportedAt: Date;
  venueId: string;
  active: boolean;
}

// --- CV / YOLO ---

export interface Detection {
  id: string;
  label: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  accessibilityImpact: 'positive' | 'negative' | 'neutral';
  impactDescription: string;
}

export interface ScanResult {
  detections: Detection[];
  isDemo: boolean;
  processingTime: number;
  imageWidth: number;
  imageHeight: number;
}

// --- Gemini AI ---

export interface GeminiResponse {
  text: string;
  isDemo: boolean;
}

// --- Dashboard ---

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  venueId: string;
  timestamp: Date;
}

export interface RecentRoute {
  id: string;
  venueId: string;
  venueName: string;
  from: string;
  to: string;
  profile: AccessibilityProfile;
  timestamp: Date;
}

// --- App State ---

export interface AppState {
  selectedVenue: Venue | null;
  selectedProfile: AccessibilityProfile | null;
  currentRoute: Route | null;
  barriers: Barrier[];
  recentRoutes: RecentRoute[];
  alerts: DashboardAlert[];
  voiceEnabled: boolean;
}

export type AppAction =
  | { type: 'SET_VENUE'; payload: Venue }
  | { type: 'SET_PROFILE'; payload: AccessibilityProfile }
  | { type: 'SET_ROUTE'; payload: Route | null }
  | { type: 'ADD_BARRIER'; payload: Barrier }
  | { type: 'REMOVE_BARRIER'; payload: string }
  | { type: 'ADD_RECENT_ROUTE'; payload: RecentRoute }
  | { type: 'ADD_ALERT'; payload: DashboardAlert }
  | { type: 'REMOVE_ALERT'; payload: string }
  | { type: 'TOGGLE_VOICE'; payload?: undefined }
  | { type: 'CLEAR_ROUTE'; payload?: undefined };
