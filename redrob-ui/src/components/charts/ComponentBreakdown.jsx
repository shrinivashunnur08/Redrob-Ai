import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const weights = [
  { name: "Skills", weight: 28, color: "#2dd4bf" },
  { name: "Career", weight: 24, color: "#22d3ee" },
  { name: "Behavioral", weight: 22, color: "#818cf8" },
  { name: "Experience", weight: 10, color: "#a78bfa" },
  { name: "Location", weight: 6, color: "#fb923c" },
  { name: "Education", weight: 4, color: "#facc15" },
  { name: "Anti-Svc", weight: 4, color: "#f87171" },
  { name: "Anti-Fraud", weight: 2, color: "#94a3b8" },
];

export default function ComponentBreakdown() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={weights}
        layout="vertical"
        margin={{ left: 10, right: 30 }}
      >
        <XAxis
          type="number"
          domain={[0, 35]}
          tick={{ fill: "#64748b", fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          width={72}
        />
        <Tooltip
          contentStyle={{
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: 8,
          }}
          itemStyle={{ color: "#2dd4bf", fontSize: 11 }}
          formatter={(v) => [`${v}%`, "Weight"]}
        />
        <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
          {weights.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
