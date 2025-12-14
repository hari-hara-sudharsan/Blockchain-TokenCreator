import TokenCard from "../components/TokenCard"
import NavBar from "../components/NavBar"



const TOKENS = [
  { name: "mad", symbol: "MAD", liquidity: 649, address: "0x1" },
  { name: "hari", symbol: "HAR", liquidity: 500, address: "0x2" },
]

export default function Home() {
  return (
    <>
      <NavBar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* Section title */}
        <h2 className="text-7xl font-bold text-black mb-6">
          Live Launches
        </h2>

        {/* Token Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOKENS.map((t) => (
            <TokenCard key={t.address} token={t} />
          ))}
        </div>

      </div>
    </>
  )
}