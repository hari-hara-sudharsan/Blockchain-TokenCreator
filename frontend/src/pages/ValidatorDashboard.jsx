const validators = [
  { name: "mainnet", uptime: "99.98%", stake: "1.2M QIE", status: "GREEN" },
  { name: "josh", uptime: "99.12%", stake: "890K QIE", status: "GREEN" },
  { name: "koth", uptime: "97.88%", stake: "410K QIE", status: "GREEN" },
]

export default function ValidatorDashboard() {
  return (
    <div className="page">
      <h2>🛡 Validators</h2>

      <div className="validator-grid">
        {validators.map((v) => (
          <div key={v.name} className="validator-card animate-in">
            
            {/* Header */}
            <div className="validator-header">
              <h3>{v.name}</h3>
              <span className="trust-badge trust-green">
                <span className="dot"></span>
                {v.status}
              </span>
            </div>

            {/* Stats */}
            <div className="validator-stats">
              <div>
                <span className="label">Uptime</span>
                <span className="value">{v.uptime}</span>
              </div>
              <div>
                <span className="label">Stake</span>
                <span className="value">{v.stake}</span>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}