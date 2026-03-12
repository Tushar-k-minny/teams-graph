import type cytoscape from "cytoscape";

export const EDGE_COLORS: Record<string, string> = {
  learning: "#f5a623", // amber / yellow
  familiar: "#3b82f6", // blue
  expert: "#22c55e", // green
};

export const cyStyles: cytoscape.StylesheetStyle[] = [
  // ── Person nodes ────────────────────────────────────────────────────────────
  {
    selector: 'node[nodeType="person"]',
    style: {
      shape: "ellipse",
      width: 40,
      height: 40,
      "background-color": "transparent",
      "background-opacity": 0,
      "border-width": 0,
      "background-image": "data(bgImage)",
      "background-fit": "contain",
      label: "data(label)",
      "text-wrap": "wrap",
      "text-max-width": "110px",
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 8,
      "font-size": "13px",
      "font-weight": "bold" as unknown as number,
      color: "#e2e8f0",
      "text-outline-color": "#0f172a",
      "text-outline-width": 2,
      "overlay-padding": "6px",
      "z-index": 10,
    } as cytoscape.Css.Node,
  },
  // ── Skill nodes ─────────────────────────────────────────────────────────────
  {
    selector: 'node[nodeType="skill"]',
    style: {
      shape: "round-rectangle",
      width: 30,
      height: 30,
      "background-color": "transparent",
      "background-opacity": 0,
      "border-width": 0,
      "background-image": "data(bgImage)",
      "background-fit": "contain",
      label: "data(label)",
      "text-wrap": "wrap",
      "text-max-width": "100px",
      "text-valign": "bottom",
      "text-halign": "center",
      "text-margin-y": 8,
      "font-size": "13px",
      "font-weight": "bold" as unknown as number,
      color: "#e2e8f0",
      "text-outline-color": "#0f172a",
      "text-outline-width": 2,
      "overlay-padding": "6px",
      "z-index": 10,
    } as cytoscape.Css.Node,
  },
  // ── Edges ───────────────────────────────────────────────────────────────────
  {
    selector: "edge",
    style: {
      width: 3,
      "line-color": "mapData(level, 0, 2, #f5a623, #22c55e)",
      "target-arrow-color": "mapData(level, 0, 2, #f5a623, #22c55e)",
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      opacity: 0.8,
    } as cytoscape.Css.Edge,
  },
  // Edge colour overrides per level
  {
    selector: 'edge[level="learning"]',
    style: {
      "line-color": "#f5a623",
      "target-arrow-color": "#f5a623",
      width: 2,
      "line-style": "dashed",
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge[level="familiar"]',
    style: {
      "line-color": "#3b82f6",
      "target-arrow-color": "#3b82f6",
      width: 3,
    } as cytoscape.Css.Edge,
  },
  {
    selector: 'edge[level="expert"]',
    style: {
      "line-color": "#22c55e",
      "target-arrow-color": "#22c55e",
      width: 4,
    } as cytoscape.Css.Edge,
  },
  // ── Highlight & dim ─────────────────────────────────────────────────────────
  {
    selector: ".highlighted",
    style: {
      "border-width": 3,
      "border-color": "#facc15",
      "border-style": "dashed",
      "border-opacity": 0.6,
      "z-index": 20,
    } as cytoscape.Css.Node,
  },
  {
    selector: ".highlighted-edge",
    style: {
      width: 5,
      opacity: 1,
      "z-index": 20,
    } as cytoscape.Css.Edge,
  },
  {
    selector: ".dimmed",
    style: {
      opacity: 0.15,
    } as cytoscape.Css.Node,
  },
];
