import { Link } from "react-router-dom"

export default function TokenList({ tokens = [] }) {
  return (
    <div className="token-list">
      {tokens.map(token => (
        <Link
          key={token.tokenAddress}
          to={`/token/${token.tokenAddress}`}
          className="token-card"
        >
          <h3>{token.name} ({token.symbol})</h3>
          <p>Liquidity: {token.liquidityQIE}</p>
        </Link>
      ))}
    </div>
  )
}