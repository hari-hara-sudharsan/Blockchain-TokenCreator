// import { useState } from "react"
// import { launchToken } from "../services/launchService"

// export default function LaunchPage() {
//   const [form, setForm] = useState({
//     name: "",
//     symbol: "",
//     supply: "",
//     lockMonths: 6,
//     liquidityETH: "0.1"
//   })

//   return (
//     <div>
//       <h2>Launch Token</h2>

//       <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
//       <input placeholder="Symbol" onChange={e => setForm({...form, symbol: e.target.value})} />
//       <input placeholder="Supply" onChange={e => setForm({...form, supply: e.target.value})} />
//       <input placeholder="Liquidity (ETH)" onChange={e => setForm({...form, liquidityETH: e.target.value})} />

//       <button
//         onClick={async () => {
//           try {
//             await launchToken(form)
//             alert("🚀 Token launched")
//           } catch (e) {
//             console.error(e)
//             alert(e.message)
//           }
//         }}
//       >
//         🚀 Launch Token
//       </button>
//     </div>
//   )
// }

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
    console.log("🧪 FORM OBJECT:", form)

    try {
      await launchToken(form)
      alert("🚀 Token launched successfully")
    } catch (err) {
      console.error(err)
      alert(err.message || "Launch failed")
    }
  }

  return (
    <div className="container">
      <h2>🚀 Launch Token</h2>

      <input
        name="name"
        placeholder="Token Name"
        value={form.name}
        onChange={update}
      />

      <input
        name="symbol"
        placeholder="Symbol"
        value={form.symbol}
        onChange={update}
      />

      <input
        name="supply"
        placeholder="Total Supply (e.g. 1000000)"
        value={form.supply}
        onChange={update}
      />

      <input
        name="lockMonths"
        placeholder="Lock Months (min 6)"
        value={form.lockMonths}
        onChange={update}
      />

      <input
        name="liquidityEth"
        placeholder="Liquidity ETH (e.g. 0.1)"
        value={form.liquidityEth}
        onChange={update}
      />

      <button onClick={handleLaunch}>
        🚀 Launch Token
      </button>
    </div>
  )
}