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
import { PersonNode } from "@/types/graph";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface PersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingNode: PersonNode | null;
  onSubmit: (id: string | null, form: { name: string; role: string }) => void;
}

export function PersonDialog({
  open,
  onOpenChange,
  editingNode,
  onSubmit,
}: PersonDialogProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (open) {
      setName(editingNode?.name ?? "");
      setRole(editingNode?.role ?? "");
    }
  }, [open, editingNode]);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit(editingNode?.id ?? null, { name, role });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700/50 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-blue-300">
            {editingNode ? "Edit Person" : "Add Person"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {editingNode
              ? "Update this team member's details."
              : "Add a new team member to the graph."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="person-name" className="text-slate-300">
              Name
            </Label>
            <Input
              id="person-name"
              placeholder="e.g. Alice"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="person-role" className="text-slate-300">
              Role
            </Label>
            <Input
              id="person-role"
              placeholder="e.g. Frontend Dev"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-slate-800 border-slate-600 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <Button
            id="btn-submit-person"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            {editingNode ? "Update" : "Add"} Person
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
