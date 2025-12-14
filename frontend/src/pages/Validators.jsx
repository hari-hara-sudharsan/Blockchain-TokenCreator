const validators = [
  { name: "Haroon", trust: "GREEN" },
  { name: "mainnet", trust: "GREEN" },
  { name: "Josh", trust: "GREEN" },
]

export default function Validators() {
  return (
    <div>
      <h2>Validators</h2>
      <p>⚠ Demo trust index (on-chain version planned)</p>

      {validators.map(v => (
        <div key={v.name}>
          {v.name} <span className="trust green">{v.trust}</span>
        </div>
      ))}
    </div>
  )
}