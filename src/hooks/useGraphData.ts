"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  ConnectionFormData,
  GraphData,
  GraphEdge,
  GraphNode,
  PersonFormData,
  PersonNode,
  SkillFormData,
  SkillNode,
} from "@/types/graph";
import { buildGraphDataFromCsvs, fetchDefaultCsvs } from "@/lib/csvParser";

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "teams-graph-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage(): GraphData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as GraphData) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data: GraphData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let idCounter = Date.now();
function nextId(prefix: string): string {
  return `${prefix}-${++idCounter}`;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGraphData() {
  const [data, setData] = useState<GraphData>({ nodes: [], edges: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load on mount: try localStorage first, fallback to CSV files from /public
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored && stored.nodes.length > 0) {
      setData(stored);
      setIsLoaded(true);
    } else {
      // Fetch from CSV files in /public
      fetchDefaultCsvs()
        .then((csvData) => {
          if (csvData.nodes.length > 0) {
            setData(csvData);
            saveToStorage(csvData);
          }
        })
        .catch(() => {
          // Silently fail — graph will just be empty
        })
        .finally(() => {
          setIsLoaded(true);
        });
    }
  }, []);

  // Persist every change (skip the initial empty state)
  useEffect(() => {
    if (isLoaded) saveToStorage(data);
  }, [data, isLoaded]);

  // ─── People CRUD ────────────────────────────────────────────────────────────

  const people = data.nodes.filter((n): n is PersonNode => n.type === "person");
  const skills = data.nodes.filter((n): n is SkillNode => n.type === "skill");

  const addPerson = useCallback((form: PersonFormData) => {
    const node: PersonNode = {
      id: nextId("person"),
      name: form.name,
      role: form.role,
      type: "person",
    };
    setData((prev) => ({ ...prev, nodes: [...prev.nodes, node] }));
  }, []);

  const updatePerson = useCallback((id: string, form: PersonFormData) => {
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === id ? { ...n, name: form.name, role: form.role } : n
      ),
    }));
  }, []);

  const deletePerson = useCallback((id: string) => {
    setData((prev) => ({
      nodes: prev.nodes.filter((n) => n.id !== id),
      edges: prev.edges.filter((e) => e.source !== id && e.target !== id),
    }));
  }, []);

  // ─── Skills CRUD ────────────────────────────────────────────────────────────

  const addSkill = useCallback((form: SkillFormData) => {
    const node: SkillNode = {
      id: nextId("skill"),
      name: form.name,
      category: form.category,
      type: "skill",
    };
    setData((prev) => ({ ...prev, nodes: [...prev.nodes, node] }));
  }, []);

  const updateSkill = useCallback((id: string, form: SkillFormData) => {
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((n) =>
        n.id === id ? { ...n, name: form.name, category: form.category } : n
      ),
    }));
  }, []);

  const deleteSkill = useCallback((id: string) => {
    setData((prev) => ({
      nodes: prev.nodes.filter((n) => n.id !== id),
      edges: prev.edges.filter((e) => e.source !== id && e.target !== id),
    }));
  }, []);

  // ─── Connection CRUD ────────────────────────────────────────────────────────

  const addConnection = useCallback((form: ConnectionFormData) => {
    setData((prev) => {
      // Prevent duplicates
      const exists = prev.edges.some(
        (e) => e.source === form.source && e.target === form.target
      );
      if (exists) return prev;
      const edge: GraphEdge = {
        id: nextId("edge"),
        source: form.source,
        target: form.target,
        level: form.level,
      };
      return { ...prev, edges: [...prev.edges, edge] };
    });
  }, []);

  const deleteConnection = useCallback((edgeId: string) => {
    setData((prev) => ({
      ...prev,
      edges: prev.edges.filter((e) => e.id !== edgeId),
    }));
  }, []);

  // ─── CSV Import ─────────────────────────────────────────────────────────────

  /** Import graph data from three CSV strings (replaces all existing data) */
  const importCsvData = useCallback(
    (peopleCsv: string, skillsCsv: string, connectionsCsv: string) => {
      const imported = buildGraphDataFromCsvs(
        peopleCsv,
        skillsCsv,
        connectionsCsv
      );
      setData(imported);
      saveToStorage(imported);
      return imported;
    },
    []
  );

  // ─── Analytics ──────────────────────────────────────────────────────────────

  /** Skills sorted by number of connections (descending) */
  const topSkills = skills
    .map((skill) => ({
      skill,
      count: data.edges.filter((e) => e.target === skill.id).length,
    }))
    .sort((a, b) => b.count - a.count);

  /** Skills with only 1 person connected */
  const skillGaps = topSkills.filter((s) => s.count === 1);

  // ─── Reset (re-fetches from /public CSVs) ───────────────────────────────────

  const resetData = useCallback(() => {
    fetchDefaultCsvs()
      .then((csvData) => {
        setData(csvData);
        saveToStorage(csvData);
      })
      .catch(() => {
        // If fetch fails, clear to empty
        const empty: GraphData = { nodes: [], edges: [] };
        setData(empty);
        saveToStorage(empty);
      });
  }, []);

  return {
    data,
    isLoaded,
    people,
    skills,
    addPerson,
    updatePerson,
    deletePerson,
    addSkill,
    updateSkill,
    deleteSkill,
    addConnection,
    deleteConnection,
    importCsvData,
    topSkills,
    skillGaps,
    resetData,
  };
}
