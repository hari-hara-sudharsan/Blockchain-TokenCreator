import { useState } from "react"
import { launchToken } from "../services/launchService"

export default function LaunchPage() {
  const [form, setForm] = useState({
    name: "",
    symbol: "",
    supply: "",
    lockMonths: "6",
    liquidityEth: ""
  })

  function update(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  async function handleLaunch() {
    try {
      await launchToken(form)
      alert("🚀 Token launched successfully")
    } catch (err) {
      alert(err.message || "Launch failed")
    }
  }

  return (
    <div className="page">
      <h2>Launch Token</h2>

      <div className="launch-card horizontal">
        <div className="form-row">
          <label>Token Name</label>
          <input name="name" value={form.name} onChange={update} />
        </div>

        <div className="form-row">
          <label>Symbol</label>
          <input name="symbol" value={form.symbol} onChange={update} />
        </div>

        <div className="form-row">
          <label>Total Supply</label>
          <input name="supply" value={form.supply} onChange={update} />
        </div>

        <div className="form-row">
          <label>Lock Months</label>
          <input name="lockMonths" value={form.lockMonths} onChange={update} />
        </div>

        <div className="form-row">
          <label>Liquidity (ETH)</label>
          <input
            name="liquidityEth"
            value={form.liquidityEth}
            onChange={update}
          />
        </div>

        <button className="primary-btn" onClick={handleLaunch}>
          Launch Token
        </button>
      </div>
    </div>
  )
}
