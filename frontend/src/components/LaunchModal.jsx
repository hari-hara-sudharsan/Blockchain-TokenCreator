import { useState } from "react"
import { launchToken } from "../services/launchService"

export default function LaunchModal({ onClose }) {
  const [loading, setLoading] = useState(false)

  async function handleLaunch(e) {
    e.preventDefault()
    setLoading(true)

    try {
      await launchToken({
        name: e.target.name.value,
        symbol: e.target.symbol.value,
        totalSupply: e.target.supply.value,
        liquidityAmount: e.target.liquidity.value,
        lockDays: e.target.lock.value
      })

      alert("🚀 Token launched!")
      onClose()
    } catch (err) {
      console.error(err)
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleLaunch}>
      <input name="name" placeholder="Token Name" required />
      <input name="symbol" placeholder="Symbol" required />
      <input name="supply" placeholder="Total Supply" required />
      <input name="liquidity" placeholder="Liquidity (tQIE)" required />
      <input name="lock" placeholder="Lock Days" required />

      <button disabled={loading}>
        {loading ? "Launching..." : "Launch"}
      </button>
    </form>
  )
}