// // src/components/LaunchModal.jsx
// /*import React, { useState } from "react";
// import { motion } from "framer-motion";
// import UploadPreview from "./UploadPreview";
// import StepIndicator from "./StepIndicator";
// import TrustBadge from "./TrustBadge";
// import LockTimer from "./LockTimer";

// import { launchToken } from "../services/launchService";
// import { QIE_EXPLORER } from "../config";

// const steps = ["Create Token", "Mint Supply", "Lock Liquidity", "Done"];

// export default function LaunchModal({ open, onClose, provider }) {
//   const [step, setStep] = useState(0);

//   const [name, setName] = useState("");
//   const [symbol, setSymbol] = useState("");
//   const [supply, setSupply] = useState("");
//   const [liquidity, setLiquidity] = useState("");
//   const [lockMonths, setLockMonths] = useState(6);
//   const [image, setImage] = useState(null);

//   const [busy, setBusy] = useState(false);
//   const [error, setError] = useState("");

//   const [txHash, setTxHash] = useState("");
//   const [launchedToken, setLaunchedToken] = useState("");
//   const [unlockTime, setUnlockTime] = useState(null);

//   /* ---------------------------------------------------------
//      Launch function
//   --------------------------------------------------------- */
//   async function handleLaunch() {
//     try {
//       setError("");

//       if (!name || !symbol || !supply || !liquidity)
//         throw new Error("Fill all required fields");

//       if (!provider) throw new Error("Connect wallet first");

//       setBusy(true);
//       setStep(1);

//       const result = await launchToken({
//         name,
//         symbol,
//         supply,
//         liquidity,
//         lockMonths,
//         imageCid: image?.cid || ""
//       });

//       setTxHash(result.txHash);
//       setLaunchedToken(result.tokenAddress);
//       setUnlockTime(result.unlockTime);

//       /* Optimistic Token Insertion */
//       window.dispatchEvent(
//         new CustomEvent("token-launched", {
//           detail: {
//             tokenAddress: result.tokenAddress,
//             name,
//             symbol,
//             imageCid: image?.cid || "",
//             liquidity,
//             lockMonths,
//             trustScore: 2,
//             timestamp: Math.floor(Date.now() / 1000)
//           }
//         })
//       );

//       setStep(3);
//       setBusy(false);
//     } catch (err) {
//       console.error(err);
//       setError(err.message);
//       setBusy(false);
//       setStep(0);
//     }
//   }

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center">
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

//       {/* Modal */}
//       <motion.div
//         initial={{ scale: 0.9, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ type: "spring" }}
//         className="relative w-full max-w-2xl p-8 rounded-3xl bg-[#0B1628] border border-white/10 text-white"
//       >
//         {/* Header */}
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h2 className="text-xl font-semibold">Launch Rug-Proof Token</h2>
//             <p className="text-sm text-gray-400">SafeMint • Virtual LP Lock Demo</p>
//           </div>
//           <button className="text-gray-300 hover:text-white" onClick={onClose}>✕</button>
//         </div>

//         <StepIndicator steps={steps} current={step} />

//         {/* ---------------------------------------------------------
//             STEP 0 — FORM
//         --------------------------------------------------------- */}
//         {step === 0 && (
//           <div className="grid grid-cols-2 gap-6 mt-6">

//             <div>
//               <label className="text-sm text-gray-300">Token Name</label>
//               <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />

//               <label className="text-sm text-gray-300 mt-4 block">Symbol</label>
//               <input className="input" value={symbol} onChange={(e)=>setSymbol(e.target.value)} />

//               <label className="text-sm text-gray-300 mt-4 block">Total Supply</label>
//               <input className="input" type="number" value={supply} onChange={(e)=>setSupply(e.target.value)} />
//             </div>

//             <div>
//               <label className="text-sm text-gray-300">Liquidity (QIE)</label>
//               <input className="input" type="number" value={liquidity} onChange={(e)=>setLiquidity(e.target.value)} />

//               <label className="text-sm text-gray-300 mt-4 block">Lock Duration</label>
//               <select className="input" value={lockMonths} onChange={(e)=>setLockMonths(Number(e.target.value))}>
//                 <option value={6}>6 months</option>
//                 <option value={12}>12 months</option>
//               </select>

//               <UploadPreview className="mt-4" onUploaded={setImage} />
//             </div>

//             <div className="col-span-2 flex gap-4 mt-6">
//               <button className="btn-primary flex-1" onClick={handleLaunch} disabled={busy}>
//                 Launch & Lock {lockMonths} months
//               </button>

//               <button className="btn-secondary" onClick={onClose}>Cancel</button>
//             </div>

//           </div>
//         )}

//         {/* ---------------------------------------------------------
//             STEP 1 — PROCESSING
//         --------------------------------------------------------- */}
//         {step === 1 && (
//           <div className="text-center mt-10">
//             <h3 className="text-lg font-semibold">Submitting transaction…</h3>
//             <p className="text-gray-400 mt-2">Please confirm in your wallet</p>

//             {txHash && <a href={`${QIE_EXPLORER}/tx/${txHash}`} className="text-cyan-300 block mt-4">{txHash}</a>}

//             <div className="mt-6 flex justify-center">
//               <div className="loader-circle" />
//             </div>
//           </div>
//         )}

//         {/* ---------------------------------------------------------
//             STEP 3 — SUCCESS
//         --------------------------------------------------------- */}
//         {step === 3 && (
//           <div className="text-center mt-10">

//             <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} className="success-box">
//               ✓
//             </motion.div>

//             <h3 className="text-xl mt-4 font-semibold">Launched Successfully</h3>

//             <p className="mt-2 text-gray-300">
//               Token: <span className="text-cyan-300 font-mono">{launchedToken}</span>
//             </p>

//             <div className="mt-3 flex items-center justify-center gap-3">
//               <TrustBadge score={2} />
//               <span>Locked until</span>
//               <span className="font-mono">
//                 {new Date(unlockTime * 1000).toLocaleString()}
//               </span>
//             </div>

//             <LockTimer unlockTime={unlockTime} />

//             <div className="mt-6 flex gap-3 justify-center">
//               {txHash && (
//                 <a className="btn-secondary" href={`${QIE_EXPLORER}/tx/${txHash}`} target="_blank">
//                   View TX
//                 </a>
//               )}

//               <a className="btn-primary" href={`/token/${launchedToken}`}>
//                 View Token
//               </a>
//             </div>
//           </div>
//         )}

//         {error && <div className="text-red-400 mt-4">{error}</div>}
//       </motion.div>
//     </div>
//   );
// }*/


// frontend/src/components/LaunchModal.jsx
// LaunchModal.jsx
// src/components/LaunchModal.jsx
// frontend/src/components/LaunchModal.jsx
<<<<<<< HEAD
// LaunchModal.jsx
// LaunchModal.jsx
import React, { useState } from "react";
import confetti from "canvas-confetti";
import { launchOnChain } from "../services/launchService";
import { useNavigate } from "react-router-dom";
import { INDEXER_URL } from "../config";

export default function LaunchModal({ onClose }) {
  const nav = useNavigate();
  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("1000000");
  const [lockMonths, setLockMonths] = useState(6);
  const [realAsset, setRealAsset] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLaunch() {
    setLoading(true);
    try {
      const tokenAddress = "0x" + Math.random().toString(16).slice(2, 42); // demo address
      const liquidity = Math.floor(Math.random() * 1000) + 100; // demo liquidity
      const unlock = Math.floor(Date.now() / 1000) + Number(lockMonths) * 30 * 86400;

      // 1. Launch on-chain first
      const result = await launchOnChain({
        tokenAddress,
        supply: Number(supply),
        liquidity,
        unlock,
        //signer: window.ethereum
      });

      // 2. POST result to indexer
      await fetch(`${INDEXER_URL}/tokens`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...result,
          name,
          symbol,
          totalSupply: supply,
          lockMonths: Number(lockMonths),
          liquidityQIE: liquidity,
          unlockTime: unlock
        }),
      });

      confetti({ particleCount: 150, spread: 100, scalar: 1.5 });
      setStep("success");

      setTimeout(() => {
        onClose?.();
        if (result?.tokenAddress || result?.address) {
          const addr = result.tokenAddress || result.address;
          nav(`/token/${addr}`);
        } else {
          nav("/");
        }
      }, 1100);

    } catch (err) {
      console.error("Launch error", err);
      alert("Launch failed: " + (err?.message || "unknown"));
    } finally {
      setLoading(false);
=======
import { useState } from "react";
import confetti from "canvas-confetti";
import { simulateLaunch } from "../services/launchService";
import { useNavigate } from "react-router-dom";

export default function LaunchModal({ onClose }) {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("1000000");
  const [realAsset, setRealAsset] = useState(false);
  const [step, setStep] = useState("form");
  const [error, setError] = useState("");

  async function launch() {
    setError("");
    try {
      setStep("sending");
      const res = await simulateLaunch(name, symbol, supply, realAsset, "");
      // burst confetti
      confetti({ particleCount: 160, spread: 100, scalar: 1.2 });
      setStep("success");
      // slight delay so user sees success then navigate
      setTimeout(() => {
        nav(`/token/${res.tokenAddress}`);
        onClose && onClose();
      }, 900);
    } catch (e) {
      setError(String(e));
      setStep("form");
>>>>>>> 2dc515a (Updated Mad)
    }
  }

  return (
<<<<<<< HEAD
    <div className="modal-backdrop" onClick={() => onClose?.()}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {step === "form" && (
          <>
            <h3 className="modal-title">🚀 Launch Token</h3>

            <input placeholder="Token Name" value={name} onChange={e=>setName(e.target.value)} />
            <input placeholder="Symbol" value={symbol} onChange={e=>setSymbol(e.target.value)} />
            <input placeholder="Total Supply" value={supply} onChange={e=>setSupply(e.target.value)} />
            <div className="row">
              <label>Lock Months</label>
              <select value={lockMonths} onChange={e=>setLockMonths(e.target.value)}>
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={6}>6</option>
                <option value={12}>12</option>
              </select>
            </div>

            <label className="row">
              <input type="checkbox" checked={realAsset} onChange={()=>setRealAsset(v=>!v)} />
              <span>Real Asset Mode</span>
            </label>

            <div className="actions">
              <button className="btn outline" onClick={() => onClose?.()}>Cancel</button>
              <button className="btn" onClick={handleLaunch} disabled={loading}>
                {loading ? "Launching…" : "Launch & Lock"}
              </button>
=======
    <div className="launch-modal fixed inset-0 flex items-center justify-center z-50">
      <div className="w-[440px] bg-gradient-to-bl from-[#071428]/90 to-[#0b0b0b]/80 p-6 rounded-2xl border border-cyan-600/30 shadow-2xl">
        {step === "form" && (
          <>
            <h2 className="text-2xl font-bold text-cyan-300 mb-4">🚀 Launch Fair Token</h2>

            <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Token Name" className="w-full p-3 rounded-lg mb-3 bg-[#0f1112] border border-gray-700"/>
            <input value={symbol} onChange={(e)=>setSymbol(e.target.value)} placeholder="Symbol" className="w-full p-3 rounded-lg mb-3 bg-[#0f1112] border border-gray-700"/>
            <input value={supply} onChange={(e)=>setSupply(e.target.value)} placeholder="Total Supply" className="w-full p-3 rounded-lg mb-3 bg-[#0f1112] border border-gray-700"/>

            <label className="flex items-center gap-2 mb-4 text-gray-300">
              <input type="checkbox" checked={realAsset} onChange={() => setRealAsset(!realAsset)} />
              Real Asset Mode
            </label>

            {error && <div className="text-red-400 mb-2">{error}</div>}

            <div className="flex gap-3">
              <button onClick={launch} className="flex-1 py-3 rounded-lg bg-gradient-to-r from-[#00f2ff] to-[#00ffa6] text-black font-semibold">Launch & Lock Liquidity</button>
              <button onClick={() => onClose && onClose()} className="py-3 px-4 rounded-lg bg-transparent border border-gray-700 text-gray-300">Cancel</button>
>>>>>>> 2dc515a (Updated Mad)
            </div>
          </>
        )}

<<<<<<< HEAD
        {step === "success" && (
          <div className="success">
            <h3>🎉 Launched!</h3>
            <p>Redirecting to token page…</p>
=======
        {step === "sending" && (
          <div className="text-center py-8">
            <div className="animate-pulse text-gray-400">Sending transaction... (simulated)</div>
          </div>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <h3 className="text-2xl text-cyan-300">🎉 Token Successfully Launched</h3>
            <p className="text-gray-400 mt-2">Your liquidity is locked. Redirecting to token...</p>
>>>>>>> 2dc515a (Updated Mad)
          </div>
        )}
      </div>
    </div>
  );
}
