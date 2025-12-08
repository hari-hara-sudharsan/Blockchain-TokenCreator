import { useState, useEffect } from 'react'
import { ethers } from 'ethers'


export default function useWallet() {
const [address, setAddress] = useState('')
const [chainId, setChainId] = useState(null)
const [provider, setProvider] = useState(null)


useEffect(() => {
if (typeof window === 'undefined') return
if (window.ethereum) {
const p = new ethers.BrowserProvider(window.ethereum)
setProvider(p)


window.ethereum.on && window.ethereum.on('accountsChanged', (accounts) => {
setAddress(accounts[0] || '')
})
window.ethereum.on && window.ethereum.on('chainChanged', (hex) => {
setChainId(Number(hex))
})
}
}, [])


const connect = async () => {
if (!window.ethereum) throw new Error('No injected wallet found')
await window.ethereum.request({ method: 'eth_requestAccounts' })
const p = new ethers.BrowserProvider(window.ethereum)
setProvider(p)
const s = await p.getSigner()
const addr = await s.getAddress()
setAddress(addr)
try {
const network = await p.getNetwork()
setChainId(network.chainId)
} catch (e) {
console.warn(e)
}
return addr
}


const disconnect = async () => {
// Browser wallets don't expose programmatic disconnect; clear local state
}