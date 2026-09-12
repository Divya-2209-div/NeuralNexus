import type { Barrier } from '../types';
import { Graph } from '../engine/graph';

export class BarrierManager {
  private static instance: BarrierManager;
  private barriers: Map<string, Barrier>;
  private changeListeners: (() => void)[] = [];

  private constructor() {
    this.barriers = new Map();
    this.loadFromStorage();
  }

  static getInstance(): BarrierManager {
    if (!BarrierManager.instance) {
      BarrierManager.instance = new BarrierManager();
    }
    return BarrierManager.instance;
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('accesslens_barriers');
      if (stored) {
        const parsed: Barrier[] = JSON.parse(stored);
        parsed.forEach(b => {
          // Parse date back to object
          b.reportedAt = new Date(b.reportedAt);
          this.barriers.set(b.id, b);
        });
      }
    } catch (e) {
      console.warn('Failed to load barriers from localStorage', e);
    }
  }

  private saveToStorage() {
    try {
      const array = Array.from(this.barriers.values());
      localStorage.setItem('accesslens_barriers', JSON.stringify(array));
    } catch (e) {
      console.warn('Failed to save barriers to localStorage', e);
    }
  }

  reportBarrier(barrier: Barrier): void {
    this.barriers.set(barrier.id, barrier);
    this.saveToStorage();
    this.notifyListeners();
  }

  removeBarrier(barrierId: string): void {
    if (this.barriers.has(barrierId)) {
      this.barriers.delete(barrierId);
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  getActiveBarriers(venueId?: string): Barrier[] {
    const active = Array.from(this.barriers.values()).filter(b => b.active);
    if (venueId) {
      return active.filter(b => b.venueId === venueId);
    }
    return active;
  }

  isEdgeBlocked(edgeId: string): boolean {
    for (const barrier of this.barriers.values()) {
      if (barrier.active && barrier.edgeId === edgeId) {
        return true;
      }
    }
    return false;
  }

  applyBarriersToGraph(graph: Graph): void {
    // Reset all blocks first, then re-apply active ones
    // We assume default graph is unblocked or we rely on 'blocked' from venue data.
    // If venue data had original blocked status, we might lose it unless we distinguish.
    // Assuming barriers layer overrides completely for simplicity.
    const allEdges = graph.getAllEdges();
    
    // We only set to true if a barrier exists. If we need to restore, we'd need original state.
    // For now, if edge is blocked in barrier, mark it blocked.
    allEdges.forEach(edge => {
      edge.blocked = this.isEdgeBlocked(edge.id);
    });
  }

  onChange(callback: () => void): void {
    this.changeListeners.push(callback);
  }

  private notifyListeners(): void {
    this.changeListeners.forEach(cb => cb());
  }
}
