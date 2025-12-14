import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getToken } from "../services/tokenService"
import PriceChart from "../components/PriceGraph"
import AdoptionChart from "../components/AdoptionChart"
import TrustBadge from "../components/TrustBadge"

export default function TokenPage() {
  const { address } = useParams()
  const [token, setToken] = useState(null)

  useEffect(() => {
    getToken(address).then(setToken).catch(console.error)
  }, [address])

  if (!token) return <p>Loading…</p>

  return (
    <div className="container">
      <h2>{token.name} ({token.symbol})</h2>

      <TrustBadge trust={token.trust} />

      <div className="card">
        <h4>📈 Price Movement</h4>
        <PriceChart data={token.priceSeries} />
      </div>

      <div className="card">
        <h4>👥 Adoption</h4>
        <AdoptionChart count={token.interactions || 1} />
        <p>{token.interactions || 1} unique wallets</p>
      </div>
    </div>
  )
}