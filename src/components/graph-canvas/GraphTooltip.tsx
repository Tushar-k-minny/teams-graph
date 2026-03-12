export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  bgImage: string;
  relations: { name: string; level: string }[];
}

interface GraphTooltipProps {
  tooltip: TooltipState;
}

export function GraphTooltip({ tooltip }: GraphTooltipProps) {
  if (!tooltip.visible) return null;

  return (
    <div
      className="absolute z-50 pointer-events-none transform -translate-x-1/2 -translate-y-[120%] transition-opacity duration-150"
      style={{ left: tooltip.x, top: tooltip.y }}
    >
      <div className="bg-slate-900/95 backdrop-blur-md shadow-xl border border-slate-700/50 rounded-lg p-3 w-max max-w-[200px] flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {tooltip.bgImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tooltip.bgImage} alt="" className="w-8 h-8 opacity-90 object-contain" />
          )}
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-200 truncate">{tooltip.title}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{tooltip.subtitle}</p>
          </div>
        </div>

        {tooltip.relations && tooltip.relations.length > 0 && (
          <div className="border-t border-slate-700/50 pt-2 flex flex-col gap-1.5 mt-1">
            {tooltip.relations.slice(0, 5).map((rel, idx) => (
              <div key={idx} className="flex justify-between items-center gap-3">
                <span className="text-slate-300 text-[11px] font-medium truncate max-w-[100px]">{rel.name}</span>
                <span className={`px-1.5 py-[2px] rounded text-[9px] uppercase font-bold tracking-wider shrink-0
                  ${rel.level === 'expert' ? 'bg-emerald-500/20 text-emerald-400' : 
                    rel.level === 'learning' ? 'bg-amber-500/20 text-amber-400' : 
                    'bg-blue-500/20 text-blue-400'}`}>
                  {rel.level}
                </span>
              </div>
            ))}
            {tooltip.relations.length > 5 && (
              <p className="text-[9px] text-slate-500 text-center font-medium mt-0.5">
                +{tooltip.relations.length - 5} more
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
