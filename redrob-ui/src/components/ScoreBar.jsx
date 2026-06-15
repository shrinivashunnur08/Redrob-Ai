export default function ScoreBar({ value, showLabel = true, height = "h-2" }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 65
      ? "from-emerald-400 to-teal-500"
      : pct >= 45
        ? "from-amber-400 to-orange-500"
        : "from-red-400 to-rose-500";

  return (
    <div className="w-full">
      <div
        className={`w-full bg-slate-800 rounded-full ${height} overflow-hidden`}
      >
        <div
          className={`${height} rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-slate-400 mt-1 block">
          {value.toFixed(4)}
        </span>
      )}
    </div>
  );
}
