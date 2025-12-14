import { useWallet } from "../context/WalletContext"

export default function NavBar() {
  const { account, connect } = useWallet()

  return (
    <nav className="w-full bg-[#fff5ed] border-b border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="text-xl font-extrabold tracking-tight text-black">
          SafeMint<span className="text-black/60">™</span>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-8 text-sm font-medium text-black/70">
          <a href="/" className="hover:text-black transition">
            Launches
          </a>
          <a href="/validators" className="hover:text-black transition">
            Validators
          </a>
          <a href="/governance" className="hover:text-black transition">
            Governance
          </a>
        </div>

        {/* Wallet Button */}
        <button
          onClick={connect}
          className="px-5 py-2 rounded-full bg-black text-white text-sm font-semibold
                     hover:bg-black/90 transition shadow-sm"
        >
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>

      </div>
    </nav>
  )
}