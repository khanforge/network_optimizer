"use client";

import { useEffect, useState } from "react";
import { type NetworkNode } from "@/services/network/types";

import NetworkGraph from "@/components/graph/NetGraph";
import ShortestRouteForm from "@/components/graph/ShortestRouteForm";
import AddServerForm from "@/components/graph/AddServerForm";
import CreateEdgeForm from "@/components/graph/CreateEdgeForm";
import { getNodes } from "@/services/network/api";

interface RouteResult {
  path: NetworkNode[];
  total_latency: number;
}

export default function DashboardPage() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedRoute, setSelectedRoute] = useState<RouteResult | null>(null);

  async function refreshDashboard() {
    const data = await getNodes();
    setNodes(data);
    setRefreshKey((previous) => previous + 1);
    setSelectedRoute(null);
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Network Monitor</h1>

      <div className="h-[600px] overflow-hidden rounded-xl border">
        <NetworkGraph
          refreshKey={refreshKey}
          highlightedPath={selectedRoute?.path ?? []}
        />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <AddServerForm
          onCreated={refreshDashboard}
        />

        <CreateEdgeForm
          nodes={nodes}
          onCreated={refreshDashboard}
        />

        <ShortestRouteForm
          nodes={nodes}
          onRouteFound={setSelectedRoute}
        />
      </div>

      {selectedRoute && (
        <div className="rounded-xl border bg-white text-green-700 p-4">
          <h2 className="font-semibold">Shortest Route Found</h2>

          <p className="mt-2 text-sm">
            {selectedRoute.path.map((node) => node.name).join(" → ")}
          </p>

          <p className="mt-2 font-semibold text-green-700">
            Total latency: {selectedRoute.total_latency} ms
          </p>
        </div>
      )}
    </main>
  );
}