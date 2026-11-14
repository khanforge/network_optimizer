
"use client";

import { getRouteHistory } from "@/services/history/api";
import { RouteHistoryFilters, RouteHistoryItem } from "@/services/history/type";
import { getNodes } from "@/services/network/api";
import { NetworkNode } from "@/services/network/types";
import { useEffect, useState, type FormEvent } from "react";


export default function HistoryPage() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [history, setHistory] = useState<RouteHistoryItem[]>([]);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory(filters: RouteHistoryFilters = { limit: 50 }) {
    try {
      setLoading(true);
      setError("");

      const data = await getRouteHistory(filters);
      setHistory(data);
    } catch (err: unknown) {
      console.error("Failed to load route history:", err);
      setError("Unable to load route history. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Load nodes and route history when the page opens.
  useEffect(() => {
    async function initializePage() {
      try {
        const [nodeData, historyData] = await Promise.all([
          getNodes(),
          getRouteHistory({ limit: 50 }),
        ]);

        setNodes(nodeData);
        setHistory(historyData);
      } catch (err) {
        console.error("Failed to initialize history page:", err);
        setError("Unable to load page data. Please refresh and try again.");
      } finally {
        setLoading(false);
      }
    }

    initializePage();
  }, []);

  async function handleFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const filters: RouteHistoryFilters = {
      limit: 50,
    };

    if (source) filters.source = source;
    if (destination) filters.destination = destination;
    if (dateFrom) filters.date_from = dateFrom;
    if (dateTo) filters.date_to = dateTo;

    await loadHistory(filters);
  }

  async function handleReset() {
    setSource("");
    setDestination("");
    setDateFrom("");
    setDateTo("");

    await loadHistory({ limit: 50 });
  }

  const averageLatency =
    history.length > 0
      ? history.reduce(
          (total, item) => total + Number(item.total_latency),
          0
        ) / history.length
      : 0;

  const latestCalculation = history.reduce<string | null>(
    (latest, item) => {
      if (!latest) return item.created_at;

      return new Date(item.created_at) > new Date(latest)
        ? item.created_at
        : latest;
    },
    null
  );

  return (
    <main className="min-h-screen space-y-6 bg-gray-950 p-6">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-100">
          Route History
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          View and filter previously calculated network routes.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Records Returned</p>
          <p className="mt-2 text-2xl font-bold text-gray-100">
            {history.length}
          </p>
        </div>

        <div className="rounded-xl border bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Average Latency</p>
          <p className="mt-2 text-2xl font-bold text-gray-100">
            {history.length ? averageLatency.toFixed(3) : "—"}
            <span className="ml-1 text-sm font-normal text-gray-400">
              ms
            </span>
          </p>
        </div>

        <div className="rounded-xl border bg-gray-900 p-5">
          <p className="text-sm text-gray-400">Latest Calculation</p>
          <p className="mt-2 text-base font-semibold text-gray-100">
            {latestCalculation
              ? new Date(latestCalculation).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>

      {/* Filters */}
      <section className="rounded-xl border bg-gray-900 p-5">
        <h2 className="mb-4 font-semibold text-gray-100">
          Filter Routes
        </h2>

        <form onSubmit={handleFilter}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All sources</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.slug}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All destinations</option>
                {nodes.map((node) => (
                  <option key={node.id} value={node.slug}>
                    {node.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full rounded-lg border border-gray-700 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                min={dateFrom || undefined}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full rounded-lg border border-gray-700 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Apply Filters
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="rounded-lg border border-gray-700 px-5 py-2 text-sm font-medium text-gray-300 hover:bg-gray-950 disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* History table */}
      <section className="overflow-hidden rounded-xl border bg-gray-900">
        <div className="border-b px-5 py-4">
          <h2 className="font-semibold text-gray-100">
            Previous Route Calculations
          </h2>
          <p className="mt-1 text-sm text-gray-400">
            Showing up to 50 records.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">
            Loading route history...
          </div>
        ) : history.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-medium text-gray-800">
              No route history found
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Try changing your filters or calculate a new route.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-950 text-gray-400">
                <tr>
                  <th className="px-5 py-4 font-medium">Route</th>
                  <th className="px-5 py-4 font-medium">Path</th>
                  <th className="px-5 py-4 font-medium">Total Latency</th>
                  <th className="px-5 py-4 font-medium">Calculated At</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-950">
                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium text-gray-100">
                        {item.path[0]?.name ?? item.source}
                      </p>
                      <p className="mt-1 text-gray-400">
                        to{" "}
                        {item.path[item.path.length - 1]?.name ??
                          item.destination}
                      </p>
                    </td>

                    <td className="min-w-[250px] px-5 py-4">
                      <div className="flex flex-wrap items-center gap-1">
                        {item.path.map((node, index) => (
                          <span
                            key={`${item.id}-${node.id}`}
                            className="inline-flex items-center gap-1"
                          >
                            <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                              {node.name}
                            </span>

                            {index < item.path.length - 1 && (
                              <span className="text-gray-400">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-full bg-green-50 px-3 py-1 font-semibold text-green-700">
                        {Number(item.total_latency).toFixed(3)} ms
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                      {new Date(item.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="border-t px-5 py-3 text-xs text-gray-400">
          Showing {history.length} records
        </div>
      </section>
    </main>
  );
}
