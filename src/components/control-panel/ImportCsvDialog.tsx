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
import { Cable, FileUp, Upload, User, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ImportCsvDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (peopleCsv: string, skillsCsv: string, connectionsCsv: string) => void;
}

export function ImportCsvDialog({
  open,
  onOpenChange,
  onSubmit,
}: ImportCsvDialogProps) {
  const peopleFileRef = useRef<HTMLInputElement>(null);
  const skillsFileRef = useRef<HTMLInputElement>(null);
  const connectionsFileRef = useRef<HTMLInputElement>(null);

  const [csvFileNames, setCsvFileNames] = useState({ people: "", skills: "", connections: "" });
  const [csvContents, setCsvContents] = useState({ people: "", skills: "", connections: "" });
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCsvFileNames({ people: "", skills: "", connections: "" });
      setCsvContents({ people: "", skills: "", connections: "" });
      setImportError(null);
    }
  }, [open]);

  const handleFileSelect = (
    key: "people" | "skills" | "connections",
    file: File | undefined
  ) => {
    if (!file) return;
    setCsvFileNames((prev) => ({ ...prev, [key]: file.name }));
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvContents((prev) => ({ ...prev, [key]: text }));
    };
    reader.readAsText(file);
  };

  const submitImport = () => {
    if (!csvContents.people && !csvContents.skills) {
      setImportError("Please upload at least a People or Skills CSV.");
      return;
    }
    try {
      onSubmit(csvContents.people, csvContents.skills, csvContents.connections);
      onOpenChange(false);
    } catch {
      setImportError("Failed to parse CSV files. Please check the format.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900 border-slate-700/50 text-slate-100 max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-violet-300 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Import CSV Data
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload your People, Skills, and Connections CSV files to replace the
            current graph. All three files are optional — upload whichever you have.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          {/* People CSV */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              People CSV
              <span className="text-slate-500 text-xs ml-1">(id, name, role)</span>
            </Label>
            <input
              ref={peopleFileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFileSelect("people", e.target.files?.[0])}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => peopleFileRef.current?.click()}
            >
              <FileUp className="w-4 h-4 mr-2 text-blue-400" />
              {csvFileNames.people || "Choose people.csv…"}
            </Button>
          </div>

          {/* Skills CSV */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-orange-400" />
              Skills CSV
              <span className="text-slate-500 text-xs ml-1">(id, name, category)</span>
            </Label>
            <input
              ref={skillsFileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFileSelect("skills", e.target.files?.[0])}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => skillsFileRef.current?.click()}
            >
              <FileUp className="w-4 h-4 mr-2 text-orange-400" />
              {csvFileNames.skills || "Choose skills.csv…"}
            </Button>
          </div>

          {/* Connections CSV */}
          <div className="space-y-2">
            <Label className="text-slate-300 flex items-center gap-1.5">
              <Cable className="w-3.5 h-3.5 text-emerald-400" />
              Connections CSV
              <span className="text-slate-500 text-xs ml-1">(person_id, skill_id, proficiency)</span>
            </Label>
            <input
              ref={connectionsFileRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFileSelect("connections", e.target.files?.[0])}
            />
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start border-slate-600 text-slate-300 hover:bg-slate-800"
              onClick={() => connectionsFileRef.current?.click()}
            >
              <FileUp className="w-4 h-4 mr-2 text-emerald-400" />
              {csvFileNames.connections || "Choose connections.csv…"}
            </Button>
          </div>

          {importError && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg px-3 py-2">
              {importError}
            </p>
          )}

          <Button
            id="btn-submit-import"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            onClick={submitImport}
            disabled={!csvContents.people && !csvContents.skills && !csvContents.connections}
          >
            <Upload className="w-4 h-4 mr-1.5" />
            Import &amp; Replace Graph
          </Button>

          <p className="text-xs text-slate-500 text-center">
            This will <strong>replace</strong> all existing graph data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
