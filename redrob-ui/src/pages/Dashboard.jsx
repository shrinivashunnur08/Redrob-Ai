import { useRankings } from "../hooks/useRankings";
import CandidateCard from "../components/CandidateCard";
import ScoreBar from "../components/ScoreBar";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
import { Users, TrendingUp, Target, Award } from "lucide-react";
import ScoreDistribution from "../components/charts/ScoreDistribution";
import ComponentBreakdown from "../components/charts/ComponentBreakdown";

function MetricCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-sm text-slate-400 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-1">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const { rankings, loading } = useRankings();

  if (loading) return <Loader />;

  const top5Avg = (
    rankings.slice(0, 5).reduce((s, r) => s + r.score, 0) / 5
  ).toFixed(3);
  const domainFitTop10 = rankings
    .slice(0, 10)
    .filter((r) =>
      /ml|ai|machine learning|data scientist|search|recommendation/i.test(
        r.title,
      ),
    ).length;

  // const chartData = rankings.slice(0, 50).map((r) => ({
  //   rank: r.rank,
  //   score: r.score,
  // }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pt-20">
      {/* Hero */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 rounded-full px-3 py-1 text-xs text-teal-400 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          India Runs Hackathon — Track 1 Submission
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Intelligent Candidate Discovery Engine
        </h1>
        <p className="text-slate-400 mt-2 text-sm max-w-2xl">
          Multi-signal hybrid ranking system that evaluates 100,000 candidates
          across 8 dimensions — skills trust, career trajectory, behavioral
          availability, location, education, anti-services penalty, and honeypot
          detection.
        </p>
      </div>

      {/* Constraint bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        {[
          { label: "Runtime", value: "~55 sec", color: "text-emerald-400" },
          { label: "RAM", value: "< 2 GB", color: "text-emerald-400" },
          { label: "GPU", value: "None", color: "text-emerald-400" },
          { label: "LLM API", value: "None", color: "text-emerald-400" },
          { label: "Scoring Signals", value: "8", color: "text-teal-400" },
          { label: "Candidates", value: "100,000", color: "text-teal-400" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2"
          >
            <span className="text-xs text-slate-500">{label}</span>
            <span className={`text-xs font-semibold font-mono ${color}`}>
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon={Users}
          label="Candidates Evaluated"
          value="100,000"
          sub="Full candidate pool"
          color="bg-blue-600"
        />
        <MetricCard
          icon={Award}
          label="Best Match Score"
          value={rankings[0]?.score.toFixed(4)}
          sub={rankings[0]?.title}
          color="bg-teal-600"
        />
        <MetricCard
          icon={TrendingUp}
          label="Top-5 Avg Score"
          value={top5Avg}
          sub="All ML/AI engineers"
          color="bg-violet-600"
        />
        <MetricCard
          icon={Target}
          label="Domain-fit in Top 10"
          value={`${domainFitTop10}/10`}
          sub="Exact title match"
          color="bg-rose-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">
            Score vs Rank (All 100)
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Sharp drop at top = strong discrimination. Tight band = consistent
            signal quality.
          </p>
          <ScoreDistribution />
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-white mb-1">
            Scoring Weight Breakdown
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            How each of the 8 components contributes to the final composite
            score.
          </p>
          <ComponentBreakdown />
        </div>
      </div>

      {/* Top 10 Cards */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Top 10 Candidates</h2>
        <a
          href="/rankings"
          className="text-xs text-teal-400 hover:text-teal-300"
        >
          View all 100 →
        </a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rankings.slice(0, 10).map((c) => (
          <CandidateCard key={c.candidate_id} candidate={c} />
        ))}
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-slate-400 text-sm">Loading rankings...</p>
      </div>
    </div>
  );
}
