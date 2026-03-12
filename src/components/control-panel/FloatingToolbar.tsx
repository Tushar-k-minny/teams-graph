import { Button } from "@/components/ui/button";
import { Cable, RotateCcw, Upload, User, Wrench } from "lucide-react";

interface FloatingToolbarProps {
  onAddPerson: () => void;
  onAddSkill: () => void;
  onAddConnection: () => void;
  onImportCsv: () => void;
  onResetData: () => void;
}

export function FloatingToolbar({
  onAddPerson,
  onAddSkill,
  onAddConnection,
  onImportCsv,
  onResetData,
}: FloatingToolbarProps) {
  return (
    <div className="flex items-center gap-3">
      <Button
        id="btn-add-person"
        onClick={onAddPerson}
        className="h-9 px-5 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-lg shadow-blue-500/30 border border-blue-400/20 transition-all hover:-translate-y-0.5"
      >
        <User className="w-4 h-4 mr-2" />
        <span className="font-semibold tracking-wide">Add Person</span>
      </Button>
      <Button
        id="btn-add-skill"
        onClick={onAddSkill}
        className="h-9 px-5 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white shadow-lg shadow-orange-500/30 border border-orange-400/20 transition-all hover:-translate-y-0.5"
      >
        <Wrench className="w-4 h-4 mr-2" />
        <span className="font-semibold tracking-wide">Add Skill</span>
      </Button>
      <Button
        id="btn-add-connection"
        onClick={onAddConnection}
        className="h-9 px-5 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/20 transition-all hover:-translate-y-0.5"
      >
        <Cable className="w-4 h-4 mr-2" />
        <span className="font-semibold tracking-wide">Add Connection</span>
      </Button>
      
      <div className="w-px h-6 bg-slate-700/50 mx-1" />

      <Button
        id="btn-import-csv"
        onClick={onImportCsv}
        className="h-9 px-5 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-500/30 border border-violet-400/20 transition-all hover:-translate-y-0.5"
      >
        <Upload className="w-4 h-4 mr-2" />
        <span className="font-semibold tracking-wide">Import CSV</span>
      </Button>
      <Button
        id="btn-reset"
        variant="secondary"
        onClick={onResetData}
        className="h-9 px-5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 shadow-md border border-slate-700/50 transition-all hover:-translate-y-0.5"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        <span className="font-semibold tracking-wide">Reset</span>
      </Button>
    </div>
  );
}
