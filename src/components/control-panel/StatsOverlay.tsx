import { Badge } from "@/components/ui/badge";
import { SkillNode } from "@/types/graph";
import { AlertTriangle, TrendingUp } from "lucide-react";

interface StatsOverlayProps {
  topSkills: { skill: SkillNode; count: number }[];
  skillGaps: { skill: SkillNode; count: number }[];
}

export function StatsOverlay({ topSkills, skillGaps }: StatsOverlayProps) {
  return (
    <div
      id="summary-stats"
      className="flex flex-col gap-4"
    >
      {/* Top Skills */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Top Skills
          </span>
        </div>
        {topSkills.slice(0, 3).map(({ skill, count }) => (
          <div
            key={skill.id}
            className="flex items-center justify-between py-1"
          >
            <span className="text-sm text-slate-200">{skill.name}</span>
            <Badge
              variant="outline"
              className="bg-emerald-500/15 text-emerald-300 border-emerald-500/30 text-xs"
            >
              {count} {count === 1 ? "person" : "people"}
            </Badge>
          </div>
        ))}
        {topSkills.length === 0 && (
          <p className="text-xs text-slate-500">No skills yet</p>
        )}
      </div>

      {/* Skill Gaps */}
      <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Skill Gaps
          </span>
        </div>
        {skillGaps.map(({ skill }) => (
          <div key={skill.id} className="flex items-center py-1">
            <span className="text-sm text-amber-200">{skill.name}</span>
            <Badge
              variant="outline"
              className="ml-auto bg-amber-500/15 text-amber-300 border-amber-500/30 text-xs"
            >
              1 person only
            </Badge>
          </div>
        ))}
        {skillGaps.length === 0 && (
          <p className="text-xs text-slate-500">No gaps detected</p>
        )}
      </div>
    </div>
  );
}
