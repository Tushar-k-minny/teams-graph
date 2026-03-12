import { Link2, User, Wrench } from "lucide-react";

interface CountBadgesProps {
  peopleCount: number;
  skillsCount: number;
  connectionsCount: number;
}

export function CountBadges({
  peopleCount,
  skillsCount,
  connectionsCount,
}: CountBadgesProps) {
  return (
    <div className="absolute top-5 right-5 z-30 flex gap-2 pointer-events-none">
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
        <User className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-medium text-slate-300">{peopleCount}</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
        <Wrench className="w-3.5 h-3.5 text-orange-400" />
        <span className="text-xs font-medium text-slate-300">{skillsCount}</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-lg px-3 py-1.5 shadow-lg pointer-events-auto">
        <Link2 className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-xs font-medium text-slate-300">
          {connectionsCount}
        </span>
      </div>
    </div>
  );
}
