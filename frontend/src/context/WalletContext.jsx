import { createContext, useContext, useEffect, useState } from "react"

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null)

  const connect = async () => {
    if (!window.ethereum) {
      alert("Wallet not found")
      return
    }
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(accounts[0])
  }

  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.request({ method: "eth_accounts" }).then((a) => {
      if (a.length) setAccount(a[0])
    })
  }, [])

  return (
    <WalletContext.Provider value={{ account, connect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)