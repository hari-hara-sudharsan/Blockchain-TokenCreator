export default function TokenCard({ token }) {
  return (
    <div className="token-card">
      <h3>
        {token.name} <span>({token.symbol})</span>
      </h3>

      <p className="liquidity">
        Liquidity: {token.liquidity}
      </p>

      <div className="trust green">
        TRUST: GREEN
      </div>
    </div>
  )
}
