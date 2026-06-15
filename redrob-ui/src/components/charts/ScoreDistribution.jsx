import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import { CANDIDATES } from "../../data/candidates";

export default function ScoreDistribution() {
  const data = CANDIDATES.map((c) => ({ rank: c.rank, score: c.score }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="rank" tick={{ fill: "#64748b", fontSize: 11 }} />
        <YAxis
          domain={[0.65, 0.72]}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={(v) => v.toFixed(2)}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 8,
          }}
          labelStyle={{ color: "#94a3b8", fontSize: 11 }}
          itemStyle={{ color: "#2dd4bf", fontSize: 11 }}
          formatter={(v) => [v.toFixed(4), "Score"]}
          labelFormatter={(l) => `Rank #${l}`}
        />
        <ReferenceLine y={0.7} stroke="#f59e0b" strokeDasharray="4 4" />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#2dd4bf"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
