"use client";

import { useState } from "react";
import {
  findShortestRoute,
  type NetworkNode,
} from "@/services/network/api";

interface ShortestRouteFormProps {
  nodes: NetworkNode[];
  onRouteFound: (result: {
    path: NetworkNode[];
    total_latency: number;
  }) => void;
}

export default function ShortestRouteForm({
  nodes,
  onRouteFound,
}: ShortestRouteFormProps) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!source || !destination) {
      setError("Please select both source and destination.");
      return;
    }

    try {
      setLoading(true);

      const response = await findShortestRoute(source, destination);

      onRouteFound(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to find the shortest route."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Find Shortest Route</h2>

      <div>
        <label className="mb-1 block text-sm">Source</label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full rounded-lg border p-2"
        >
          <option value="">Select source</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.name}>
              {node.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm">Destination</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full rounded-lg border p-2"
        >
          <option value="">Select destination</option>
          {nodes.map((node) => (
            <option key={node.id} value={node.name}>
              {node.name}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Finding route..." : "Find Shortest Route"}
      </button>
    </form>
  );
}