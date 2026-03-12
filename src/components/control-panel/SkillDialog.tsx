"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SkillNode } from "@/types/graph";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNode: SkillNode | null;
  onSubmit: (id: string | null, form: { name: string; category: string }) => void;
}

export function SkillDialog({
  open,
  onOpenChange,
  editingNode,
  onSubmit,
}: SkillDialogProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (open) {
      setName(editingNode?.name ?? "");
      setCategory(editingNode?.category ?? "");
    }
  }, [open, editingNode]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(editingNode?.id ?? null, { name, category });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700/50 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-orange-300">
            {editingNode ? "Edit Skill" : "Add Skill"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {editingNode
              ? "Update this skill's details."
              : "Add a new skill to the graph."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="skill-name" className="text-slate-300">
              Skill Name
            </Label>
            <Input
              id="skill-name"
              placeholder="e.g. React"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="skill-category" className="text-slate-300">
              Category
            </Label>
            <Input
              id="skill-category"
              placeholder="e.g. Frontend"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <Button
            id="btn-submit-skill"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {editingNode ? "Update" : "Add"} Skill
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
