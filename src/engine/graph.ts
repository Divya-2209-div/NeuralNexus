import type { Venue, VenueNode, VenueEdge } from '../types';

export class Graph {
  private nodes: Map<string, VenueNode>;
  private edges: Map<string, VenueEdge>;
  private adjacencyList: Map<string, string[]>; // node.id -> edge.id[]

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.adjacencyList = new Map();
  }

  static fromVenue(venue: Venue): Graph {
    const graph = new Graph();
    
    venue.nodes.forEach(node => graph.addNode(node));
    venue.edges.forEach(edge => graph.addEdge(edge));

    return graph;
  }

  addNode(node: VenueNode): void {
    this.nodes.set(node.id, node);
    if (!this.adjacencyList.has(node.id)) {
      this.adjacencyList.set(node.id, []);
    }
  }

  addEdge(edge: VenueEdge): void {
    this.edges.set(edge.id, edge);
    
    const fromList = this.adjacencyList.get(edge.from);
    if (fromList && !fromList.includes(edge.id)) {
      fromList.push(edge.id);
    }
    const toList = this.adjacencyList.get(edge.to);
    if (toList && !toList.includes(edge.id)) {
      toList.push(edge.id);
    }
  }

  getNode(id: string): VenueNode | undefined {
    return this.nodes.get(id);
  }

  getEdge(id: string): VenueEdge | undefined {
    return this.edges.get(id);
  }

  getNeighbors(nodeId: string): { node: VenueNode; edge: VenueEdge }[] {
    const edgeIds = this.adjacencyList.get(nodeId) || [];
    const neighbors: { node: VenueNode; edge: VenueEdge }[] = [];

    for (const edgeId of edgeIds) {
      const edge = this.edges.get(edgeId);
      if (!edge) continue;

      const neighborId = edge.from === nodeId ? edge.to : edge.from;
      const neighborNode = this.nodes.get(neighborId);

      if (neighborNode) {
        neighbors.push({ node: neighborNode, edge });
      }
    }

    return neighbors;
  }

  getEdgeBetween(nodeAId: string, nodeBId: string): VenueEdge | undefined {
    const edgeIds = this.adjacencyList.get(nodeAId) || [];
    for (const edgeId of edgeIds) {
      const edge = this.edges.get(edgeId);
      if (edge && ((edge.from === nodeAId && edge.to === nodeBId) || (edge.from === nodeBId && edge.to === nodeAId))) {
        return edge;
      }
    }
    return undefined;
  }

  setEdgeBlockedStatus(edgeId: string, blocked: boolean): void {
    const edge = this.edges.get(edgeId);
    if (edge) {
      edge.blocked = blocked;
    }
  }

  markEdgeBlocked(from: string, to: string, blocked: boolean): void {
    const edge = this.getEdgeBetween(from, to);
    if (edge) {
      edge.blocked = blocked;
    }
  }

  getNodes(): VenueNode[] {
    return Array.from(this.nodes.values());
  }

  getEdges(): VenueEdge[] {
    return Array.from(this.edges.values());
  }

  getAllNodes(): VenueNode[] {
    return this.getNodes();
  }

  getAllEdges(): VenueEdge[] {
    return this.getEdges();
  }
}

export function buildGraph(venue: Venue): Graph {
  return Graph.fromVenue(venue);
}

