
"use client";

import { useState } from "react";
import {
  createEdge,
  type NetworkNode,
} from "@/services/network/api";

interface Props {
  nodes: NetworkNode[];
  onCreated: () => void;
}

export default function CreateEdgeForm({
  nodes,
  onCreated,
}: Props) {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [latency, setLatency] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createEdge(
        source,
        destination,
        Number(latency)
      );

      setSource("");
      setDestination("");
      setLatency("");

      onCreated();
    } catch (err: any) {
      setError(
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.error ||
        "Unable to create connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">Add Edge</h2>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Source server
        </label>

        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">Select source</option>

          {nodes.map((node) => (
            <option key={node.id} value={node.slug}>
              {node.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Destination server
        </label>

        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          required
          className="w-full rounded-lg border px-3 py-2"
        >
          <option value="">Select destination</option>

          {nodes.map((node) => (
            <option key={node.id} value={node.slug}>
              {node.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Latency (ms)
        </label>

        <input
          type="number"
          min="0.1"
          step="0.1"
          value={latency}
          onChange={(e) => setLatency(e.target.value)}
          placeholder="e.g. 5.5"
          required
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={
          loading ||
          !source ||
          !destination ||
          !latency ||
          Number(latency) <= 0
        }
        className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add Connection"}
      </button>
    </form>
  );
}
