import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Cpu,
  Zap,
  Shield,
} from "lucide-react";

const components = [
  {
    name: "Skills Match",
    weight: "28%",
    color: "bg-teal-500",
    desc: "Domain vocabulary with trust multiplier (proficiency × duration × endorsements). Penalizes keyword stuffing.",
  },
  {
    name: "Career / Title",
    weight: "24%",
    color: "bg-cyan-500",
    desc: "Title signal + AI role months + seniority differentiation. Staff/Lead/Senior titles boosted.",
  },
  {
    name: "Behavioral Signals",
    weight: "22%",
    color: "bg-blue-500",
    desc: "Availability gate: response rate, last active date, open-to-work flag, notice period, GitHub activity.",
  },
  {
    name: "Experience Band",
    weight: "10%",
    color: "bg-violet-500",
    desc: "Ideal 6–8 years per JD. Penalty below 3, diminishing returns beyond 12 years.",
  },
  {
    name: "Location",
    weight: "6%",
    color: "bg-indigo-500",
    desc: "Pune/Noida/NCR preferred. Non-India heavily discounted — JD says no visa sponsorship.",
  },
  {
    name: "Education",
    weight: "4%",
    color: "bg-purple-500",
    desc: "Institution tier + CS/ML field relevance bonus + degree level (PhD, MTech boost).",
  },
  {
    name: "Anti-Services",
    weight: "4%",
    color: "bg-rose-500",
    desc: "Fraction of career at TCS/Infosys/Wipro/Accenture. JD explicit disqualifier for services-only careers.",
  },
  {
    name: "Honeypot Detection",
    weight: "×",
    color: "bg-amber-500",
    desc: "Multiplier: Expert skill + 0 months + 0 endorsements = trap profile. Impossible timelines flagged.",
  },
];

const traps = [
  {
    trap: "Keyword stuffers (HR Manager with all AI skills)",
    how: "Title/career score dominates. Skills alone can't overcome a weak title.",
  },
  {
    trap: "Inactive high-scorers",
    how: "Behavioral gate caps candidates with low response + old last_active.",
  },
  {
    trap: "Honeypot profiles (impossible timelines)",
    how: "Explicit anomaly detector: expert + 0 months + 0 endorsements.",
  },
  {
    trap: "Services-only backgrounds",
    how: "Explicit services fraction penalty over full career history.",
  },
  {
    trap: "Skills listed with 0 months duration",
    how: "Duration trust multiplier reduces per-skill score contribution.",
  },
];

const constraints = [
  { label: "Runtime", req: "< 5 minutes", actual: "~55 seconds", ok: true },
  { label: "RAM", req: "≤ 16 GB", actual: "< 2 GB", ok: true },
  { label: "GPU", req: "Not allowed", actual: "Not used", ok: true },
  {
    label: "Network during ranking",
    req: "Not allowed",
    actual: "Not used",
    ok: true,
  },
  { label: "LLM API calls", req: "Not allowed", actual: "Not used", ok: true },
  { label: "Submissions cap", req: "3 max", actual: "1 used", ok: true },
];

export default function Architecture() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">System Architecture</h1>
        <p className="text-slate-400 text-sm mt-1">
          How the ranking engine works — from JD understanding to explainable
          output.
        </p>
      </div>

      {/* Pipeline diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Cpu size={14} className="text-teal-400" />
          End-to-End Pipeline
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-3">
          {[
            {
              label: "candidates.jsonl",
              sub: "100K profiles",
              color: "bg-blue-600",
            },
            {
              label: "Feature Engine",
              sub: "8 components",
              color: "bg-teal-600",
            },
            {
              label: "Weighted Scorer",
              sub: "Composite + gates",
              color: "bg-violet-600",
            },
            {
              label: "Top-100 CSV",
              sub: "With reasoning",
              color: "bg-rose-600",
            },
          ].map((node, i) => (
            <div key={i} className="flex items-center gap-3 flex-1">
              <div
                className={`${node.color} rounded-xl px-4 py-3 text-center flex-1`}
              >
                <div className="text-white font-semibold text-xs">
                  {node.label}
                </div>
                <div className="text-white/60 text-xs mt-0.5">{node.sub}</div>
              </div>
              {i < 3 && (
                <div className="text-teal-500 font-bold text-lg hidden md:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Score Components */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap size={14} className="text-teal-400" />8 Scoring Components
        </h2>
        <div className="space-y-3">
          {components.map((c) => (
            <div key={c.name} className="flex items-start gap-3">
              <div
                className={`${c.color} text-white text-xs font-bold px-2 py-1 rounded-lg flex-shrink-0 min-w-[3rem] text-center mt-0.5`}
              >
                {c.weight}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{c.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{c.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trap avoidance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={14} className="text-teal-400" />
          Trap Avoidance
        </h2>
        <div className="space-y-3">
          {traps.map(({ trap, how }) => (
            <div
              key={trap}
              className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-slate-950 rounded-xl p-3 border border-slate-800"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={13}
                  className="text-amber-400 flex-shrink-0 mt-0.5"
                />
                <span className="text-xs text-amber-300">{trap}</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle
                  size={13}
                  className="text-teal-400 flex-shrink-0 mt-0.5"
                />
                <span className="text-xs text-teal-300">{how}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compute constraints */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-white mb-4">
          Compute Constraints (per spec)
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {["Constraint", "Requirement", "This System", "Status"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-3 py-2 text-xs text-slate-500 font-medium uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {constraints.map(({ label, req, actual, ok }) => (
                <tr key={label} className="border-b border-slate-800/50">
                  <td className="px-3 py-2.5 text-xs font-medium text-slate-300">
                    {label}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{req}</td>
                  <td className="px-3 py-2.5 text-xs text-teal-400 font-mono">
                    {actual}
                  </td>
                  <td className="px-3 py-2.5">
                    {ok ? (
                      <CheckCircle size={14} className="text-emerald-400" />
                    ) : (
                      <XCircle size={14} className="text-red-400" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* JD Match Explainer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-6">
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="text-teal-400">🎯</span>
          Why These 100 Candidates — Business Logic
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {[
            {
              title: "What the JD says",
              points: [
                "6–8 years experience, tilt toward shipper not researcher",
                "Pune / Noida / Delhi NCR preferred locations",
                "No visa sponsorship — India candidates only",
                "Built ranking/retrieval at product companies",
                "High response rate — actually available now",
              ],
              color: "border-blue-700/40 bg-blue-950/20",
              icon: "📋",
            },
            {
              title: "What our system enforces",
              points: [
                "Experience band scorer: peak at 6–8 yrs, penalty outside range",
                "Location weight 6%: Pune/Noida/NCR = 1.0, non-India = 0.05",
                "Hard gate: non-India + no relocation = 95% score discount",
                "Anti-services penalty: TCS/Infosys-only careers discounted",
                "Behavioral gate: response rate < 5% + inactive 180d = capped",
              ],
              color: "border-teal-700/40 bg-teal-950/20",
              icon: "⚙️",
            },
          ].map(({ title, points, color, icon }) => (
            <div key={title} className={`rounded-xl p-4 border ${color}`}>
              <div className="text-xs font-semibold text-slate-300 mb-3">
                {icon} {title}
              </div>
              <ul className="space-y-2">
                {points.map((p, i) => (
                  <li
                    key={i}
                    className="text-xs text-slate-400 flex items-start gap-2"
                  >
                    <span className="text-teal-500 mt-0.5 flex-shrink-0">
                      →
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800">
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-teal-400 font-semibold">Core insight: </span>A
            Marketing Manager listing every AI keyword scores near-zero because
            career trajectory (24%) dominates skills alone. An ML Engineer with
            low response rate gets penalized because an unavailable perfect
            candidate is, for hiring purposes, not actually a candidate. Every
            business rule in the JD has a direct, auditable line of code.
          </p>
        </div>
      </div>
    </div>
  );
}
