import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const data = [
  { day: "Day 1", volume: 120 },
  { day: "Day 2", volume: 180 },
  { day: "Day 3", volume: 260 },
  { day: "Day 4", volume: 410 },
  { day: "Day 5", volume: 560 },
]

export default function PriceGraph() {
  return (
    <div className="graph-box">
      <h3>📈 Market Activity</h3>

      <div style={{ width: "100%", height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="volume"
              stroke="#4ade80"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}