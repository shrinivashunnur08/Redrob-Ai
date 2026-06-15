const variants = {
  green: "bg-emerald-900/60 text-emerald-300 border border-emerald-700/50",
  amber: "bg-amber-900/60  text-amber-300  border border-amber-700/50",
  red: "bg-red-900/60    text-red-300    border border-red-700/50",
  blue: "bg-blue-900/60   text-blue-300   border border-blue-700/50",
  slate: "bg-slate-800     text-slate-300  border border-slate-700",
};

export default function SignalBadge({ label, variant = "slate", icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
}
