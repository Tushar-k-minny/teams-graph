"use client";

import { Minimize2, Minus, Plus } from "lucide-react";
import type {
  GraphData,
  GraphEdge,
  GraphNode,
  LayoutName,
  PersonNode,
  SkillNode,
} from "@/types/graph";
import cytoscape, { type Core, type EventObject } from "cytoscape";
import { useCallback, useEffect, useRef, useState } from "react";
import { toElements } from "./graph-canvas/GraphElements";
import { getLayoutConfig } from "./graph-canvas/GraphLayoutConfig";
import { cyStyles, EDGE_COLORS } from "./graph-canvas/GraphStyles";
import { GraphTooltip, type TooltipState } from "./graph-canvas/GraphTooltip";
import { ZoomAndLayoutControls } from "./graph-canvas/ZoomAndLayoutControls";

// ─── Props ────────────────────────────────────────────────────────────────────

interface GraphCanvasProps {
  data: GraphData;
  onSelectNode: (node: GraphNode | null) => void;
  onSelectEdge: (edge: GraphEdge | null) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GraphCanvas({
  data,
  onSelectNode,
  onSelectEdge,
}: GraphCanvasProps) {
  const [layoutName, setLayoutName] = useState<LayoutName>("breadthfirst");
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const minimapCanvasRef = useRef<HTMLCanvasElement>(null);
  const minimapContainerRef = useRef<HTMLDivElement>(null);
  const [minimapOpen, setMinimapOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);

  // ── Tooltip State ───────────────────────────────────────────────────────────
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    title: "",
    subtitle: "",
    bgImage: "",
    relations: [],
  });

  // ── Minimap constants ───────────────────────────────────────────────────────
  const MINIMAP_W = 200;
  const MINIMAP_H = 140;
  const MINIMAP_PAD = 12;

  // ── Minimap draw ────────────────────────────────────────────────────────────
  const drawMinimap = useCallback(() => {
    const cy = cyRef.current;
    const canvas = minimapCanvasRef.current;
    if (!cy || !canvas || !minimapOpen) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = MINIMAP_W * dpr;
    canvas.height = MINIMAP_H * dpr;
    ctx.scale(dpr, dpr);

    // Clear
    ctx.clearRect(0, 0, MINIMAP_W, MINIMAP_H);

    // Background
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.fillRect(0, 0, MINIMAP_W, MINIMAP_H);

    const bb = cy.elements().boundingBox();
    if (bb.w === 0 || bb.h === 0) return;

    // Map from graph coords to minimap coords
    const scaleX = (MINIMAP_W - MINIMAP_PAD * 2) / bb.w;
    const scaleY = (MINIMAP_H - MINIMAP_PAD * 2) / bb.h;
    const scale = Math.min(scaleX, scaleY);

    const offsetX =
      MINIMAP_PAD + (MINIMAP_W - MINIMAP_PAD * 2 - bb.w * scale) / 2;
    const offsetY =
      MINIMAP_PAD + (MINIMAP_H - MINIMAP_PAD * 2 - bb.h * scale) / 2;

    const toMiniX = (x: number) => (x - bb.x1) * scale + offsetX;
    const toMiniY = (y: number) => (y - bb.y1) * scale + offsetY;

    // Draw edges
    cy.edges().forEach((edge) => {
      const src = edge.source().position();
      const tgt = edge.target().position();
      const level = edge.data("level") as string;
      ctx.strokeStyle = EDGE_COLORS[level] ?? "#475569";
      ctx.globalAlpha = edge.hasClass("dimmed") ? 0.08 : 0.4;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(toMiniX(src.x), toMiniY(src.y));
      ctx.lineTo(toMiniX(tgt.x), toMiniY(tgt.y));
      ctx.stroke();
    });

    // Draw nodes
    cy.nodes().forEach((node) => {
      const pos = node.position();
      const mx = toMiniX(pos.x);
      const my = toMiniY(pos.y);
      const nodeType = node.data("nodeType");
      const isDimmed = node.hasClass("dimmed");
      const isHighlighted = node.hasClass("highlighted");

      ctx.globalAlpha = isDimmed ? 0.15 : 1;

      if (nodeType === "person") {
        ctx.fillStyle = isHighlighted ? "#60a5fa" : "#3b82f6";
        ctx.beginPath();
        ctx.arc(mx, my, 4, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = isHighlighted ? "#fb923c" : "#f97316";
        ctx.fillRect(mx - 4, my - 3, 8, 6);
      }

      if (isHighlighted) {
        ctx.strokeStyle = "#facc15";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 1;
        if (nodeType === "person") {
          ctx.beginPath();
          ctx.arc(mx, my, 5.5, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.strokeRect(mx - 5.5, my - 4.5, 11, 9);
        }
      }
    });

    // Draw viewport rectangle
    ctx.globalAlpha = 1;
    const ext = cy.extent();
    const vx1 = toMiniX(ext.x1);
    const vy1 = toMiniY(ext.y1);
    const vx2 = toMiniX(ext.x2);
    const vy2 = toMiniY(ext.y2);
    const vw = vx2 - vx1;
    const vh = vy2 - vy1;

    // Clamp to minimap bounds
    const clampedX = Math.max(0, vx1);
    const clampedY = Math.max(0, vy1);
    const clampedW = Math.min(MINIMAP_W - clampedX, vw);
    const clampedH = Math.min(MINIMAP_H - clampedY, vh);

    // Viewport fill
    ctx.fillStyle = "rgba(59, 130, 246, 0.08)";
    ctx.fillRect(clampedX, clampedY, clampedW, clampedH);

    // Viewport border
    ctx.strokeStyle = "rgba(96, 165, 250, 0.6)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(clampedX, clampedY, clampedW, clampedH);
    ctx.setLineDash([]);
  }, [minimapOpen]);

  // ── Handle click on minimap to pan main graph ───────────────────────────────
  const handleMinimapClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const cy = cyRef.current;
      const canvas = minimapCanvasRef.current;
      if (!cy || !canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const bb = cy.elements().boundingBox();
      if (bb.w === 0 || bb.h === 0) return;

      const scaleX = (MINIMAP_W - MINIMAP_PAD * 2) / bb.w;
      const scaleY = (MINIMAP_H - MINIMAP_PAD * 2) / bb.h;
      const scale = Math.min(scaleX, scaleY);

      const offsetX =
        MINIMAP_PAD + (MINIMAP_W - MINIMAP_PAD * 2 - bb.w * scale) / 2;
      const offsetY =
        MINIMAP_PAD + (MINIMAP_H - MINIMAP_PAD * 2 - bb.h * scale) / 2;

      // Convert minimap coords back to graph coords
      const graphX = (clickX - offsetX) / scale + bb.x1;
      const graphY = (clickY - offsetY) / scale + bb.y1;

      // Pan the main graph to center on the clicked position
      const zoom = cy.zoom();
      const pan = cy.pan();
      const containerWidth = cy.width();
      const containerHeight = cy.height();

      // Target: center the viewport on (graphX, graphY)
      const targetPanX = containerWidth / 2 - graphX * zoom;
      const targetPanY = containerHeight / 2 - graphY * zoom;

      cy.animate({
        pan: { x: targetPanX, y: targetPanY },
        duration: 250,
        easing: "ease-out",
      });
    },
    [],
  );

  const handleZoomIn = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({
      zoom: {
        level: cy.zoom() * 1.25,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      },
      duration: 150,
      easing: "ease-out" as any,
    });
  }, []);

  const handleZoomOut = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate({
      zoom: {
        level: cy.zoom() / 1.25,
        renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
      },
      duration: 150,
      easing: "ease-out" as any,
    });
  }, []);

  // ── Initialise Cytoscape ────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const cy = cytoscape({
      container: containerRef.current,
      elements: toElements(data),
      style: cyStyles,
      layout: getLayoutConfig(layoutName),
      minZoom: 0.3,
      maxZoom: 3,
      wheelSensitivity: 0.3,
    });

    cyRef.current = cy;

    // ── Event handlers ──────────────────────────────────────────────────────

    const handleNodeTap = (e: EventObject) => {
      const tapped = e.target;
      const nodeData = tapped.data();

      // Build highlight set
      cy.elements().removeClass("highlighted highlighted-edge dimmed");
      cy.elements().addClass("dimmed");

      tapped.removeClass("dimmed").addClass("highlighted");
      tapped.connectedEdges().forEach((edge: cytoscape.EdgeSingular) => {
        edge.removeClass("dimmed").addClass("highlighted-edge");
        edge.connectedNodes().forEach((node: cytoscape.NodeSingular) => {
          node.removeClass("dimmed").addClass("highlighted");
        });
      });

      // Notify parent
      const raw: GraphNode =
        nodeData.nodeType === "person"
          ? {
              id: nodeData.id,
              name: nodeData.label.split("\n")[0],
              role: nodeData.sublabel,
              type: "person",
            }
          : {
              id: nodeData.id,
              name: nodeData.label,
              category: nodeData.sublabel,
              type: "skill",
            };
      onSelectNode(raw);
      onSelectEdge(null);

      // Redraw minimap to reflect highlight
      requestAnimationFrame(() => drawMinimap());
    };

    const handleEdgeTap = (e: EventObject) => {
      const tapped = e.target;
      const edgeData = tapped.data();

      cy.elements().removeClass("highlighted highlighted-edge dimmed");
      cy.elements().addClass("dimmed");

      tapped.removeClass("dimmed").addClass("highlighted-edge");
      tapped.connectedNodes().forEach((node: cytoscape.NodeSingular) => {
        node.removeClass("dimmed").addClass("highlighted");
      });

      onSelectEdge({
        id: edgeData.id,
        source: edgeData.source,
        target: edgeData.target,
        level: edgeData.level,
      });
      onSelectNode(null);

      requestAnimationFrame(() => drawMinimap());
    };

    const handleBgTap = (e: EventObject) => {
      if (e.target === cy) {
        cy.elements().removeClass("highlighted highlighted-edge dimmed");
        onSelectNode(null);
        onSelectEdge(null);
        requestAnimationFrame(() => drawMinimap());
      }
    };

    cy.on("tap", "node", handleNodeTap);
    cy.on("tap", "edge", handleEdgeTap);
    cy.on("tap", handleBgTap);

    // Tooltip logic
    cy.on("mouseover", "node", (e: EventObject) => {
      const node = e.target;
      const pos = e.renderedPosition;
      const isPerson = node.data("nodeType") === "person";

      const relations = node
        .connectedEdges()
        .map((edge: cytoscape.EdgeSingular) => {
          const otherNode = isPerson ? edge.target() : edge.source();
          return {
            name: otherNode.data("label").split("\n")[0],
            level: edge.data("level") as string,
          };
        });

      setTooltip({
        visible: true,
        x: pos.x,
        y: pos.y,
        title: node.data("label").split("\n")[0],
        subtitle: node.data("sublabel"),
        bgImage: node.data("bgImage"),
        relations,
      });
    });

    cy.on("mouseout", "node", () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    });

    // ── Cursor State Management ───────────────────────────────────────────────
    const containerEl = containerRef.current;
    if (containerEl) {
      containerEl.classList.add("!cursor-grab");

      cy.on("mouseover", "node, edge", () => {
        containerEl.classList.remove("!cursor-grab");
        containerEl.classList.add("!cursor-pointer");
      });

      cy.on("mouseout", "node, edge", () => {
        containerEl.classList.remove("!cursor-pointer");
        containerEl.classList.add("!cursor-grab");
      });

      cy.on("grab", "node", () => {
        containerEl.classList.remove("!cursor-pointer");
        containerEl.classList.add("!cursor-grabbing");
      });

      cy.on("free", "node", () => {
        containerEl.classList.remove("!cursor-grabbing");
        containerEl.classList.add("!cursor-pointer"); // still hovering after free
      });

      cy.on("tapstart", (e: EventObject) => {
        if (e.target === cy) {
          containerEl.classList.remove("!cursor-grab");
          containerEl.classList.add("!cursor-grabbing");
        }
      });

      cy.on("tapend", (e: EventObject) => {
        if (e.target === cy) {
          containerEl.classList.remove("!cursor-grabbing");
          containerEl.classList.add("!cursor-grab");
        }
      });
    }

    // Minimap redraw on viewport changes
    cy.on("viewport", () => {
      requestAnimationFrame(() => drawMinimap());
      setTooltip((prev) => ({ ...prev, visible: false }));
    });
    cy.on("layoutstop", () => {
      requestAnimationFrame(() => drawMinimap());
      requestAnimationFrame(() => setZoomLevel(Math.round(cy.zoom() * 100)));
    });
    cy.on("position", "node", () => requestAnimationFrame(() => drawMinimap()));
    cy.on("zoom", () => {
      requestAnimationFrame(() => setZoomLevel(Math.round(cy.zoom() * 100)));
      setTooltip((prev) => ({ ...prev, visible: false }));
    });
    cy.on("pan", () => {
      setTooltip((prev) => ({ ...prev, visible: false }));
    });

    // Initial draw after layout settles
    setTimeout(() => {
      drawMinimap();
      setZoomLevel(Math.round(cy.zoom() * 100));
    }, 800);

    return () => {
      cy.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // cy initialization effect should run only once

  // ── Redraw minimap when toggled open ────────────────────────────────────────
  useEffect(() => {
    if (minimapOpen) {
      requestAnimationFrame(() => drawMinimap());
    }
  }, [minimapOpen, drawMinimap]);

  // ── Sync data changes into Cytoscape ────────────────────────────────────────
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;

    const newElements = toElements(data);
    const currentNodeIds = new Set(cy.nodes().map((n) => n.id()));
    const currentEdgeIds = new Set(cy.edges().map((e) => e.id()));
    const newNodeIds = new Set(
      newElements
        .filter((el) => !("source" in el.data))
        .map((el) => el.data.id!),
    );
    const newEdgeIds = new Set(
      newElements.filter((el) => "source" in el.data).map((el) => el.data.id!),
    );

    // Remove deleted
    cy.nodes().forEach((n) => {
      if (!newNodeIds.has(n.id())) cy.remove(n);
    });
    cy.edges().forEach((e) => {
      if (!newEdgeIds.has(e.id())) cy.remove(e);
    });

    // Add new
    for (const el of newElements) {
      const id = el.data.id!;
      if ("source" in el.data) {
        if (!currentEdgeIds.has(id)) cy.add(el);
      } else {
        if (!currentNodeIds.has(id)) cy.add(el);
        else {
          // Update existing node data
          cy.getElementById(id).data(el.data);
        }
      }
    }

    // Re-run layout
    cy.layout(getLayoutConfig(layoutName)).run();
  }, [data, layoutName, getLayoutConfig]);

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Main graph */}
      <div
        ref={containerRef}
        id="graph-canvas"
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, #1e293b 0%, #0f172a 100%)",
        }}
      />

      {/* Minimap / Track Area */}
      <div
        ref={minimapContainerRef}
        id="minimap"
        className="absolute z-20 transition-all duration-300 ease-out"
        style={{
          right: 20,
          top: 20,
          width: minimapOpen ? MINIMAP_W : 36,
          height: minimapOpen ? MINIMAP_H + 28 : 36,
        }}
      >
        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setMinimapOpen((v) => !v)}
          className="absolute top-0 right-0 z-10 flex items-center gap-1.5 px-2 py-1 rounded-t-lg text-[10px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-900/80 backdrop-blur-xl border border-b-0 border-slate-700/50 hover:text-slate-200 transition-colors cursor-pointer"
          title={minimapOpen ? "Collapse minimap" : "Expand minimap"}
        >
          <Minimize2
            className="w-3 h-3 transition-transform"
            style={{
              transform: minimapOpen ? "rotate(0deg)" : "rotate(180deg)",
            }}
          />
          {minimapOpen && "Map"}
        </button>

        {/* Canvas container */}
        {minimapOpen && (
          <div
            className="mt-[24px] rounded-lg overflow-hidden border border-slate-700/50 shadow-2xl"
            style={{ width: MINIMAP_W, height: MINIMAP_H }}
          >
            <canvas
              ref={minimapCanvasRef}
              width={MINIMAP_W}
              height={MINIMAP_H}
              onClick={handleMinimapClick}
              className="block cursor-crosshair"
              style={{ width: MINIMAP_W, height: MINIMAP_H }}
            />
          </div>
        )}
      </div>

      <GraphTooltip tooltip={tooltip} />

      <ZoomAndLayoutControls
        zoomLevel={zoomLevel}
        layoutName={layoutName}
        onLayoutChange={setLayoutName}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
      />
    </div>
  );
}
