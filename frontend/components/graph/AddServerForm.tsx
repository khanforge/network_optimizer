
"use client";

import { useState } from "react";
import { createNode } from "@/services/network/api";

interface Props {
  onCreated: () => void;
}

export default function AddServerForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await createNode(name.trim());

      setName("");
      onCreated();
    } catch (err: any) {
      setError(
        err.response?.data?.name?.[0] ||
        err.response?.data?.detail ||
        "Unable to create server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-5">
      <h2 className="text-lg font-semibold">
        Server name
      </h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Server A"
        required
        maxLength={100}
        className="w-full rounded-lg border px-3 py-2"
      />

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add Server"}
      </button>
    </form>
  );
}
