// ─── Node Types ───────────────────────────────────────────────────────────────

export type LayoutName = "breadthfirst" | "cose" | "grid" | "circle" | "concentric";

export interface PersonNode {
  id: string;
  name: string;
  role: string;
  type: "person";
}

export interface SkillNode {
  id: string;
  name: string;
  category: string;
  type: "skill";
}

export type GraphNode = PersonNode | SkillNode;

// ─── Edge Type ────────────────────────────────────────────────────────────────

export type SkillLevel = "learning" | "familiar" | "expert";

export interface GraphEdge {
  id: string;
  source: string; // personId
  target: string; // skillId
  level: SkillLevel;
}

// ─── Graph Data ───────────────────────────────────────────────────────────────

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

// ─── Form Payloads ────────────────────────────────────────────────────────────

export interface PersonFormData {
  name: string;
  role: string;
}

export interface SkillFormData {
  name: string;
  category: string;
}

export interface ConnectionFormData {
  source: string;
  target: string;
  level: SkillLevel;
}
