const proposals = [
  {
    id: 1,
    title: "Increase Minimum LP Lock to 12 Months",
    yes: 72,
    no: 28,
    status: "ACTIVE",
  },
  {
    id: 2,
    title: "Enable Community Token Listings",
    yes: 88,
    no: 12,
    status: "PASSED",
  },
]

export default function Governance() {
  return (
    <div className="page">
      <h2>🏛 Governance</h2>

      <div className="proposal-grid">
        {proposals.map((p) => (
          <div key={p.id} className="proposal-card">
            <h3>{p.title}</h3>

            {/* Vote bar */}
            <div className="vote-bar">
              <div
                className="vote yes"
                style={{ width: `${p.yes}%` }}
              />
              <div
                className="vote no"
                style={{ width: `${p.no}%` }}
              />
            </div>

            <div className="proposal-footer">
              <span className="vote-text">
                YES: {p.yes}% &nbsp;|&nbsp; NO: {p.no}%
              </span>

              <span className={`status ${p.status.toLowerCase()}`}>
                {p.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
