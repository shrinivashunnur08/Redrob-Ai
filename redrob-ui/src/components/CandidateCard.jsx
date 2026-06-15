import { useState } from "react";
import { ChevronDown, ChevronUp, MapPin, Clock, Zap } from "lucide-react";
import ScoreBar from "./ScoreBar";
import SignalBadge from "./SignalBadge";
import { Link } from "react-router-dom";

function getRankColor(rank) {
  if (rank === 1) return "from-yellow-400 to-amber-500";
  if (rank === 2) return "from-slate-300 to-slate-400";
  if (rank === 3) return "from-amber-600 to-orange-700";
  return "from-teal-500 to-cyan-600";
}

export default function CandidateCard({ candidate, compact = false }) {
  const [expanded, setExpanded] = useState(false);
  const rr = parseInt(candidate.responseRate || 0);
  const rrVariant = rr >= 60 ? "green" : rr >= 30 ? "amber" : "red";
  const isActive =
    candidate.lastActive &&
    new Date(candidate.lastActive) > new Date("2026-04-01");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all group">
      <div className="flex items-start gap-4">
        {/* Rank badge */}
        <div
          className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${getRankColor(
            candidate.rank,
          )} flex items-center justify-center font-black text-white text-sm shadow-lg`}
        >
          #{candidate.rank}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                to={`/candidate/${candidate.candidate_id}`}
                className="font-semibold text-white capitalize hover:text-teal-300 transition-colors text-sm leading-tight block"
              >
                {candidate.title || candidate.candidate_id}
              </Link>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {candidate.location || "—"}, {candidate.country || "—"}
                </span>
                <span>{candidate.yoe} yrs exp</span>
                <span className="font-mono text-slate-500">
                  {candidate.candidate_id}
                </span>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-teal-400 font-mono">
                {candidate.score.toFixed(4)}
              </div>
              <div className="text-xs text-slate-500">score</div>
            </div>
          </div>

          {/* Score bar */}
          <div className="mt-3">
            <ScoreBar
              value={candidate.score}
              showLabel={false}
              height="h-1.5"
            />
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {candidate.coreMatch && (
              <SignalBadge
                label={candidate.coreMatch}
                variant="blue"
                icon="🎯"
              />
            )}
            <SignalBadge
              label={`Response ${rr}%`}
              variant={rrVariant}
              icon={rr >= 60 ? "✓" : "!"}
            />
            <SignalBadge
              label={isActive ? "Recently Active" : "Inactive"}
              variant={isActive ? "green" : "red"}
              icon={isActive ? "🟢" : "🔴"}
            />
          </div>

          {/* Expand reasoning */}
          {!compact && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-400 transition-colors"
              >
                {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {expanded ? "Hide reasoning" : "Show reasoning"}
              </button>
              {expanded && (
                <div className="mt-2 text-xs text-slate-400 bg-slate-950 rounded-lg p-3 font-mono leading-relaxed border border-slate-800">
                  {candidate.reasoning}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Score component mini-bars */}
      {!compact && (
        <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-slate-800">
          {[
            { label: "Skills", val: candidate.skills },
            { label: "Career", val: candidate.career },
            { label: "Behavioral", val: candidate.behavioral },
          ].map(({ label, val }) => (
            <div key={label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-300 font-mono">
                  {val?.toFixed(2)}
                </span>
              </div>
              <ScoreBar value={val || 0} showLabel={false} height="h-1" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
