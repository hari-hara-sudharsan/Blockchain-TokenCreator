import { ethers } from "ethers"
import ValidatorABI from "../abi/ValidatorStaking.json"
import { VALIDATOR_ADDRESS } from "../config"

export async function stake(amount) {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(
    VALIDATOR_ADDRESS,
    ValidatorABI.abi,
    signer
  )

  const tx = await contract.stake({
    value: ethers.parseEther(amount)
  })

  return await tx.wait()
}

export async function claimRewards() {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const contract = new ethers.Contract(
    VALIDATOR_ADDRESS,
    ValidatorABI.abi,
    signer
  )

  const tx = await contract.claimRewards()
  return await tx.wait()
}

export async function getValidator(address) {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const contract = new ethers.Contract(
    VALIDATOR_ADDRESS,
    ValidatorABI.abi,
    provider
  )

  return await contract.validators(address)
}