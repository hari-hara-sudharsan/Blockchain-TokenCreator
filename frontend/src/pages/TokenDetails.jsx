import { useParams } from "react-router-dom"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const chartData = [
  { day: "Day 1", value: 120 },
  { day: "Day 2", value: 180 },
  { day: "Day 3", value: 260 },
  { day: "Day 4", value: 400 },
  { day: "Day 5", value: 560 },
]

export default function TokenDetails() {
  const { address } = useParams()

  return (
    <div className="page">
      <h2>📊 Token Details</h2>

      <p className="muted">Token Address</p>
      <code>{address}</code>

      {/* Trust Info */}
      <div className="trust-box">
        <div className="trust-item green">LP Locked</div>
        <div className="trust-item green">No Mint Authority</div>
        <div className="trust-item green">Governance Enabled</div>
      </div>

      {/* Graph */}
      <div className="graph-card">
        <h3>Liquidity Growth</h3>

        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}