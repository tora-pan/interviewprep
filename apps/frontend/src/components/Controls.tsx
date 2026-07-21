import { useEffect } from "react";

type ControlsProps = {
  playing: boolean;
  setPlaying: (v: boolean) => void;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  stepsLength: number;
  speed: number;
  setSpeed: (v: number) => void;
};

const SPEEDS = [0.5, 1, 2, 4];

export function Controls({
  playing,
  setPlaying,
  index,
  setIndex,
  stepsLength,
  speed,
  setSpeed,
}: ControlsProps) {
  useEffect(() => {
    if (playing && index === stepsLength - 1) {
      setPlaying(false);
    }
  }, [index, stepsLength, playing, setPlaying]);

  const atStart = index === 0;
  const atEnd = index === stepsLength - 1;
  const progress = stepsLength > 1 ? (index / (stepsLength - 1)) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className="h-full rounded-full bg-cyan-500 transition-all duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs text-slate-400 w-24 shrink-0">
          Step {index + 1} / {stepsLength}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
            disabled={atStart}
            className={`border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors ${atStart ? "opacity-50 pointer-events-none" : ""}`}
          >
            &#9664;
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            {playing ? "\u23F8" : "\u25B6"}
          </button>

          <button
            onClick={() => setIndex((i) => Math.min(i + 1, stepsLength - 1))}
            disabled={atEnd}
            className={`border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-lg text-sm transition-colors ${atEnd ? "opacity-50 pointer-events-none" : ""}`}
          >
            &#9654;
          </button>
        </div>

        <div className="flex items-center gap-1 w-24 justify-end shrink-0">
          {SPEEDS.map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 rounded text-xs border transition-colors ${
                speed === s
                  ? "bg-cyan-500 border-cyan-500 text-black"
                  : "border-slate-700 text-slate-400 hover:border-slate-500"
              }`}
            >
              {s}&#215;
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
