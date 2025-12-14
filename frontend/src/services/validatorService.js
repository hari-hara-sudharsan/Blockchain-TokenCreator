// src/services/validatorService.js
import { ethers } from "ethers"
import ABI from "../abi/ValidatorStaking.json"
import { VALIDATOR_ADDRESS, INDEXER_URL } from "../config"

// Helper to get contract with signer
function getContract() {
  const provider = new ethers.BrowserProvider(window.ethereum)
  return provider.getSigner().then(
    (s) => new ethers.Contract(VALIDATOR_ADDRESS, ABI.abi, s)
  )
}

// --- NEW: list validators for Validators.jsx ---
export function getValidators() {
  return [
    { id: 1, name: "QIE Validator #1", stake: 1200, status: "Active" },
    { id: 2, name: "SafeMint Node", stake: 850, status: "Active" },
    { id: 3, name: "Community Node", stake: 420, status: "Pending" },
  ]
}
// Stake QIE into validator
export async function stake(amount) {
  const c = await getContract()
  return c.stake({ value: ethers.parseEther(amount) })
}

// Claim accumulated rewards
export async function claim() {
  const c = await getContract()
  return c.claimRewards()
}

// Unstake full amount
export async function unstake() {
  const c = await getContract()
  return c.unstake()
}
