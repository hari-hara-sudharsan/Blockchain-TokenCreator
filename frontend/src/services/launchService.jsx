// import { INDEXER_URL } from "../config";

// export async function launchFairToken(data) {
//   // generate fake token address
//   const fakeAddress = "0xSIM" + Math.random().toString(16).slice(2, 10);

//   const payload = {
//     tokenAddress: fakeAddress,
//     owner: data.owner || "0xSIMOWNER",
//     totalSupply: data.totalSupply,
//     liquidityQIE: data.liquidityQIE,
//     lockMonths: data.lockMonths,
//     unlockTime: Math.floor(Date.now() / 1000) + data.lockMonths * 30 * 86400,
//     trustScore: 2,
//     imageCid: data.imageCid || ""
//   };

//   const res = await fetch(`${INDEXER_URL}/tokens`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(payload)
//   });

//   if (!res.ok) throw new Error("Launch failed");

//   return { ok: true, tokenAddress: fakeAddress };
// }


// frontend/src/services/launchService.jsx
// frontend/src/services/launchService.jsx
<<<<<<< HEAD
// frontend/src/services/launchService.jsx
// launchService.jsx
// launchService.jsx
// launchService.jsx
// launchService - handles real indexer POST and simulation fallback
// launchService.jsx - tries on-chain -> indexer POST -> simulate
// launchService.jsx (REAL ON-CHAIN LAUNCH + INDEXER SAVE + FALLBACK)
// launchService.jsx
import { ethers } from "ethers";
import { INDEXER_URL, LAUNCHPAD_ADDRESS } from "../config";
import ABI from "../abi/LaunchPadABI.json";

async function postToIndexer(payload) {
  const res = await fetch(`${INDEXER_URL}/tokens`, {
=======
import { INDEXER_URL } from "../config";

export async function simulateLaunch(name, symbol, totalSupply, realAsset = false, imageCid = "") {
  let owner = "0xSIMOWNER";

  try {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      owner = accounts[0] || owner;
    }
  } catch (e) {
    console.warn("Wallet not connected, using SIMOWNER");
  }

  const payload = {
    name,
    symbol,
    totalSupply: Number(totalSupply) || 1000000,
    owner,
    imageCid,
    realAsset,
    lockMonths: 6,
    liquidityQIE: 0.1
  };

  const res = await fetch(`${INDEXER_URL}/sim-launch`, {
>>>>>>> 2dc515a (Updated Mad)
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
<<<<<<< HEAD
  return res.json();
}

export async function launchOnChain({
  tokenAddress,
  supply,
  liquidity,
  unlock
}) {
  try {
    if (!window.qiewallet) {
      throw new Error("QIE Wallet not detected");
    }

    // correct provider for QIE Wallet
    const provider = new ethers.BrowserProvider(window.qiewallet);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      LAUNCHPAD_ADDRESS,
      LAUNCHPAD_ABI,
      signer
    );

    const tx = await contract.emitTestLaunch(
      tokenAddress,
      supply,
      liquidity,
      unlock
    );

    console.log("⏳ Waiting for confirmation…");
    const receipt = await tx.wait();

    let launchEvent = null;

    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed.name === "Launched") {
          launchEvent = parsed.args;
          break;
        }
      } catch {}
    }

    if (!launchEvent) throw new Error("Launch event not found!");

    return {
      owner: launchEvent.owner,
      tokenAddress: launchEvent.token,
      supply: launchEvent.supply.toString(),
      liquidity: launchEvent.liquidity.toString(),
      unlock: launchEvent.unlock.toString(),
    };
  } catch (err) {
    console.error("On-chain launch failed:", err);
    throw err;
  }
}

// Keep existing functions for backward compatibility
export async function launchRealToken({ name, symbol, totalSupply, liquidityQIE, lockMonths }) {
  let provider, signer, contract;

  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(LAUNCHPAD_ADDRESS, ABI, signer);
  } catch (err) {
    console.warn("Wallet unavailable:", err);
    return { ok: false, error: "Wallet not connected" };
  }

  try {
    // CALL THE REAL QIE CHAIN METHOD
    const tx = await contract.launchToken(
      name,
      symbol,
      BigInt(totalSupply),
      BigInt(liquidityQIE),
      BigInt(lockMonths)
    );

    const receipt = await tx.wait();

    // Extract tokenAddress from logs
    const evt = receipt.logs.find(l => l.topics[0] === ethers.id("Launched(address,address,uint256,uint256,uint256,uint256)"));

    let parsed;
    if (evt) parsed = contract.interface.parseLog(evt);

    const tokenAddress = parsed?.args?.token;

    const payload = {
      tokenAddress,
      name,
      symbol,
      totalSupply,
      liquidityQIE,
      lockMonths,
      unlockTime: Math.floor(Date.now() / 1000) + lockMonths * 30 * 86400,
      trustScore: 3,
    };

    await postToIndexer(payload);

    return { ok: true, tokenAddress };

  } catch (err) {
    console.error("Real launch failed:", err);
    return { ok: false, error: err.message };
  }
=======

  if (!res.ok) throw new Error("Simulation launch failed");

  return await res.json();
>>>>>>> 2dc515a (Updated Mad)
}
