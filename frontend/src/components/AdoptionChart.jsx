import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function AdoptionChart({ count }) {
  const data = Array.from({ length: count || 1 }, (_, i) => ({
    users: i + 1,
  }))

  return (
    <div style={{ width: "100%", height: 160 }}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis hide />
          <YAxis hide />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#00c853"
            fill="#00c853"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}