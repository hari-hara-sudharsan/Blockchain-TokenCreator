const validators = [
  { name: "Haroon", trust: "GREEN" },
  { name: "mainnet", trust: "YELLOW" },
  { name: "Josh", trust: "RED" },
]

export default function Validators() {
  return (
    <div className="page">
      <h2>Validators</h2>

      <p className="muted">
        ⚠ Demo trust index (on-chain version planned)
      </p>

      <div className="validator-grid">
        {validators.map((v) => (
          <div key={v.name} className="validator-card">
            <h3>{v.name}</h3>

            <div className={`trust ${v.trust.toLowerCase()}`}>
              TRUST: {v.trust}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
