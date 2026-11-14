import axios from "axios";
import { NetworkEdge, NetworkNode, ShortestRouteResponse } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export async function getNodes(): Promise<NetworkNode[]> {
  const response = await api.get("network/nodes/");
  return response.data;
}

export async function getEdges(): Promise<NetworkEdge[]> {
  const response = await api.get("network/edges/");
  return response.data;
}

export async function createNode(name: string) {
  const response = await api.post("network/nodes/", { name });
  return response.data;
}

export async function createEdge(
  source: string,
  destination: string,
  latency: number
) {
  const response = await api.post("network/edges/", {
    source,
    destination,
    latency,
  });

  return response.data;
}

export async function findShortestRoute(
  source: string,
  destination: string
): Promise<ShortestRouteResponse> {
  const response = await api.post("network/routes/shortest/", {
    source,
    destination,
  });

  return response.data;
}