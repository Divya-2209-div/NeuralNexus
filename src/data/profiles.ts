import type { AccessibilityProfileInfo } from '../types';

export const ACCESSIBILITY_PROFILES: AccessibilityProfileInfo[] = [
  {
    id: 'wheelchair',
    label: 'Wheelchair / Mobility',
    icon: 'wheelchair',  // will map to Lucide icon
    description: 'Avoids stairs, prefers ramps and elevators. Requires wide paths (≥90cm).',
    color: '#4F46E5',
    routingRules: [
      'Avoids all stairs and escalators',
      'Prefers elevators and ramps',
      'Requires minimum 90cm path width',
      'Avoids steep slopes (>8%)',
    ],
  },
  {
    id: 'visual_impairment',
    label: 'Visual Impairment',
    icon: 'eye-off',
    description: 'Prefers tactile-guided paths with braille signage. Provides detailed voice guidance.',
    color: '#7C3AED',
    routingRules: [
      'Prefers paths with tactile guides',
      'Favors routes with braille signage',
      'Enhanced voice navigation instructions',
      'Avoids unmarked intersections',
    ],
  },
  {
    id: 'hearing_impairment',
    label: 'Hearing Impairment',
    icon: 'ear-off',
    description: 'Visual alerts and text-based guidance. No audio-dependent navigation.',
    color: '#0891B2',
    routingRules: [
      'All instructions displayed as text',
      'Visual alerts for all notifications',
      'No audio-dependent navigation steps',
      'Standard routing with visual guidance',
    ],
  },
  {
    id: 'cognitive',
    label: 'Cognitive Accessibility',
    icon: 'brain',
    description: 'Simplified step-by-step guidance. Focuses on single next action and clear visual cues.',
    color: '#D97706',
    routingRules: [
      'Single step-by-step simplified focus',
      'Clear advance notice before turns',
      'High-contrast visual landmarks',
      'Minimal distraction guidance mode',
    ],
  },
  {
    id: 'elderly',
    label: 'Elderly / Limited Mobility',
    icon: 'heart-handshake',
    description: 'Prefers elevators and shorter routes. Avoids stairs when possible. Highlights rest areas.',
    color: '#059669',
    routingRules: [
      'Strongly prefers elevators over stairs',
      'Favors shorter, easier routes',
      'Highlights nearby rest areas',
      'Avoids steep inclines',
    ],
  },
];

export function getProfileInfo(id: string): AccessibilityProfileInfo | undefined {
  return ACCESSIBILITY_PROFILES.find(p => p.id === id);
}
