import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"

const TOKENS = [
  { name: "mad", symbol: "MAD", liquidity: 649, trust: "GREEN", address: "0x1" },
  { name: "hari", symbol: "HAR", liquidity: 500, trust: "YELLOW", address: "0x2" },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <NavBar />

      <div className="page">
        <h2>Live Launches</h2>

        <div className="token-grid">
          {TOKENS.map((t) => (
            <div
              key={t.address}
              className="token-card"
              onClick={() => navigate(`/token/${t.address}`)}
            >
              <h3>
                {t.name} ({t.symbol})
              </h3>

              <p className="liquidity">
                Liquidity: {t.liquidity}
              </p>

              <div className={`trust ${t.trust.toLowerCase()}`}>
                TRUST: {t.trust}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
