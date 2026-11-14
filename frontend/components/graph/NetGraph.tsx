
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
   MarkerType,
   applyEdgeChanges,
   applyNodeChanges,
  type Node,
  type Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import {
  getNodes,
  getEdges,
  type NetworkNode,
  type NetworkEdge,
} from "@/services/network/api";

import { getLayoutedElements } from "./layout";

interface NetworkGraphProps {
  refreshKey: number;
  highlightedPath: NetworkNode[];
}

export default function NetworkGraph({
  refreshKey,
  highlightedPath,
}: NetworkGraphProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   
   const onNodesChange = useCallback(
      (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
      [],
   );
   const onEdgesChange = useCallback(
      (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
      [],
   );

  useEffect(() => {
    let cancelled = false;

    async function loadGraph() {
      try {
        setLoading(true);
        setError("");

        // Fetch nodes and edges from Django API
        const [networkNodes, networkEdges] = await Promise.all([
          getNodes(),
          getEdges(),
        ]);

        if (cancelled) return;

        // Map node slugs to React Flow node IDs
        const slugToId = new Map<string, string>();

        networkNodes.forEach((node) => {
          slugToId.set(node.slug, String(node.id));
        });

        // Convert Django nodes into React Flow nodes
        const formattedNodes: Node[] = networkNodes.map((node) => ({
          id: String(node.id),
          data: {
            label: node.name,
          },
          position: {
            x: 0,
            y: 0,
          },
          style: {
            width: 150,
            padding: "12px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            background: "#ffffff",
            color: "#1e293b",
            fontWeight: 600,
            textAlign: "center",
          },
        }));

        // Convert Django edges into React Flow edges
        const formattedEdges: Edge[] = networkEdges
          .map((edge) => {
            const sourceId = slugToId.get(edge.source);
            const destinationId = slugToId.get(edge.destination);

            // Skip edges whose nodes are not present
            if (!sourceId || !destinationId) {
              return null;
            }

            return {
              id: String(edge.id),
              source: sourceId,
              target: destinationId,
              label: `${edge.latency} ms`,
              markerEnd: {
                type: MarkerType.ArrowClosed,
              },
              style: {
                stroke: "#94a3b8",
                strokeWidth: 2,
              },
              labelStyle: {
                fill: "#475569",
                fontSize: 12,
              },
            };
          })
          .filter((edge): edge is Edge => edge !== null);

        // Collect IDs of nodes in the selected shortest path
        const highlightedNodeIds = new Set(
          highlightedPath.map((node) => String(node.id))
        );

        // Collect consecutive source-destination pairs
        const highlightedConnections = new Set<string>();

        for (let i = 0; i < highlightedPath.length - 1; i++) {
          const sourceId = String(highlightedPath[i].id);
          const destinationId = String(highlightedPath[i + 1].id);

          highlightedConnections.add(`${sourceId}->${destinationId}`);
        }

        // Highlight shortest-path nodes
        const highlightedNodes = formattedNodes.map((node) => {
          const isHighlighted = highlightedNodeIds.has(node.id);

          return {
            ...node,
            style: {
              ...node.style,
              background: isHighlighted ? "#dcfce7" : "#ffffff",
              border: isHighlighted
                ? "2px solid #16a34a"
                : "1px solid #cbd5e1",
              color: "#1e293b",
            },
          };
        });

        // Highlight shortest-path edges
        const highlightedEdges = formattedEdges.map((edge) => {
          const isHighlighted = highlightedConnections.has(
            `${edge.source}->${edge.target}`
          );

          return {
            ...edge,
            animated: isHighlighted,
            style: {
              ...edge.style,
              stroke: isHighlighted ? "#16a34a" : "#94a3b8",
              strokeWidth: isHighlighted ? 4 : 2,
            },
          };
        });

        // Apply automatic graph layout
        const layouted = getLayoutedElements(
          highlightedNodes,
          highlightedEdges
        );

        if (cancelled) return;

        setNodes(layouted.nodes);
        setEdges(layouted.edges);
      } catch (err) {
        console.error("Failed to load network graph:", err);

        if (!cancelled) {
          setError("Unable to load network graph. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGraph();

    return () => {
      cancelled = true;
    };
  }, [refreshKey, highlightedPath]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        Loading network graph...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-500">
        No network nodes available. Create some nodes to get started.
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
           edges={edges}
           onNodesChange={onNodesChange}
         onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable
      >
        <Background />
        <Controls />
        {/* <MiniMap /> */}
      </ReactFlow>
    </div>
  );
}
