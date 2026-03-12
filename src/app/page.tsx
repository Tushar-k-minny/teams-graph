"use client";

import ControlPanel from "@/components/ControlPanel";
import GraphCanvas from "@/components/GraphCanvas";
import { useGraphData } from "@/hooks/useGraphData";
import type { GraphEdge, GraphNode } from "@/types/graph";
import { useState } from "react";

export default function Home() {
  const {
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
    topSkills,
    skillGaps,
    resetData,
    importCsvData,
  } = useGraphData();

  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null);

  const clearSelection = () => {
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium tracking-wide">
            Loading graph…
          </p>
        </div>
      </div>
    );
  }

  return (
    <ControlPanel
      data={data}
      people={people}
      skills={skills}
      topSkills={topSkills}
      skillGaps={skillGaps}
      selectedNode={selectedNode}
      selectedEdge={selectedEdge}
      onAddPerson={addPerson}
      onUpdatePerson={updatePerson}
      onDeletePerson={deletePerson}
      onAddSkill={addSkill}
      onUpdateSkill={updateSkill}
      onDeleteSkill={deleteSkill}
      onAddConnection={addConnection}
      onDeleteConnection={deleteConnection}
      onImportCsv={importCsvData}
      onResetData={resetData}
      onClearSelection={clearSelection}
    >
      {/* ── Graph Area ── */}
      <div className="relative h-full w-full">
        {/* Node/Connection Badges */}
        <div className="absolute top-5 left-5 z-30 flex gap-2 pointer-events-none">
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-xs font-medium text-slate-300">
              {people.length} People
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
            <span className="w-2.5 h-2.5 bg-orange-500" />
            <span className="text-xs font-medium text-slate-300">
              {skills.length} Skills
            </span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
            <span className="w-4 h-0.5 bg-emerald-500 block" />
            <span className="text-xs font-medium text-slate-300">
              {data.edges.length} Connections
            </span>
          </div>
        </div>

        {/* Graph rendering engine */}
        <GraphCanvas
          data={data}
          onSelectNode={setSelectedNode}
          onSelectEdge={setSelectedEdge}
        />

        {/* Edge / Connection Legend */}
        <div className="absolute bottom-5 left-5 z-30 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4 shadow-2xl">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Proficiency Legend
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-amber-500 rounded block border-dashed border border-amber-500/50" />
              <span className="text-xs text-slate-300">Learning</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-0.5 bg-blue-500 rounded block" />
              <span className="text-xs text-slate-300">Familiar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-1 bg-emerald-500 rounded block" />
              <span className="text-xs text-slate-300">Expert</span>
            </div>
          </div>
        </div>
      </div>
    </ControlPanel>
  );
}
