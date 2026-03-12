import { Minus, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LayoutName } from "@/types/graph";

interface Props {
  zoomLevel: number;
  layoutName: LayoutName;
  onLayoutChange: (val: LayoutName) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export function ZoomAndLayoutControls({
  zoomLevel,
  layoutName,
  onLayoutChange,
  onZoomIn,
  onZoomOut,
}: Props) {
  return (
    <div className="absolute bottom-5 right-[180px] z-30 flex items-center gap-3 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg p-1.5 shadow-lg">
      <div className="flex items-center gap-1.5">
        <button
          onClick={onZoomOut}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-medium text-slate-300 w-11 text-center select-none">
          {zoomLevel}%
        </span>
        <button
          onClick={onZoomIn}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-slate-700/50 hidden sm:block" />

      <div className="hidden sm:block min-w-[160px]">
        <Select value={layoutName} onValueChange={onLayoutChange}>
          <SelectTrigger className="w-full h-8 text-xs bg-slate-800/50 border-none shadow-none focus-visible:ring-0">
            <SelectValue placeholder="Select Layout" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breadthfirst">2-Column Structure</SelectItem>
            <SelectItem value="cose">Fluid Clustering</SelectItem>
            <SelectItem value="grid">Grid Structure</SelectItem>
            <SelectItem value="circle">Circular Radial</SelectItem>
            <SelectItem value="concentric">Concentric Circles</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
