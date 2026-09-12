import { Graph } from './graph';
import type { AccessibilityProfile, Route, RouteStep, VenueNode, VenueEdge } from '../types';
import { 
  getProfileCostMultiplier, 
  generateInstruction, 
  getAccessibilityScore,
  calculateEstimatedWalkTime
} from './accessibility';

function calculateHeuristic(nodeA: VenueNode, nodeB: VenueNode): number {
  // SVG coordinates are 0-1000. Convert to approximate meters (divide by 20)
  const dx = (nodeA.x - nodeB.x) / 20;
  const dy = (nodeA.y - nodeB.y) / 20;
  const df = Math.abs(nodeA.floor - nodeB.floor) * 15; // ~15 meters per floor
  return Math.sqrt(dx * dx + dy * dy) + df;
}

export function findRoute(
  graph: Graph,
  startId: string,
  endId: string,
  profile: AccessibilityProfile
): Route {
  const startNode = graph.getNode(startId);
  const endNode = graph.getNode(endId);

  if (!startNode || !endNode) {
    throw new Error('Start or end node not found in graph');
  }

  // A* Initialization
  const openSet = new Set<string>();
  const closedSet = new Set<string>();
  
  openSet.add(startId);

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, { node: string, edge: string }>();

  graph.getAllNodes().forEach(n => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });

  gScore.set(startId, 0);
  fScore.set(startId, calculateHeuristic(startNode, endNode));

  while (openSet.size > 0) {
    // Find node with lowest fScore in openSet
    let currentId = '';
    let lowestFScore = Infinity;
    for (const id of openSet) {
      const score = fScore.get(id) ?? Infinity;
      if (score < lowestFScore) {
        lowestFScore = score;
        currentId = id;
      }
    }

    if (currentId === endId) {
      return reconstructRoute(graph, cameFrom, startId, endId, profile);
    }

    openSet.delete(currentId);
    closedSet.add(currentId);

    const neighbors = graph.getNeighbors(currentId);

    for (const { node: neighborNode, edge } of neighbors) {
      if (closedSet.has(neighborNode.id)) continue;

      const costMultiplier = getProfileCostMultiplier(edge, profile);
      if (costMultiplier === Infinity) continue; // Unreachable for this profile or blocked

      const currentG = gScore.get(currentId) ?? Infinity;
      const tentativeGScore = currentG + (edge.distance * costMultiplier);

      const neighborG = gScore.get(neighborNode.id) ?? Infinity;
      if (tentativeGScore < neighborG) {
        cameFrom.set(neighborNode.id, { node: currentId, edge: edge.id });
        gScore.set(neighborNode.id, tentativeGScore);
        fScore.set(neighborNode.id, tentativeGScore + calculateHeuristic(neighborNode, endNode));
        
        if (!openSet.has(neighborNode.id)) {
          openSet.add(neighborNode.id);
        }
      }
    }
  }

  throw new Error('No route found');
}

function reconstructRoute(
  graph: Graph,
  cameFrom: Map<string, { node: string, edge: string }>,
  startId: string,
  endId: string,
  profile: AccessibilityProfile
): Route {
  const path: string[] = [];
  const steps: RouteStep[] = [];
  let currentId = endId;
  let totalDistance = 0;
  const warnings: string[] = [];
  
  // Reconstruct path backwards
  const edgesTaken: VenueEdge[] = [];
  
  while (cameFrom.has(currentId)) {
    path.push(currentId);
    const { node: prevNodeId, edge: edgeId } = cameFrom.get(currentId)!;
    const edge = graph.getEdge(edgeId);
    if (edge) edgesTaken.push(edge);
    currentId = prevNodeId;
  }
  path.push(startId);
  path.reverse();
  edgesTaken.reverse();

  // Create start step
  const startNode = graph.getNode(startId)!;
  steps.push({
    nodeId: startId,
    label: startNode.label,
    instruction: `Start at ${startNode.label}`,
    floor: startNode.floor,
    type: 'start',
    distance: 0
  });

  // Create intermediate steps
  for (let i = 0; i < edgesTaken.length; i++) {
    const edge = edgesTaken[i];
    const fromNode = graph.getNode(path[i])!;
    const toNode = graph.getNode(path[i + 1])!;
    
    totalDistance += edge.distance;

    let accessibilityNote = undefined;
    const multiplier = getProfileCostMultiplier(edge, profile);
    if (multiplier > 1.0) {
      accessibilityNote = 'suboptimal segment penalty';
      if (!warnings.includes('Route contains suboptimal segments based on your profile.')) {
        warnings.push('Route contains suboptimal segments based on your profile.');
      }
    }

    steps.push({
      nodeId: toNode.id,
      label: toNode.label,
      instruction: generateInstruction(fromNode, toNode, edge),
      floor: toNode.floor,
      type: edge.type,
      distance: edge.distance,
      accessibilityNote
    });
  }

  // End step is essentially handled by the last intermediate step having the final node ID,
  // but if we need a specific 'end' step type, we can add it or modify the last one.
  if (steps.length > 1) {
    steps[steps.length - 1].instruction += `. You have arrived at ${graph.getNode(endId)?.label}.`;
  }

  const estimatedTime = calculateEstimatedWalkTime(totalDistance, profile);
  const accessibilityScore = getAccessibilityScore(steps, profile);

  return {
    path,
    steps,
    totalDistance,
    estimatedTime,
    accessibilityScore,
    warnings,
    avoidedObstacles: []
  };
}
