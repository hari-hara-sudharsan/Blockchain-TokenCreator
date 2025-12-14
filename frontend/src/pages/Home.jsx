import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getAllTokens } from "../services/tokenService"

export default function Home() {
  const [tokens, setTokens] = useState([])

  useEffect(() => {
    setTokens(getAllTokens())
  }, [])

  return (
    <div className="page">
      <h2>🚀 Launches</h2>

      <div className="token-row">
        {tokens.map((t) => (
          <Link key={t.address} to={`/token/${t.address}`}>
            <div className="token-card">
              <h3>
                {t.name} <span>{t.symbol}</span>
              </h3>
              <p>Liquidity: {t.liquidity}</p>
              <span className="badge green">{t.trust}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}