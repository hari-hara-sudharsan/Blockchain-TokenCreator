// import { createWeb3Modal } from '@web3modal/wagmi/react'
// import { http, createConfig } from 'wagmi'
// import { injected, walletConnect } from 'wagmi/connectors'

// /* ============================
//    WalletConnect Project ID
//    ============================ */
// const projectId = 'c388043e49869b19bee7f8a7313486bc'

// /* ============================
//    QIE Testnet Chain
//    ============================ */
// export const qieTestnet = {
//   id: 1983,
//   name: 'QIE Testnet',
//   nativeCurrency: {
//     name: 'tQIE',
//     symbol: 'tQIE',
//     decimals: 18,
//   },
//   rpcUrls: {
//     default: {
//       http: [
//         'https://testnetqierpc1.digital',
//         // fallback RPCs (VERY IMPORTANT)
//         'https://rpc.ankr.com/eth_goerli'
//       ],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'QIE Explorer',
//       url: 'https://testnet.qie.digital',
//     },
//   },
// }

// /* ============================
//    Wagmi Config (HARDENED)
//    ============================ */
// export const config = createConfig({
//   chains: [qieTestnet],

//   // 🔒 CRITICAL FIXES
//   disableEns: true,               // ← Fix ENS crash
//   pollingInterval: 12_000,        // ← Reduce RPC spam

//   transports: {
//     [qieTestnet.id]: http({
//       timeout: 7_000,             // ← Prevent UI freeze
//       retryCount: 1,              // ← No infinite retry
//     }),
//   },

//   connectors: [
//     injected({ shimDisconnect: true }),

//     walletConnect({
//       projectId,
//       showQrModal: true,
//       metadata: {
//         name: 'QIEDEX',
//         description: 'Trust-first Token Launchpad',
//         url: 'http://localhost:5173',   // ← OK for hackathon
//         icons: ['https://walletconnect.com/walletconnect-logo.png'],
//       },
//     }),
//   ],
// })

// /* ============================
//    Web3Modal (NO ANALYTICS CRASH)
//    ============================ */
// export const modal = createWeb3Modal({
//   wagmiConfig: config,
//   projectId,
//   themeMode: 'dark',

//   // 🔕 Disable analytics spam (NO deployed domain needed)
//   enableAnalytics: false,
//   enableOnramp: false,

//   featuredWalletIds: [],
//   includeWalletIds: [],
// })

// import { createConfig, http } from 'wagmi'
// import { injected } from 'wagmi/connectors'

// const qieTestnet = {
//   id: 1983,
//   name: 'QIE Testnet',
//   nativeCurrency: {
//     name: 'QIE',
//     symbol: 'QIE',
//     decimals: 18
//   },
//   rpcUrls: {
//     default: {
//       http: ['https://rpc1testnet.qie.digital']
//     }
//   }
// }

// export const config = createConfig({
//   chains: [qieTestnet],
//   transports: {
//     [qieTestnet.id]: http()
//   },
//   connectors: [
//     injected() // MetaMask ONLY — stable, no cloud
//   ]
// })

import { createContext, useContext, useState } from "react"

const WalletContext = createContext()

export function WalletProvider({ children }) {
  const [account, setAccount] = useState(null)

  const connect = async () => {
    if (!window.ethereum) return alert("Wallet not found")
    const [acc] = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(acc)
  }

  return (
    <WalletContext.Provider value={{ account, connect }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWallet = () => useContext(WalletContext)