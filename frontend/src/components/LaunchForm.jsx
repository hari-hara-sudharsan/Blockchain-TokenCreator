import React, { useState } from 'react'
import { ethers } from 'ethers'
import { Rocket, Loader2 } from 'lucide-react'

// Replace with your deployed SafeMintLaunchPad contract address
const LAUNCHPAD_ADDRESS = '0xYourLaunchPadAddressHere'

// LaunchPad contract ABI (function signatures)
const LAUNCHPAD_ABI = [
  'function launchFairToken(string name, string symbol, uint256 totalSupply, uint256 lockMonths) payable',
  'event Launched(address indexed token, uint256 lockTime)'
]

export default function LaunchForm({ provider, onLaunched }) {
  const [name, setName] = useState('MyToken')
  const [symbol, setSymbol] = useState('MTK')
  const [supply, setSupply] = useState('1000000')
  const [qie, setQie] = useState('0.5')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLaunch = async () => {
    if (!provider) {
      setError('Please connect wallet first')
      return
    }

    if (!name.trim() || !symbol.trim() || !supply || !qie) {
      setError('All fields are required')
      return
    }

    if (LAUNCHPAD_ADDRESS === '0xYourLaunchPadAddressHere') {
      setError('LaunchPad address not configured. Deploy the contract first.')
      return
    }

    setError('')
    setLoading(true)

    try {
      const signer = provider.getSigner()
      const contract = new ethers.Contract(LAUNCHPAD_ADDRESS, LAUNCHPAD_ABI, signer)

      const totalSupply = ethers.parseEther(supply)
      const qieValue = ethers.parseEther(qie)

      console.log('Launching token:', { name, symbol, totalSupply, qieValue })

      const tx = await contract.launchFairToken(
        name,
        symbol,
        totalSupply,
        6, // 6 months lock
        { value: qieValue, gasLimit: 5_000_000n }
      )

      console.log('Transaction hash:', tx.hash)
      onLaunched?.(tx.hash)

      const receipt = await tx.wait()
      console.log('Transaction confirmed:', receipt)

      // Attempt to extract the Launched event and get token address
      if (receipt && receipt.logs) {
        try {
          const iface = new ethers.Interface(LAUNCHPAD_ABI)
          const log = receipt.logs
            .map(l => {
              try {
                return iface.parseLog(l)
              } catch {
                return null
              }
            })
            .find(x => x && x.name === 'Launched')

          if (log && log.args && log.args[0]) {
            console.log('Token address:', log.args[0])
            onLaunched?.(null, log.args[0])
          }
        } catch (e) {
          console.warn('Could not extract token address from event:', e)
        }
      }

      setName('MyToken')
      setSymbol('MTK')
      setSupply('1000000')
      setQie('0.5')
    } catch (e) {
      const errorMsg = e?.reason || e?.message || String(e)
      console.error('Launch error:', e)
      setError(`Launch failed: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
      <h3 className="text-2xl font-bold mb-6 text-white">Launch Your Token</h3>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Token Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="MyToken"
            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Symbol</label>
          <input
            type="text"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
            placeholder="MTK"
            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Total Supply</label>
          <input
            type="text"
            value={supply}
            onChange={e => setSupply(e.target.value)}
            placeholder="1000000"
            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            disabled={loading}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">QIE for Liquidity</label>
          <input
            type="text"
            value={qie}
            onChange={e => setQie(e.target.value)}
            placeholder="0.5"
            className="w-full p-3 rounded bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
            disabled={loading}
          />
        </div>
      </div>

      <button
        onClick={handleLaunch}
        disabled={loading}
        className="w-full py-4 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Launching...
          </>
        ) : (
          <>
            <Rocket className="w-5 h-5" />
            Launch Token
          </>
        )}
      </button>
    </div>
  )
}