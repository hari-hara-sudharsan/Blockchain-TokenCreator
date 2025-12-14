import { useNavigate } from "react-router-dom"

export default function TokenCard({ token }) {
  const navigate = useNavigate()

  return (
    <div
      className="token-card"
      onClick={() => navigate(`/token/${token.address}`)}
    >
      <h3>{token.name} ({token.symbol})</h3>
      <p>Liquidity: {token.liquidity}</p>
      <span className="trust green">TRUST: GREEN</span>
    </div>
  )
}