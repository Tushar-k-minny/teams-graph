"use client";

import type {
  GraphData,
  GraphEdge,
  GraphNode,
  PersonNode,
  SkillLevel,
  SkillNode,
} from "@/types/graph";
import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import { ConnectionDialog } from "./control-panel/ConnectionDialog";
import { DetailSheet } from "./control-panel/DetailSheet";
import { FloatingToolbar } from "./control-panel/FloatingToolbar";
import { ImportCsvDialog } from "./control-panel/ImportCsvDialog";
import { PersonDialog } from "./control-panel/PersonDialog";
import { SkillDialog } from "./control-panel/SkillDialog";
import { StatsOverlay } from "./control-panel/StatsOverlay";

// ─── Props ────────────────────────────────────────────────────────────────────

interface ControlPanelProps {
  data: GraphData;
  people: PersonNode[];
  skills: SkillNode[];
  topSkills: { skill: SkillNode; count: number }[];
  skillGaps: { skill: SkillNode; count: number }[];
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  onAddPerson: (form: { name: string; role: string }) => void;
  onUpdatePerson: (id: string, form: { name: string; role: string }) => void;
  onDeletePerson: (id: string) => void;
  onAddSkill: (form: { name: string; category: string }) => void;
  onUpdateSkill: (id: string, form: { name: string; category: string }) => void;
  onDeleteSkill: (id: string) => void;
  onAddConnection: (form: {
    source: string;
    target: string;
    level: SkillLevel;
  }) => void;
  onDeleteConnection: (id: string) => void;
  onImportCsv: (peopleCsv: string, skillsCsv: string, connectionsCsv: string) => void;
  onResetData: () => void;
  onClearSelection: () => void;
  children?: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ControlPanel({
  data,
  people,
  skills,
  topSkills,
  skillGaps,
  selectedNode,
  selectedEdge,
  onAddPerson,
  onUpdatePerson,
  onDeletePerson,
  onAddSkill,
  onUpdateSkill,
  onDeleteSkill,
  onAddConnection,
  onDeleteConnection,
  onImportCsv,
  onResetData,
  onClearSelection,
  children,
}: ControlPanelProps) {
  // ── Dialog visibility ─────────────────────────────────────────────────────
  const [showPersonDialog, setShowPersonDialog] = useState(false);
  const [showSkillDialog, setShowSkillDialog] = useState(false);
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  
  // ── Which node is being edited ───────────────────────────────────────────
  const [editingNode, setEditingNode] = useState<GraphNode | null>(null);

  // ── Helpers for detail view ───────────────────────────────────────────────
  const connectedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return data.edges.filter(
      (e) => e.source === selectedNode.id || e.target === selectedNode.id
    );
  }, [selectedNode, data.edges]);

  const getNodeName = useCallback(
    (id: string) => {
      const node = data.nodes.find((n) => n.id === id);
      return node?.name ?? id;
    },
    [data.nodes]
  );

  // ── Callbacks for Dialogs ──────────────────────────────────────────────────

  const openAddPerson = useCallback(() => {
    setEditingNode(null);
    setShowPersonDialog(true);
  }, []);

  const openEditPerson = useCallback((node: PersonNode) => {
    setEditingNode(node);
    setShowPersonDialog(true);
  }, []);

  const submitPerson = useCallback(
    (id: string | null, form: { name: string; role: string }) => {
      if (id) onUpdatePerson(id, form);
      else onAddPerson(form);
    },
    [onAddPerson, onUpdatePerson]
  );

  const openAddSkill = useCallback(() => {
    setEditingNode(null);
    setShowSkillDialog(true);
  }, []);

  const openEditSkill = useCallback((node: SkillNode) => {
    setEditingNode(node);
    setShowSkillDialog(true);
  }, []);

  const submitSkill = useCallback(
    (id: string | null, form: { name: string; category: string }) => {
      if (id) onUpdateSkill(id, form);
      else onAddSkill(form);
    },
    [onAddSkill, onUpdateSkill]
  );

  const openAddConnection = useCallback(() => {
    setShowConnectionDialog(true);
  }, []);

  const openImportDialog = useCallback(() => {
    setShowImportDialog(true);
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-slate-950">
      {/* ── Top Navbar ── */}
      <div className="w-full h-16 flex-shrink-0 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 z-40 relative shadow-md">
        <h1 className="text-xl font-bold tracking-wide text-slate-200 uppercase flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-sm">TS</span>
          </div>
          Team Skill Map
        </h1>
        <FloatingToolbar
          onAddPerson={openAddPerson}
          onAddSkill={openAddSkill}
          onAddConnection={openAddConnection}
          onImportCsv={openImportDialog}
          onResetData={onResetData}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* ── Sidebar Column ──────────────────────────────────────────────────────── */}
        <div className="w-80 flex-shrink-0 h-full bg-slate-900/50 border-r border-slate-800 flex flex-col z-30 relative shadow-xl overflow-y-auto hidden md:block">
          <div className="p-5">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Summary Data
            </h2>
            <StatsOverlay topSkills={topSkills} skillGaps={skillGaps} />
          </div>
        </div>

        {/* ── Main Content Area ── */}
        <div className="flex-1 relative">
          {children}
        </div>
      </div>

      <DetailSheet
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        connectedEdges={connectedEdges}
        getNodeName={getNodeName}
        onClearSelection={onClearSelection}
        onEditPerson={openEditPerson}
        onEditSkill={openEditSkill}
        onDeletePerson={onDeletePerson}
        onDeleteSkill={onDeleteSkill}
        onDeleteConnection={onDeleteConnection}
      />

      <PersonDialog
        open={showPersonDialog}
        onOpenChange={setShowPersonDialog}
        editingNode={editingNode as PersonNode | null}
        onSubmit={submitPerson}
      />

      <SkillDialog
        open={showSkillDialog}
        onOpenChange={setShowSkillDialog}
        editingNode={editingNode as SkillNode | null}
        onSubmit={submitSkill}
      />

      <ConnectionDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
        people={people}
        skills={skills}
        onSubmit={onAddConnection}
      />

      <ImportCsvDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onSubmit={onImportCsv}
      />
    </div>
  );
}
