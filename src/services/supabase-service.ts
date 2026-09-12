import type { AccessibilityProfile, RecentRoute, Barrier } from '../types';

export class SupabaseService {
  private static readonly PROFILE_KEY = 'supabase_mock_profile';
  private static readonly HISTORY_KEY = 'supabase_mock_history';
  private static readonly BARRIERS_KEY = 'supabase_mock_barriers';

  saveProfile(profile: AccessibilityProfile): void {
    try {
      localStorage.setItem(SupabaseService.PROFILE_KEY, profile);
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  }

  getProfile(): AccessibilityProfile | null {
    try {
      const stored = localStorage.getItem(SupabaseService.PROFILE_KEY);
      return stored as AccessibilityProfile | null;
    } catch (e) {
      console.warn('Failed to get profile from localStorage', e);
      return null;
    }
  }

  saveRouteHistory(route: RecentRoute): void {
    try {
      const history = this.getRouteHistory();
      history.unshift(route); // Add to beginning
      
      // Keep only last 20 routes
      if (history.length > 20) {
        history.pop();
      }
      
      localStorage.setItem(SupabaseService.HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save route history to localStorage', e);
    }
  }

  getRouteHistory(): RecentRoute[] {
    try {
      const stored = localStorage.getItem(SupabaseService.HISTORY_KEY);
      if (stored) {
        const parsed: RecentRoute[] = JSON.parse(stored);
        // parse dates
        return parsed.map(r => ({ ...r, timestamp: new Date(r.timestamp) }));
      }
    } catch (e) {
      console.warn('Failed to get route history from localStorage', e);
    }
    return [];
  }

  saveBarrier(barrier: Barrier): void {
    try {
      const barriers = this.getBarriers();
      // Update if exists, else add
      const existingIdx = barriers.findIndex(b => b.id === barrier.id);
      if (existingIdx >= 0) {
        barriers[existingIdx] = barrier;
      } else {
        barriers.push(barrier);
      }
      localStorage.setItem(SupabaseService.BARRIERS_KEY, JSON.stringify(barriers));
    } catch (e) {
      console.warn('Failed to save barrier to localStorage', e);
    }
  }

  getBarriers(): Barrier[] {
    try {
      const stored = localStorage.getItem(SupabaseService.BARRIERS_KEY);
      if (stored) {
        const parsed: Barrier[] = JSON.parse(stored);
        return parsed.map(b => ({ ...b, reportedAt: new Date(b.reportedAt) }));
      }
    } catch (e) {
      console.warn('Failed to get barriers from localStorage', e);
    }
    return [];
  }
}
