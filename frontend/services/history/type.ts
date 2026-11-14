export interface RouteHistoryNode {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  modified_at: string;
}

export interface RouteHistoryItem {
  id: number;
  source: string;
  destination: string;
  created_at: string;
  modified_at: string;
  total_latency: string;
  path: RouteHistoryNode[];
}

export interface RouteHistoryResponse {
  data: RouteHistoryItem[];
}

export interface RouteHistoryFilters {
  source?: string;
  destination?: string;
  limit?: number;
  date_from?: string;
  date_to?: string;
}