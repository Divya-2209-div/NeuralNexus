import type { AccessibilityProfile, VenueEdge, VenueNode, RouteStep } from '../types';

export function getProfileCostMultiplier(edge: VenueEdge, profile: AccessibilityProfile): number {
  if (edge.blocked) return Infinity;

  let multiplier = 1.0;

  switch (profile) {
    case 'wheelchair':
      if (edge.type === 'stairs' || edge.type === 'escalator') return Infinity;
      if (edge.width < 90) return Infinity;
      if (edge.slope > 8) return Infinity;
      
      if (edge.type === 'elevator') multiplier *= 0.5;
      if (edge.type === 'ramp') multiplier *= 0.7;
      break;

    case 'visual_impairment':
      if (edge.hasTactileGuide) multiplier *= 0.7; // -30% cost
      else multiplier *= 1.5; // +50% cost penalty
      
      if (edge.type === 'stairs') multiplier *= 1.2;
      break;

    case 'hearing_impairment':
      // standard routing
      break;

    case 'cognitive':
      if (edge.type === 'elevator' || edge.type === 'ramp') multiplier *= 0.8;
      break;

    case 'elderly':
      if (edge.type === 'stairs') multiplier *= 5.0;
      if (edge.type === 'elevator') multiplier *= 0.3;
      if (edge.type === 'ramp') multiplier *= 0.6;
      break;
  }

  return multiplier;
}

export function generateInstruction(fromNode: VenueNode, toNode: VenueNode, edge: VenueEdge): string {
  let action = 'Go straight';
  
  if (edge.type === 'stairs') {
    action = fromNode.floor < toNode.floor ? 'Take the stairs up' : 'Take the stairs down';
  } else if (edge.type === 'elevator') {
    action = `Take the elevator to floor ${toNode.floor}`;
  } else if (edge.type === 'escalator') {
    action = fromNode.floor < toNode.floor ? 'Take the escalator up' : 'Take the escalator down';
  } else if (edge.type === 'ramp') {
    action = 'Proceed via the ramp';
  } else {
    // Basic direction phrasing
    action = `Head towards ${toNode.label}`;
  }

  return `${action} (approx. ${Math.round(edge.distance)}m)`;
}

export function getAccessibilityScore(routeSteps: RouteStep[], profile: AccessibilityProfile): number {
  let score = 100;
  let elevatorBonus = 0;
  let handrailBonus = 0;
  
  for (const step of routeSteps) {
    // Penalties
    if (step.type === 'stairs') {
      if (profile === 'wheelchair') score -= 30;
      else if (profile === 'elderly') score -= 15;
      else score -= 5;
    }
    if (step.accessibilityNote?.includes('penalty')) {
      score -= 8;
    }
    
    // Bonuses
    if (step.type === 'elevator') {
      if (profile === 'wheelchair' || profile === 'elderly') elevatorBonus += 5;
    }
    if (step.type === 'ramp') {
      if (profile === 'wheelchair') elevatorBonus += 3;
    }
  }
  
  score += Math.min(15, elevatorBonus);
  return Math.max(0, Math.min(100, score));
}

export function calculateEstimatedWalkTime(distanceMeters: number, profile: AccessibilityProfile): number {
  const speed = profile === 'elderly' ? 0.8 : 1.2; // meters per second
  return distanceMeters / speed;
}
