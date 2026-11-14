export interface NetworkNode {
  id: number;
  name: string;
  slug: string;
}

export interface NetworkEdge {
  id: number;
  source: string;
  destination: string;
  latency: number | string;
}

export interface ShortestRouteResponse {
  data: {
    path: NetworkNode[];
    total_latency: number;
  };
}