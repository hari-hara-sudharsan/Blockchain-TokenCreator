const proposals = [
  {
    id: 1,
    title: "Increase Minimum LP Lock to 12 Months",
    yes: 72,
    no: 28,
    status: "Active",
  },
  {
    id: 2,
    title: "Enable Community Token Listings",
    yes: 88,
    no: 12,
    status: "Passed",
  },
]

export default function Governance() {
  return (
    <div className="page">
      <h2>🏛 Governance</h2>

      <div className="proposal-list">
        {proposals.map((p) => (
          <div key={p.id} className="proposal-card">
            <h3>{p.title}</h3>

            <div className="vote-bar">
              <div style={{ width: `${p.yes}%` }} className="yes" />
              <div style={{ width: `${p.no}%` }} className="no" />
            </div>

            <p>YES: {p.yes}% | NO: {p.no}%</p>
            <span className="badge">{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}