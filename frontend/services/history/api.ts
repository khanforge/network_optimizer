import { RouteHistoryFilters, RouteHistoryItem } from "./type";
import axios from "axios";

const api = axios.create({
   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

export async function getRouteHistory(
  filters: RouteHistoryFilters = {}
): Promise<RouteHistoryItem[]> {
  const response = await api.get("/network/routes/history/", {
    params: filters,
  });

  return response.data.data;
}
