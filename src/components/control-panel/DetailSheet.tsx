"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GraphEdge,
  GraphNode,
  PersonNode,
  SkillLevel,
  SkillNode,
} from "@/types/graph";
import { Link2, Pencil, Trash2, User, Zap } from "lucide-react";

const levelVariant: Record<SkillLevel, string> = {
  learning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  familiar: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  expert: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

interface DetailSheetProps {
  selectedNode: GraphNode | null;
  selectedEdge: GraphEdge | null;
  connectedEdges: GraphEdge[];
  getNodeName: (id: string) => string;
  onClearSelection: () => void;
  onEditPerson: (node: PersonNode) => void;
  onEditSkill: (node: SkillNode) => void;
  onDeletePerson: (id: string) => void;
  onDeleteSkill: (id: string) => void;
  onDeleteConnection: (id: string) => void;
}

export function DetailSheet({
  selectedNode,
  selectedEdge,
  connectedEdges,
  getNodeName,
  onClearSelection,
  onEditPerson,
  onEditSkill,
  onDeletePerson,
  onDeleteSkill,
  onDeleteConnection,
}: DetailSheetProps) {
  const showSheet = selectedNode !== null || selectedEdge !== null;

  return (
    <Sheet
      open={showSheet}
      onOpenChange={(open) => {
        if (!open) onClearSelection();
      }}
    >
      <SheetContent className="bg-slate-900/95 backdrop-blur-2xl border-l border-slate-700/50 text-slate-100 overflow-y-auto shadow-2xl sm:max-w-md w-full p-0">
        <div className="p-6 h-full flex flex-col">
          {selectedNode?.type === "person" && (
            <div className="flex-1 flex flex-col">
              <SheetHeader className=" border-slate-800 flex flex-row items-center gap-4">
                <div className="flex  items-center justify-center h-full aspect-square rounded-full bg-blue-500/10 border border-blue-500/20 shadow-inner">
                  <User className="size-full p-4 text-blue-400" />
                </div>
                <div className="flex flex-col ">
                  <SheetTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    {selectedNode.name}
                  </SheetTitle>
                  <SheetDescription className="text-slate-400 font-medium text-sm tracking-wide ">
                    {(selectedNode as PersonNode).role}
                  </SheetDescription>
                </div>
              </SheetHeader>
              <div className="flex-1 ">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  Connected Skills
                  <div className="h-px bg-slate-800 flex-1" />
                </h4>
                {connectedEdges.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-800/20 rounded-xl border border-dashed border-slate-700/50">
                    <p className="text-sm font-medium text-slate-400">
                      No skills connected
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Use the actions menu to add connections.
                    </p>
                  </div>
                )}
                <div className="space-y-2.5">
                  {connectedEdges.map((edge) => (
                    <div
                      key={edge.id}
                      className="group flex flex-col gap-2.5 bg-slate-800/40 hover:bg-slate-800/60 transition-colors rounded-xl p-3.5 border border-slate-700/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">
                          {getNodeName(edge.target)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelVariant[edge.level]}`}
                          >
                            {edge.level}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => onDeleteConnection(edge.id)}
                            title="Remove connection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 rounded-full border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/50 transition-colors font-medium"
                  onClick={() => onEditPerson(selectedNode as PersonNode)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit Person
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-colors font-medium"
                  onClick={() => {
                    onDeletePerson(selectedNode.id);
                    onClearSelection();
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {selectedNode?.type === "skill" && (
            <div className="flex-1 flex flex-col">
              <SheetHeader className=" border-slate-800 flex flex-row items-center gap-4">
                <div className="flex items-center justify-center h-full aspect-square rounded-full bg-orange-500/10 border border-orange-500/20 shadow-inner">
                  <Zap className="size-full p-4 text-orange-400" />
                </div>
                <div className="flex flex-col gap-2 items-start h-full ">
                  <SheetTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                    {selectedNode.name}
                  </SheetTitle>
                  <SheetDescription className="text-slate-300 capitalize font-light text-sm tracking-wide">
                    {(selectedNode as SkillNode).category}
                  </SheetDescription>
                </div>
              </SheetHeader>
              <div className="flex-1">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  People with this skill
                  <div className="h-px bg-slate-800 flex-1" />
                </h4>
                {connectedEdges.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-800/20 rounded-xl border border-dashed border-slate-700/50">
                    <p className="text-sm font-medium text-slate-400">
                      No people connected
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Use the actions menu to assign this skill.
                    </p>
                  </div>
                )}
                <div className="space-y-2.5">
                  {connectedEdges.map((edge) => (
                    <div
                      key={edge.id}
                      className="group flex flex-col gap-2.5 bg-slate-800/40 hover:bg-slate-800/60 transition-colors rounded-xl p-3.5 border border-slate-700/30"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">
                          {getNodeName(edge.source)}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${levelVariant[edge.level]}`}
                          >
                            {edge.level}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                            onClick={() => onDeleteConnection(edge.id)}
                            title="Remove connection"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 rounded-full border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:text-orange-300 hover:border-orange-500/50 transition-colors font-medium"
                  onClick={() => onEditSkill(selectedNode as SkillNode)}
                >
                  <Pencil className="w-3.5 h-3.5 mr-2" />
                  Edit Skill
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-colors font-medium"
                  onClick={() => {
                    onDeleteSkill(selectedNode.id);
                    onClearSelection();
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {selectedEdge && (
            <div className="flex-1 flex flex-col">
              <SheetHeader className="pb-6 border-b border-slate-800">
                <SheetTitle className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
                    <Link2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  Connection
                </SheetTitle>
                <SheetDescription className="text-slate-400 font-medium text-sm tracking-wide ml-[52px]">
                  <span className="text-slate-200">
                    {getNodeName(selectedEdge.source)}
                  </span>
                  <span className="mx-2 text-slate-500">→</span>
                  <span className="text-slate-200">
                    {getNodeName(selectedEdge.target)}
                  </span>
                </SheetDescription>
              </SheetHeader>
              <div className="flex-1 mt-6">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                  Connection Details
                  <div className="h-px bg-slate-800 flex-1" />
                </h4>
                <div className="flex items-center justify-between bg-slate-800/40 rounded-xl p-4 border border-slate-700/30">
                  <span className="text-sm font-medium text-slate-300">
                    Proficiency Level
                  </span>
                  <Badge
                    variant="outline"
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm ${levelVariant[selectedEdge.level]}`}
                  >
                    {selectedEdge.level}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 mt-6 border-t border-slate-800">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-9 px-4 rounded-full border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50 transition-colors font-medium w-full sm:w-auto"
                  onClick={() => {
                    onDeleteConnection(selectedEdge.id);
                    onClearSelection();
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Connection
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
