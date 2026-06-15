import { useState, useMemo } from "react";
import { useRankings } from "../hooks/useRankings";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import ScoreBar from "../components/ScoreBar";
import SignalBadge from "../components/SignalBadge";

export default function RankingTable() {
  const { rankings, loading } = useRankings();
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rank");
  const [sortDir, setSortDir] = useState("asc");

  function toggleSort(col) {
    if (sortBy === col) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortBy(col);
      setSortDir("asc");
    }
  }

  const countries = useMemo(() => {
    const all = [
      ...new Set(rankings.map((r) => r.country).filter(Boolean)),
    ].sort();
    return ["All", ...all];
  }, [rankings]);

  const filtered = useMemo(() => {
    let result = rankings.filter((r) => {
      const matchSearch =
        !search ||
        r.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.candidate_id?.toLowerCase().includes(search.toLowerCase()) ||
        r.city?.toLowerCase().includes(search.toLowerCase());
      const matchCountry =
        countryFilter === "All" || r.country === countryFilter;
      return matchSearch && matchCountry;
    });
    result = [...result].sort((a, b) => {
      let av = a[sortBy],
        bv = b[sortBy];
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return result;
  }, [rankings, search, countryFilter, sortBy, sortDir]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 pt-20">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          All 100 Ranked Candidates
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Showing {filtered.length} of {rankings.length} candidates
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, ID, or location..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors appearance-none"
          >
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                {[
                  { label: "Rank", key: "rank" },
                  { label: "Candidate", key: "title" },
                  { label: "Location", key: "city" },
                  { label: "Exp", key: "yoe" },
                  { label: "Score", key: "score" },
                  { label: "Response", key: "responseRate" },
                  { label: "Status", key: null },
                ].map(({ label, key }) => (
                  <th
                    key={label}
                    onClick={() => key && toggleSort(key)}
                    className={`text-left px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors
        ${key ? "cursor-pointer hover:text-white" : ""}
        ${sortBy === key ? "text-teal-400" : "text-slate-500"}`}
                  >
                    {label}
                    {sortBy === key && (
                      <span className="ml-1">
                        {sortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const rr = parseInt(r.responseRate || 0);
                const rrVariant =
                  rr >= 60 ? "green" : rr >= 30 ? "amber" : "red";
                const isActive =
                  r.lastActive &&
                  new Date(r.lastActive) > new Date("2026-04-01");
                const isDomainFit =
                  /ml|ai|machine learning|data scientist|search|recommendation/i.test(
                    r.title,
                  );

                return (
                  <tr
                    key={r.candidate_id}
                    className={`border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors ${
                      isDomainFit ? "bg-teal-950/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={`font-bold font-mono text-sm ${r.rank <= 3 ? "text-teal-400" : "text-slate-400"}`}
                      >
                        #{r.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/candidate/${r.candidate_id}`}
                        className="font-medium text-white hover:text-teal-300 transition-colors capitalize block"
                      >
                        {r.title || r.candidate_id}
                      </Link>
                      <span className="text-xs text-slate-500 font-mono">
                        {r.candidate_id}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {r.location}
                      <br />
                      {r.country}
                    </td>
                    <td className="px-4 py-3 text-slate-300 text-xs font-mono">
                      {r.yoe}y
                    </td>
                    <td className="px-4 py-3 min-w-[120px]">
                      <div className="font-mono text-teal-400 text-xs mb-1">
                        {r.score.toFixed(4)}
                      </div>
                      <ScoreBar
                        value={r.score}
                        showLabel={false}
                        height="h-1"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <SignalBadge label={`${rr}%`} variant={rrVariant} />
                    </td>
                    <td className="px-4 py-3">
                      <SignalBadge
                        label={isActive ? "Active" : "Inactive"}
                        variant={isActive ? "green" : "red"}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
