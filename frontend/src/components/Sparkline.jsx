import { Sparklines, SparklinesLine } from "react-sparklines"

export default function Sparkline({ series }) {
  if (!Array.isArray(series)) return null

  const data = series
    .map(p => Number(p.price))
    .filter(n => Number.isFinite(n))

  if (data.length < 2) return <div>No data</div>

  return (
    <Sparklines data={data} height={80}>
      <SparklinesLine
        color="#00f2ff"
        style={{ strokeWidth: 2, fill: "none" }}
      />
    </Sparklines>
  )
}