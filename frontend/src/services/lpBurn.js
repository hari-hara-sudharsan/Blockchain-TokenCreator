import { ethers } from "ethers"
import LPBurnerABI from "../abi/LPBurner.json"
import { LP_BURNER_ADDRESS } from "../config"

export async function burnLP(pairAddress) {
  if (!window.ethereum) throw new Error("Wallet not found")

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const burner = new ethers.Contract(
    LP_BURNER_ADDRESS,
    LPBurnerABI,
    signer
  )

  const tx = await burner.burn(pairAddress)
  return await tx.wait()
}