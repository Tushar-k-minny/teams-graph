import type {
  GraphData,
  GraphEdge,
  GraphNode,
  PersonNode,
  SkillLevel,
  SkillNode,
} from "@/types/graph";

// ─── Parse a raw CSV string into rows of key-value objects ────────────────────

function parseCsv(raw: string): Record<string, string>[] {
  const lines = raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] ?? "";
    });
    return row;
  });
}

// ─── Convert CSV rows into graph data ─────────────────────────────────────────

function parsePeopleCsv(csv: string): PersonNode[] {
  return parseCsv(csv)
    .filter((row) => row.id && row.name)
    .map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role ?? "",
      type: "person" as const,
    }));
}

function parseSkillsCsv(csv: string): SkillNode[] {
  return parseCsv(csv)
    .filter((row) => row.id && row.name)
    .map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category ?? "",
      type: "skill" as const,
    }));
}

const VALID_LEVELS: SkillLevel[] = ["learning", "familiar", "expert"];

function parseConnectionsCsv(csv: string): GraphEdge[] {
  let counter = 0;
  return parseCsv(csv)
    .filter((row) => row.person_id && row.skill_id)
    .map((row) => {
      const level = VALID_LEVELS.includes(row.proficiency as SkillLevel)
        ? (row.proficiency as SkillLevel)
        : "familiar";
      return {
        id: `edge-csv-${++counter}`,
        source: row.person_id,
        target: row.skill_id,
        level,
      };
    });
}

// ─── High-level: build GraphData from three CSVs ─────────────────────────────

export function buildGraphDataFromCsvs(
  peopleCsv: string,
  skillsCsv: string,
  connectionsCsv: string
): GraphData {
  const people = parsePeopleCsv(peopleCsv);
  const skills = parseSkillsCsv(skillsCsv);
  const edges = parseConnectionsCsv(connectionsCsv);

  // Build sets of valid IDs for edge validation
  const validNodeIds = new Set([
    ...people.map((p) => p.id),
    ...skills.map((s) => s.id),
  ]);

  const validEdges = edges.filter(
    (e) => validNodeIds.has(e.source) && validNodeIds.has(e.target)
  );

  const nodes: GraphNode[] = [...people, ...skills];
  return { nodes, edges: validEdges };
}

// ─── Fetch default CSVs from /public ──────────────────────────────────────────

export async function fetchDefaultCsvs(): Promise<GraphData> {
  const [peopleRes, skillsRes, connectionsRes] = await Promise.all([
    fetch("/people.csv"),
    fetch("/skills.csv"),
    fetch("/connections.csv"),
  ]);

  const peopleCsv = peopleRes.ok ? await peopleRes.text() : "";
  const skillsCsv = skillsRes.ok ? await skillsRes.text() : "";
  const connectionsCsv = connectionsRes.ok ? await connectionsRes.text() : "";

  return buildGraphDataFromCsvs(peopleCsv, skillsCsv, connectionsCsv);
}
