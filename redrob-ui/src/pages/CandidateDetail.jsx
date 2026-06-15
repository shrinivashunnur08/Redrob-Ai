import { useParams, Link } from "react-router-dom";
import { useRankings } from "../hooks/useRankings";
import { ArrowLeft, MapPin } from "lucide-react";
import ScoreBar from "../components/ScoreBar";
import SignalBadge from "../components/SignalBadge";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function CandidateDetail() {
  const { id } = useParams();
  const { rankings, loading } = useRankings();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );

  const candidate = rankings.find((r) => r.candidate_id === id);

  if (!candidate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h2 className="text-white font-semibold mb-2">Candidate not found</h2>
          <p className="text-slate-400 text-sm mb-4">
            Detailed profile only available for candidates in the sample
            dataset.
          </p>
          <Link
            to="/rankings"
            className="text-teal-400 text-sm hover:underline"
          >
            ← Back to rankings
          </Link>
        </div>
      </div>
    );
  }

  const radarData = [
    { subject: "Skills", value: Math.round((candidate.skills || 0) * 100) },
    { subject: "Career", value: Math.round((candidate.career || 0) * 100) },
    {
      subject: "Behavioral",
      value: Math.round((candidate.behavioral || 0) * 100),
    },
    { subject: "Response", value: candidate.responseRate || 0 },
    { subject: "Score", value: Math.round(candidate.score * 100) },
  ];

  const rr = parseInt(candidate.response_rate || 0);
  const isActive =
    candidate.last_active &&
    new Date(candidate.last_active) > new Date("2026-04-01");
  const scoreComponents = [
    {
      label: "Skills Match",
      value: candidate.skills || 0,
      weight: "30%",
      desc: "Domain vocabulary + trust multiplier",
    },
    {
      label: "Career / Title",
      value: candidate.career || 0,
      weight: "22%",
      desc: "Title signal + AI role months",
    },
    {
      label: "Behavioral",
      value: candidate.behavioral || 0,
      weight: "18%",
      desc: "Availability + engagement signals",
    },
    {
      label: "Response Rate",
      value: (candidate.responseRate || 0) / 100,
      weight: "—",
      desc: `${candidate.responseRate}% response rate`,
    },
    {
      label: "Overall Score",
      value: candidate.score,
      weight: "—",
      desc: "Weighted composite (all 8 components)",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pt-20">
      {/* Back */}
      <Link
        to="/rankings"
        className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Rankings
      </Link>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center font-black text-white text-lg shadow-lg flex-shrink-0">
            #{candidate.rank}
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white capitalize">
              {candidate.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {candidate.city}, {candidate.state}, {candidate.country}
              </span>
              <span>{candidate.yoe} yrs experience</span>
              <span className="font-mono text-slate-500 text-xs">
                {candidate.candidate_id}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <SignalBadge
                label={isActive ? "Recently Active" : "Inactive"}
                variant={isActive ? "green" : "red"}
              />
              <SignalBadge
                label={`Response Rate ${rr}%`}
                variant={rr >= 60 ? "green" : rr >= 30 ? "amber" : "red"}
              />
              {candidate.core_match && (
                <SignalBadge
                  label={`Core: ${candidate.core_match}`}
                  variant="blue"
                />
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-teal-400 font-mono">
              {candidate.score.toFixed(4)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Composite Score</div>
          </div>
        </div>
      </div>

      {/* Score Analysis */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4">
          📊 Score Analysis
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Strongest Signal",
              value:
                candidate.career >= 0.99
                  ? "Career trajectory — perfect domain title and AI role history"
                  : candidate.behavioral >= 0.85
                    ? "Behavioral — highly active and responsive to recruiters"
                    : "Skills — strong domain vocabulary match",
              color: "border-emerald-700/50 bg-emerald-950/30",
              icon: "✅",
            },
            {
              label: "Limiting Factor",
              value:
                candidate.skills < 0.2
                  ? `Skills ${candidate.skills.toFixed(2)} — limited domain vocabulary`
                  : rr < 40
                    ? `Low response rate (${rr}%) — availability risk`
                    : parseFloat(candidate.yoe) < 5
                      ? `Experience (${candidate.yoe} yrs) — below ideal 6–8 yr band`
                      : "Well-balanced — no critical weaknesses",
              color: "border-amber-700/50 bg-amber-950/30",
              icon: "⚠️",
            },
            {
              label: "Hiring Risk",
              value:
                rr < 30
                  ? "High — very low recruiter response rate"
                  : !isActive
                    ? "Medium — inactive for 90+ days"
                    : "Low — recently active and responsive",
              color:
                rr < 30
                  ? "border-red-700/50 bg-red-950/30"
                  : "border-blue-700/50 bg-blue-950/30",
              icon: rr < 30 ? "🔴" : "🟢",
            },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className={`rounded-xl p-4 border ${color}`}>
              <div className="text-xs font-semibold text-slate-400 mb-2">
                {icon} {label}
              </div>
              <div className="text-xs text-slate-300 leading-relaxed">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Score Components */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">
            Score Breakdown
          </h2>
          <div className="space-y-4">
            {scoreComponents.map(({ label, value, weight, desc }) => (
              <div key={label}>
                <div className="flex justify-between items-baseline mb-1">
                  <div>
                    <span className="text-xs font-medium text-slate-300">
                      {label}
                    </span>
                    <span className="text-xs text-slate-600 ml-2">
                      ({weight})
                    </span>
                  </div>
                  <span className="font-mono text-teal-400 text-sm">
                    {value.toFixed(2)}
                  </span>
                </div>
                <ScoreBar value={value} showLabel={false} height="h-1.5" />
                <p className="text-xs text-slate-600 mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">
            Signal Radar
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Radar
                dataKey="value"
                stroke="#2dd4bf"
                fill="#2dd4bf"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: 8,
                }}
                itemStyle={{ color: "#2dd4bf" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Score Analysis */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-4">
            📊 Score Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Strongest Signal",
                value:
                  candidate.career >= 0.99
                    ? "Career trajectory — perfect domain title and AI role history"
                    : candidate.behavioral >= 0.85
                      ? "Behavioral — highly active and responsive to recruiters"
                      : "Skills — strong domain vocabulary match",
                color: "border-emerald-700/50 bg-emerald-950/30",
                icon: "✅",
              },
              {
                label: "Limiting Factor",
                value:
                  candidate.skills < 0.2
                    ? `Skills score ${candidate.skills.toFixed(2)} — limited domain vocabulary depth`
                    : candidate.response_rate < 40
                      ? `Low response rate (${candidate.response_rate}%) — availability risk`
                      : parseFloat(candidate.yoe) < 5
                        ? `Experience (${candidate.yoe} yrs) — below ideal 6–8 yr band`
                        : "Well-balanced profile — no critical weaknesses detected",
                color: "border-amber-700/50 bg-amber-950/30",
                icon: "⚠️",
              },
              {
                label: "Hiring Risk",
                value:
                  candidate.response_rate < 30
                    ? "High — very low recruiter response rate"
                    : new Date(candidate.last_active) < new Date("2026-03-01")
                      ? "Medium — inactive for 90+ days"
                      : "Low — recently active and responsive",
                color:
                  candidate.response_rate < 30
                    ? "border-red-700/50 bg-red-950/30"
                    : "border-blue-700/50 bg-blue-950/30",
                icon: candidate.response_rate < 30 ? "🔴" : "🟢",
              },
            ].map(({ label, value, color, icon }) => (
              <div key={label} className={`rounded-xl p-4 border ${color}`}>
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  {icon} {label}
                </div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reasoning */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-3">
            Ranking Reasoning
          </h2>
          <div className="bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed border border-slate-800">
            {candidate.reasoning}
          </div>
          <p className="text-xs text-slate-600 mt-3">
            Every reasoning string is generated directly from the scoring
            algorithm — no LLM hallucination. Each field maps to a real computed
            signal.
          </p>
        </div>
      </div>
    </div>
  );
}
