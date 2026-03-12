"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PersonNode, SkillLevel, SkillNode } from "@/types/graph";
import { Link2 } from "lucide-react";
import { useEffect, useState } from "react";

interface ConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  people: PersonNode[];
  skills: SkillNode[];
  onSubmit: (form: { source: string; target: string; level: SkillLevel }) => void;
}

export function ConnectionDialog({
  open,
  onOpenChange,
  people,
  skills,
  onSubmit,
}: ConnectionDialogProps) {
  const [source, setSource] = useState("");
  const [target, setTarget] = useState("");
  const [level, setLevel] = useState<SkillLevel>("familiar");

  useEffect(() => {
    if (open) {
      setSource(people[0]?.id ?? "");
      setTarget(skills[0]?.id ?? "");
      setLevel("familiar");
    }
  }, [open, people, skills]);

  const handleSubmit = () => {
    if (!source || !target) return;
    onSubmit({ source, target, level });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700/50 text-slate-100">
        <DialogHeader>
          <DialogTitle className="text-emerald-300">Add Connection</DialogTitle>
          <DialogDescription className="text-slate-400">
            Link a team member to a skill with a proficiency level.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-slate-300">Person</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                <SelectValue placeholder="Select person" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">
                {people.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Skill</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">
                {skills.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name} — {s.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-slate-300">Proficiency Level</Label>
            <Select value={level} onValueChange={(v) => setLevel(v as SkillLevel)}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 text-slate-100">
                <SelectItem value="learning">🟡 Learning</SelectItem>
                <SelectItem value="familiar">🔵 Familiar</SelectItem>
                <SelectItem value="expert">🟢 Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            id="btn-submit-connection"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleSubmit}
            disabled={!source || !target}
          >
            <Link2 className="w-4 h-4 mr-1.5" />
            Create Connection
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
