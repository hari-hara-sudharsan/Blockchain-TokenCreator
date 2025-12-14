// // frontend/src/services/launchService.jsx
// import { INDEXER_URL, FACTORY_ADDRESS, FACTORY_ABI } from "../config";

// /**
//  * helper: ask injected wallet for signer (QIE Wallet / window.ethereum)
//  */
// export async function getSignerProvider() {
//   if (window.ethereum) {
//     const { ethers } = await import("ethers");
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     await provider.send("eth_requestAccounts", []);
//     const signer = await provider.getSigner();
//     return { provider, signer };
//   }
//   return null;
// }

// /**
//  * Try to launch on-chain using your factory contract.
//  * Expects FACTORY_ADDRESS and FACTORY_ABI defined in config.
//  * Returns { tokenAddress, txHash, ... } on success.
//  */
// export async function launchOnChain({ tokenAddress, supply, liquidity, unlock }) {
//   // require wallet
//   if (!window.ethereum) throw new Error("QIE Wallet not detected");
//   const { ethers } = await import("ethers");
//   const provider = new ethers.BrowserProvider(window.ethereum);
//   await provider.send("eth_requestAccounts", []);
//   const signer = await provider.getSigner();

//   if (!FACTORY_ADDRESS || !FACTORY_ABI) throw new Error("Factory config missing");

//   const factory = new ethers.Contract(FACTORY_ADDRESS, FACTORY_ABI, signer);

//   // IMPORTANT: your factory method name — if you deployed a real factory, change method below
//   let tx;
//   try {
//     if (typeof factory.launch === "function") {
//       tx = await factory.launch(tokenAddress, supply, liquidity, unlock);
//     } else if (typeof factory.createLaunch === "function") {
//       tx = await factory.createLaunch(tokenAddress, supply, liquidity, unlock);
//     } else if (typeof factory.emitTestLaunch === "function") {
//       tx = await factory.emitTestLaunch(tokenAddress, supply, liquidity, unlock);
//     } else {
//       throw new Error("No known factory method found: expected launch/createLaunch/emitTestLaunch");
//     }
//     const receipt = await tx.wait();
//     // attempt to parse events for Launched event
//     const evt = receipt.events?.find(e => e.event === "Launched");
//     let parsed = {};
//     if (evt) {
//       parsed = {
//         tokenAddress: evt.args?.token || tokenAddress,
//         owner: evt.args?.owner,
//         totalSupply: Number(evt.args?.supply || supply),
//         liquidityQIE: Number(evt.args?.liquidity || liquidity),
//         unlockTime: Number(evt.args?.unlock || unlock),
//         txHash: receipt.transactionHash
//       };
//     } else {
//       parsed = { 
//         tokenAddress, 
//         txHash: receipt.transactionHash, 
//         totalSupply: supply, 
//         liquidityQIE: liquidity, 
//         unlockTime: unlock 
//       };
//     }
//     return parsed;
//   } catch (err) {
//     throw err;
//   }
// }

// /**
//  * Simulator: POST token to indexer for demo mode
//  */
// export async function simulateLaunch(name, symbol, totalSupply = 1000000, realAsset = false, imageCid = "") {
//   const fakeAddress = "0xSIM" + Math.random().toString(16).slice(2, 10);
//   const payload = {
//     tokenAddress: fakeAddress,
//     name,
//     symbol,
//     totalSupply: Number(totalSupply) || 1000000,
//     liquidityQIE: Math.floor(Math.random() * 900) + 100,
//     lockMonths: 6,
//     unlockTime: Math.floor(Date.now() / 1000) + 30 * 86400 * 6,
//     trustScore: 2,
//     owner: "0xSIMOWNER",
//     imageCid
//   };

//   const res = await fetch(`${INDEXER_URL}/tokens`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   });
  
//   if (!res.ok) {
//     const txt = await res.text();
//     throw new Error("Indexer rejected launch: " + txt);
//   }
//   return { tokenAddress: fakeAddress, ...payload };
// }

// /**
//  * Unified helper the UI should call.
//  * Tries on-chain first, falls back to simulation.
//  */
// export async function unifiedLaunch({ name, symbol, totalSupply, lockMonths, realAsset = false }) {
//   // create local payload
//   const payloadLocal = {
//     name, 
//     symbol, 
//     totalSupply: Number(totalSupply) || 1000000,
//     liquidityQIE: Math.floor(Math.random() * 900) + 100,
//     lockMonths: Number(lockMonths) || 6,
//     unlockTime: Math.floor(Date.now() / 1000) + (Number(lockMonths) || 6) * 30 * 86400,
//     trustScore: 2
//   };

//   // attempt on-chain
//   try {
//     const tokenAddress = "0x" + Math.random().toString(16).slice(2, 42);
//     const result = await launchOnChain({
//       tokenAddress,
//       supply: payloadLocal.totalSupply,
//       liquidity: payloadLocal.liquidityQIE,
//       unlock: payloadLocal.unlockTime
//     });

//     // post result to indexer
//     const postBody = {
//       tokenAddress: result.tokenAddress || tokenAddress,
//       ...payloadLocal,
//       owner: result.owner || "0xCHAINOWNER",
//       txHash: result.txHash || null
//     };

//     // POST to indexer
//     const res = await fetch(`${INDEXER_URL}/tokens`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(postBody)
//     });

//     if (!res.ok) {
//       const txt = await res.text();
//       console.warn("Indexer POST failed after on-chain success:", txt);
//     }

//     return postBody;
//   } catch (err) {
//     // fallback to simulate launch
//     console.warn("On-chain launch failed, falling back to simulation:", err?.message || err);
//     return await simulateLaunch(name, symbol, totalSupply, realAsset);
//   }
// }
// launchService.jsx

import { ethers } from "ethers"
import LaunchFactoryABI from "../abi/LaunchFactory.json"
import { FACTORY_ADDRESS } from "../config"

export async function launchToken(form) {
  console.log("🚀 launchToken called")
  console.log("📦 Raw form:", form)

  if (!window.ethereum) {
    throw new Error("Wallet not found")
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const signer = await provider.getSigner()

  const factory = new ethers.Contract(
    FACTORY_ADDRESS,
    LaunchFactoryABI,
    signer
  )

  const supply = BigInt(form.supply)
  const lockMonths = BigInt(form.lockMonths)
  const valueWei = ethers.parseEther(String(form.liquidityEth || "0"))

  const tx = await factory.launchToken(
    form.name,
    form.symbol,
    supply,
    lockMonths,
    {
      value: valueWei,
      gasLimit: 3_000_000,
    }
  )

  console.log("⏳ TX sent:", tx.hash)

  // ✅ ADD: persist token for frontend portfolio
  const token = {
    address: "0xSIM" + tx.hash.slice(2, 10), // simulated address
    name: form.name,
    symbol: form.symbol,
    liquidity: Number(form.liquidityEth),
    trust: "GREEN",
  }

  const existing = JSON.parse(localStorage.getItem("tokens") || "[]")
  localStorage.setItem("tokens", JSON.stringify([token, ...existing]))

  return token.address
}