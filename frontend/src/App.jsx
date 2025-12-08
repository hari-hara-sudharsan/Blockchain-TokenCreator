import { useState } from "react"
import { ethers } from "ethers"
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers"
import { Shield, Rocket, Loader2 } from "lucide-react"

// ---------------------- QIE NETWORK CONFIG -----------------------
const QIE_TESTNET = {
  chainId: 1234, // ⚠️ REPLACE WITH ACTUAL QIE TESTNET CHAIN ID
  name: "QIE Testnet",
  rpcUrl: "https://rpc1testnet.qie.digital"
}

// ---------------------- WEB3MODAL SETUP --------------------------
const projectId = "2c2d9760afb21a2b18f3fa79c18e458a"

const metadata = {
  name: "SafeMint",
  description: "Rug-proof token launcher",
  url: "http://localhost:5173",
  icons: ["https://walletconnect.com/walletconnect-logo.png"],
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [QIE_TESTNET],
  projectId,
})

// ---------------------- CONTRACT DATA ----------------------------
const LAUNCHPAD_ADDRESS = "0x65d52515dcE4e8481aD7aA889F1343d8a0FE0B8d"

const launchPadABI = [
  "function launchFairToken(string name,string symbol,uint256 supply,uint256 lockMonths) payable",
  "function trustScore(address) view returns(uint8)",
  "event Launched(address indexed token,uint256 lockTime)"
]

export default function App() {
  const [account, setAccount] = useState("")
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [tokenAddr, setTokenAddr] = useState("")

  // Form values
  const [name, setName] = useState("MyToken")
  const [symbol, setSymbol] = useState("MTK")
  const [supply, setSupply] = useState("1000000")
  const [qieAmount, setQieAmount] = useState("0.5")

  // ---------------------- CONNECT WALLET --------------------------
  const connectWallet = async () => {
    try {
      if (!window.ethereum) return alert("Install QIE Wallet / MetaMask")

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setAccount(address)
      console.log("Connected:", address)
    } catch (err) {
      console.error(err)
      alert("Wallet connection failed")
    }
  }

  // ---------------------- LAUNCH TOKEN ----------------------------
  const launchToken = async () => {
    if (!account) return alert("Connect wallet first")

    setLoading(true)

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()

      const contract = new ethers.Contract(
        LAUNCHPAD_ADDRESS,
        launchPadABI,
        signer
      )

      const totalSupply = ethers.parseEther(supply)
      const qieValue = ethers.parseEther(qieAmount)

      const tx = await contract.launchFairToken(
        name,
        symbol,
        totalSupply,
        6,
        {
          value: qieValue,
          gasLimit: 5_000_000n
        }
      )

      setTxHash(tx.hash)
      console.log("Transaction:", tx.hash)

      const receipt = await tx.wait()

      const event = receipt.logs?.find(l => l.fragment?.name === "Launched")

      if (event) {
        setTokenAddr(event.args[0])
      } else {
        setTokenAddr("Token deployed — check explorer")
      }

      alert("Token launched successfully!")
    } catch (e) {
      console.error(e)
      alert("Launch failed: " + (e.message || e.reason))
    }

    setLoading(false)
  }

  // ---------------------- UI ----------------------------
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Title Section */}
        <div className="text-center mb-12 mt-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            SafeMint
          </h1>
          <p className="text-xl text-gray-300">
            Rug-proof token launcher on QIE Blockchain
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">

          {!account ? (
            <div className="text-center py-12">
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full text-xl flex items-center gap-3 mx-auto shadow-lg"
              >
                <Rocket className="w-7 h-7" />
                Connect QIE Wallet
              </button>
            </div>
          ) : (
            <>
              {/* Connected Address */}
              <div className="flex items-center justify-between mb-8 bg-white/10 rounded-xl p-4">
                <span className="text-sm opacity-80">Connected</span>
                <span className="font-mono text-green-400">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>

              {/* Form */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input
                  placeholder="Token Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="bg-white/10 rounded-xl px-4 py-3"
                />
                <input
                  placeholder="Symbol"
                  value={symbol}
                  onChange={e => setSymbol(e.target.value)}
                  className="bg-white/10 rounded-xl px-4 py-3"
                />
                <input
                  placeholder="Total Supply"
                  value={supply}
                  onChange={e => setSupply(e.target.value)}
                  className="bg-white/10 rounded-xl px-4 py-3"
                />
                <input
                  placeholder="QIE for Liquidity"
                  value={qieAmount}
                  onChange={e => setQieAmount(e.target.value)}
                  className="bg-white/10 rounded-xl px-4 py-3"
                />
              </div>

              {/* Features Box */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 mb-6 border border-green-500/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-10 h-10 text-green-400" />
                  <div>
                    <div className="font-bold text-xl">100% Safe Features</div>
                    <div className="text-sm opacity-90">
                      • 6-month liquidity lock • No pre-mine • Green trust badge • 1% burn tax
                    </div>
                  </div>
                </div>
              </div>

              {/* Launch Button */}
              <button
                onClick={launchToken}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-2xl py-6 rounded-2xl flex items-center justify-center gap-4 shadow-2xl disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-8 h-8" />
                    LAUNCH RUG-PROOF TOKEN
                  </>
                )}
              </button>

              {/* Explorer Link */}
              {txHash && (
                <div className="mt-6 text-center space-y-2">
                  <a
                    href={`https://testnet.qie.digital/tx/${txHash}`}
                    target="_blank"
                    className="text-cyan-400 underline"
                  >
                    View Transaction
                  </a>
                  {tokenAddr && (
                    <div className="text-sm text-gray-300">
                      <p>Token Address:</p>
                      <p className="font-mono text-green-400">{tokenAddr}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-center mt-12 text-gray-400">
          Built for QIE Blockchain Hackathon • 100% open source • Zero rugs allowed
        </div>
      </div>
    </div>
  )
}

/*

import { useState } from 'react'
import { ethers } from 'ethers'
import { Shield, Rocket, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

// UPDATE WITH YOUR DEPLOYED LAUNCHPAD ADDRESS
const LAUNCHPAD_ADDRESS = "0x65d52515dcE4e8481aD7aA889F1343d8a0FE0B8d" // e.g., 0x123...

const launchPadABI = [
  "function launchFairToken(string name, string symbol, uint256 totalSupply, uint256 lockMonths) payable",
  "function trustScore(address) view returns (uint8)",
  "event Launched(address indexed token, uint256 lockTime)"
]

export default function App() {
  const [account, setAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState('')
  const [tokenAddr, setTokenAddr] = useState('')

  // Form states
  const [name, setName] = useState('MyToken')
  const [symbol, setSymbol] = useState('MTK')
  const [supply, setSupply] = useState('1000000')
  const [qieAmount, setQieAmount] = useState('0.5')

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const addr = await signer.getAddress()
        setAccount(addr)
        // Switch to QIE Testnet (Chain ID 1983)
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x7B7' }] // 1983 in hex
        })
      } catch (e) {
        console.error(e)
        alert("Connection failed. Add QIE Testnet to MetaMask/QIE Wallet first.")
      }
    } else {
      alert("Install MetaMask or QIE Wallet!")
    }
  }

  const launchToken = async () => {
    if (!account) return alert("Connect wallet first")
    setLoading(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(LAUNCHPAD_ADDRESS, launchPadABI, signer)

      const totalSupply = ethers.parseEther(supply)
      const qieValue = ethers.parseEther(qieAmount)

      const tx = await contract.launchFairToken(
        name,
        symbol,
        totalSupply,
        6, // 6 months lock
        { value: qieValue, gasLimit: 5000000n }
      )

      setTxHash(tx.hash)
      const receipt = await tx.wait()
      setTokenAddr(receipt.logs[0]?.address || 'Check explorer')

      // Fetch trust score
      const score = await contract.trustScore(tokenAddr)
      const badge = score === 2 ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <AlertCircle className="w-5 h-5 text-yellow-400" />
      alert(`Launched! Trust Badge: ${badge === 2 ? 'GREEN (Safe!)' : 'Yellow'}`)
    } catch (e) {
      console.error(e)
      alert("Launch failed: " + e.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 to-black">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            SafeMint
          </h1>
          <p className="text-xl text-gray-300">Rug-proof token launcher on QIE Blockchain</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {!account ? (
            <div className="text-center py-12">
              <button
                onClick={connectWallet}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-10 rounded-full text-xl flex items-center gap-3 mx-auto shadow-lg"
              >
                <Rocket className="w-7 h-7" />
                Connect QIE Wallet
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-8 bg-white/10 rounded-xl p-4">
                <span className="text-sm opacity-80">Connected</span>
                <span className="font-mono text-green-400">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <input placeholder="Token Name" value={name} onChange={e => setName(e.target.value)} className="bg-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400" />
                <input placeholder="Symbol" value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400" />
                <input placeholder="Total Supply" value={supply} onChange={e => setSupply(e.target.value)} className="bg-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400" />
                <input placeholder="tQIE for Liquidity" value={qieAmount} onChange={e => setQieAmount(e.target.value)} className="bg-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-400" />
              </div>

              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-6 mb-6 border border-green-500/50">
                <div className="flex items-center gap-3">
                  <Shield className="w-10 h-10 text-green-400" />
                  <div>
                    <div className="font-bold text-xl">100% Safe Features</div>
                    <div className="text-sm opacity-90">
                      • 6-month liquidity lock • No pre-mine • Green trust badge • 1% burn tax
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={launchToken}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-2xl py-6 rounded-2xl flex items-center justify-center gap-4 shadow-2xl disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Rocket className="w-8 h-8" />
                    LAUNCH RUG-PROOF TOKEN
                  </>
                )}
              </button>

              {txHash && (
                <div className="mt-6 text-center">
                  <a href={`https://testnet.qie.digital/tx/${txHash}`} target="_blank" className="text-cyan-400 underline">
                    View on Explorer
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        <div className="text-center mt-12 text-gray-400">
          Built for QIE Blockchain Hackathon • 100% open source • Zero rugs allowed
        </div>
      </div>
    </div>
  )
}*/