import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { launchToken } from "../services/launchService"

export default function LaunchPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: "",
    symbol: "",
    supply: "",
    lockMonths: "6",
    liquidityEth: "",
  })

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleLaunch() {
    try {
      const tokenAddress = await launchToken(form)
      alert("🚀 Token launched successfully")
      navigate(`/token/${tokenAddress}`) // ✅ ADD
    } catch (err) {
      alert(err.message || "Launch failed")
    }
  }

  return (
    <div className="page">
      <h2>Launch Token</h2>

      <div className="launch-card horizontal">
        <input name="name" placeholder="Token Name" onChange={update} />
        <input name="symbol" placeholder="Symbol" onChange={update} />
        <input name="supply" placeholder="Supply" onChange={update} />
        <input name="lockMonths" value={form.lockMonths} />
        <input
          name="liquidityEth"
          placeholder="Liquidity (ETH)"
          onChange={update}
        />

        <button className="primary-btn" onClick={handleLaunch}>
          Launch Token
        </button>
      </div>
    </div>
  )
}
