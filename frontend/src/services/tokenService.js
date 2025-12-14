export function getAllTokens() {
  const local = JSON.parse(localStorage.getItem("tokens") || "[]")

  const demo = [
    {
      address: "0x123",
      name: "mad",
      symbol: "MAD",
      liquidity: 649,
      trust: "GREEN",
    },
    {
      address: "0x456",
      name: "hari",
      symbol: "HAR",
      liquidity: 500,
      trust: "GREEN",
    },
  ]

  return [...local, ...demo]
}