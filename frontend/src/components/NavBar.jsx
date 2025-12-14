import { NavLink } from "react-router-dom"
import { useWallet } from "../context/WalletContext"

export default function NavBar() {
  const { account, connect } = useWallet()

  return (
    <nav className="nav">
      {/* Left: Brand */}
      <div className="logo">SafeMint™</div>

      {/* Center: Navigation */}
      <div className="nav-links">
        <NavLink to="/launchtoken" end>
          Launch Token
        </NavLink>
        <NavLink to="/validators">
          Validators
        </NavLink>
        <NavLink to="/governance">
          Governance
        </NavLink>
      </div>

      {/* Right: Wallet */}
      <button className="btn" onClick={connect}>
        {account
          ? `${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>
    </nav>
  )
}
