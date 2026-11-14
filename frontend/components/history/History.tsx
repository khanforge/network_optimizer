
"use client";

import { RouteHistoryItem } from "@/services/history/type";

interface HistoryTableProps {
  history: RouteHistoryItem[];
  loading: boolean;
}

export default function HistoryTable({
  history,
  loading,
}: HistoryTableProps) {
  if (loading) {
    return (
      <div className="rounded-xl border bg-gray-900 p-8 text-center text-gray-400">
        Loading route history...
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="rounded-xl border bg-gray-900 p-10 text-center">
        <h3 className="font-semibold text-gray-200">
          No route history found
        </h3>
        <p className="mt-2 text-sm text-gray-400">
          Try changing your filters or calculate a new route.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-gray-900">
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
              <tr
                key={item.id}
                className="transition hover:bg-gray-950"
              >
                <td className="whitespace-nowrap px-5 py-4">
                  <div className="font-medium text-gray-100">
                    {item.path[0]?.name ?? item.source}
                  </div>
                  <div className="mt-1 text-gray-400">
                    to {item.path[item.path.length - 1]?.name ?? item.destination}
                  </div>
                </td>

                <td className="px-5 py-4">
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

      <div className="border-t px-5 py-3 text-xs text-gray-400">
        Showing {history.length} route records
      </div>
    </div>
  );
}
