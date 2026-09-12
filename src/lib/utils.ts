import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatTime(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}h ${remainMins}m`;
}

export function getBarrierTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    elevator_unavailable: 'Elevator Unavailable',
    ramp_blocked: 'Ramp Blocked',
    path_obstructed: 'Path Obstructed',
    stairs_blocked: 'Stairs Blocked',
    door_inaccessible: 'Door Inaccessible',
  };
  return labels[type] || type;
}

export function getNodeTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    entrance: 'door-open',
    exit: 'door-open',
    room: 'square',
    platform: 'train-front',
    gate: 'plane',
    intersection: 'git-branch',
    elevator: 'arrow-up-down',
    stairs: 'stairs',
    ramp: 'trending-up',
    toilet: 'bath',
    rest_area: 'sofa',
    escalator: 'arrow-up-right',
    information: 'info',
    ticket_counter: 'ticket',
    security: 'shield-check',
    check_in: 'clipboard-check',
    lounge: 'coffee',
    pharmacy: 'pill',
    emergency: 'siren',
    waiting_area: 'clock',
  };
  return icons[type] || 'map-pin';
}
