// // src/pages/TokenPage.jsx
// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { useParams } from "react-router-dom";
// import { ethers } from "ethers";
// import confetti from "canvas-confetti";

// import TrustBadge from "../components/TrustBadge";
// import LockTimer from "../components/LockTimer";
// import WithdrawConfirm from "../components/WithdrawConfirm";

// import { LAUNCHPAD_ADDRESS, QIE_EXPLORER, INDEXER_URL } from "../config";
// import { LAUNCHPAD_ABI } from "../abi/LaunchPadABI";
// import { withdrawLP as withdrawOnChain } from "../services/launchService";

// export default function TokenPage() {
//   const { address: tokenAddress } = useParams();

//   const [details, setDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [showConfirm, setShowConfirm] = useState(false);
//   const [busy, setBusy] = useState(false);
//   const [message, setMessage] = useState("");

//   /* Load blockchain info */
//   async function loadChainDetails() {
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const contract = new ethers.Contract(LAUNCHPAD_ADDRESS, LAUNCHPAD_ABI, provider);

//     const d = await contract.getLaunchDetails(tokenAddress);

//     return {
//       owner: d[0],
//       tokenAddress: d[1],
//       totalSupply: BigInt(d[2]),
//       liquidityQIE: d[3],
//       lockMonths: Number(d[4]),
//       unlockTime: Number(d[5]),
//       trustScore: Number(d[6]),
//       withdrawn: Boolean(d[7]),
//       imageCid: d[8]
//     };
//   }

//   /* Load indexer details */
//   async function loadIndexerDetails() {
//     try {
//       const res = await fetch(`${INDEXER_URL}/tokens`);
//       const list = await res.json();
//       return list.find(
//         (t) => (t.tokenAddress || t.token).toLowerCase() === tokenAddress.toLowerCase()
//       );
//     } catch {
//       return null;
//     }
//   }

//   /* Unified loader */
//   async function loadInfo() {
//     try {
//       setLoading(true);

//       const chain = await loadChainDetails();
//       const indexer = await loadIndexerDetails();

//       setDetails({
//         ...chain,
//         ...(indexer || {})
//       });

//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to load token details");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadInfo();
//   }, [tokenAddress]);

//   const locked = details && Date.now() < details.unlockTime * 1000;
//   const canWithdraw = details && !locked && !details.withdrawn;

//   async function notifyIndexerWithdraw() {
//     try {
//       const adminKey = import.meta.env.VITE_INDEXER_ADMIN_KEY || "";
//       await fetch(`${INDEXER_URL}/tokens/${tokenAddress}/withdraw`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           ...(adminKey ? { "x-admin-key": adminKey } : {})
//         }
//       });
//     } catch (e) {
//       console.warn("Indexer withdraw update failed");
//     }
//   }

//   async function handleWithdrawConfirmed() {
//     setBusy(true);
//     setShowConfirm(false);

//     try {
//       const res = await withdrawOnChain(tokenAddress);

//       setDetails((prev) => ({ ...prev, withdrawn: true }));

//       await notifyIndexerWithdraw();

//       confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });

//       setMessage("Withdrawn successfully! TX: " + res.txHash);
//     } catch (err) {
//       setMessage(err.message || "Withdraw failed");
//     } finally {
//       setBusy(false);
//     }
//   }

//   if (loading) return <div className="p-8 text-gray-300">Loading token…</div>;

//   if (!details)
//     return <div className="p-8 text-red-400">Token details not found.</div>;

//   return (
//     <div className="min-h-screen p-8 text-white bg-gradient-to-b from-[#050b12] to-[#0c1625]">
//       <div className="max-w-4xl mx-auto">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex justify-between items-center mb-8"
//         >
//           <div>
//             <div className="text-2xl font-bold">Token Dashboard</div>
//             <div className="text-gray-400 font-mono">{tokenAddress}</div>
//           </div>

//           <TrustBadge score={details.trustScore} />
//         </motion.div>

//         {/* Card */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.94 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="rounded-3xl p-8 bg-white/5 border border-white/10 shadow-xl"
//         >
//           <div className="grid grid-cols-3 gap-4">

//             <div className="stat-box">
//               <div className="stat-label">Total Supply</div>
//               <div className="stat-value">{details.totalSupply.toString()}</div>
//             </div>

//             <div className="stat-box">
//               <div className="stat-label">Liquidity (virtual)</div>
//               <div className="stat-value">{ethers.formatEther(details.liquidityQIE)} QIE</div>
//             </div>

//             <div className="stat-box">
//               <div className="stat-label">Locked Until</div>
//               <div className="stat-value">
//                 {new Date(details.unlockTime * 1000).toLocaleString()}
//               </div>
//             </div>

//           </div>

//           {/* Countdown */}
//           <div className="mt-6">
//             <LockTimer unlockTime={details.unlockTime} />
//           </div>

//           {/* Buttons */}
//           <div className="mt-6 flex gap-4 items-center">
//             <button
//               disabled={!canWithdraw || busy}
//               onClick={() => setShowConfirm(true)}
//               className={`btn-primary ${
//                 !canWithdraw ? "opacity-40 cursor-not-allowed" : ""
//               }`}
//             >
//               {details.withdrawn
//                 ? "Liquidity Withdrawn"
//                 : locked
//                 ? "Locked"
//                 : busy
//                 ? "Withdrawing…"
//                 : "Withdraw Liquidity"}
//             </button>

//             <a
//               href={`${QIE_EXPLORER}/token/${tokenAddress}`}
//               target="_blank"
//               className="btn-secondary"
//             >
//               Explorer
//             </a>
//           </div>

//           {message && <div className="mt-4 text-cyan-300">{message}</div>}
//         </motion.div>
//       </div>

//       <WithdrawConfirm
//         open={showConfirm}
//         onCancel={() => setShowConfirm(false)}
//         onConfirm={handleWithdrawConfirmed}
//         busy={busy}
//       />
//     </div>
//   );
// }

// src/pages/TokenPage.jsx
// frontend/src/pages/TokenPage.jsx
// TokenPage.jsx
// src/pages/TokenPage.jsx
// frontend/src/pages/TokenPage.jsx
<<<<<<< HEAD
// TokenPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { INDEXER_URL, IPFS_GATEWAY } from "../config";
import LockTimer from "../components/LockTimer";
import TrustBadge from "../components/TrustBadge";
import Sparkline from "../components/Sparkline";
import confetti from "canvas-confetti";
=======
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getToken } from "../services/indexerApi";
import TrustBadge from "../components/TrustBadge";
>>>>>>> 2dc515a (Updated Mad)

export default function TokenPage() {
  const { address } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  async function fetchToken() {
    setLoading(true);
    try {
      const r = await fetch(`${INDEXER_URL}/tokens/${address}`);
      if (!r.ok) {
        // fallback: try tokens list
        const list = await (await fetch(`${INDEXER_URL}/tokens`)).json().catch(() => []);
        const arr = Array.isArray(list) 
          ? list 
          : (Array.isArray(list.tokens) ? list.tokens : Object.values(list || {}));
        const found = arr.find(
          (x) => (x.tokenAddress || x.address || "").toLowerCase() === address.toLowerCase()
        );
        if (!found) {
          setToken(null);
          setLoading(false);
          console.warn("Token not found");
          return;
        } else {
          setToken(found);
        }
      } else {
        const d = await r.json();
        setToken(d);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchToken();
    const id = setInterval(fetchToken, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, [address]);

  // Demo auto-burn effect: reduce supply slowly (UI only)
  useEffect(() => {
    if (!token) return;
    const t = setInterval(() => {
      setToken((prev) =>
        prev
          ? { ...prev, totalSupply: Math.max(1, Math.floor((Number(prev.totalSupply) || 0) * 0.99)) }
          : prev
      );
=======
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  // auto-burn demo (1% every 5s)
  useEffect(() => {
    if (!token) return;
    const t = setInterval(() => {
      setToken((tk) => {
        if (!tk) return tk;
        return {
          ...tk,
          totalSupply: Math.floor(Number(tk.totalSupply) * 0.99),
        };
      });
>>>>>>> 2dc515a (Updated Mad)
    }, 5000);
    return () => clearInterval(t);
  }, [token]);

<<<<<<< HEAD
  if (loading) return <div className="loader">Loading token…</div>;
  if (!token) return <div className="empty">Token not found</div>;

  const img = token.imageCid ? IPFS_GATEWAY(token.imageCid) : null;
  const liquidity = Number(token.liquidityQIE || 0);

  function handleBurnLP() {
    // for demo: show confetti and change flag
    confetti();
    alert("Burn LP (demo) - this would call the contract in production.");
  }

  const refLink = `${window.location.origin}/?ref=${token.tokenAddress || address}`;

  return (
    <div className="token-page">
      <div className="token-hero">
        <div className="left">
          <div className="avatar-large">
            {img ? <img src={img} alt="token" /> : token.symbol?.[0] || "T"}
          </div>
          <div className="name">
            <h2>{token.name || token.symbol || address}</h2>
            <div className="address">{address}</div>
          </div>
        </div>

        <div className="right">
          <div className="stats">
            <div>
              <strong>Supply</strong>
              <div>{Number(token.totalSupply || 0).toLocaleString()}</div>
            </div>
            <div>
              <strong>Liquidity</strong>
              <div>{isNaN(liquidity) ? "—" : liquidity.toFixed(2) + " QIE"}</div>
            </div>
            <div>
              <strong>Locked</strong>
              <div><LockTimer unlockTime={token.unlockTime || token.unlock} /></div>
            </div>
            <div>
              <strong>Trust</strong>
              <div><TrustBadge token={token} /></div>
            </div>
          </div>

          <div className="actions">
            <button className="btn" onClick={handleBurnLP}>
              Burn LP (Demo)
            </button>
            <button className="btn outline" disabled>
              Rug Impossible — Locked until{" "}
              {new Date((token.unlockTime || token.unlock || 0) * 1000).toLocaleDateString()}
            </button>
          </div>

          <div className="share">
            <button onClick={() => navigator.clipboard.writeText(refLink)}>
              Copy Referral
            </button>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://twitter.com/intent/tweet?text=Check+this+token+${encodeURIComponent(refLink)}`}
            >
              Share X
            </a>
=======
  // tick every second for lock countdown
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // initial load
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getToken(address);
        if (mounted) setToken(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [address]);

  if (loading) return <div className="p-6">Loading token...</div>;
  if (!token) return <div className="p-6">Token not found</div>;

  const unlockTs = token.unlockTime || 0;
  const secondsLeft = Math.max(0, unlockTs - now);
  const isLocked = secondsLeft > 0;

  const days = Math.floor(secondsLeft / 86400);
  const hours = Math.floor((secondsLeft % 86400) / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const hasUnlockTime = !!token.unlockTime;
  const unlockDateLabel = hasUnlockTime
    ? new Date(token.unlockTime * 1000).toLocaleString()
    : "—";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex gap-6">
        <div className="w-32 h-32 rounded-xl bg-gray-800 flex items-center justify-center">
          {token.imageCid ? (
            <img
              src={`https://ipfs.io/ipfs/${token.imageCid}`}
              alt="token"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="text-white">
              {(token.symbol || "TOK").slice(0, 3)}
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-2xl text-white font-bold">
            {token.name || token.tokenAddress}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-gray-400">Supply: {token.totalSupply}</div>
            <TrustBadge token={token} />
            <div className="text-gray-400">
              Created:{" "}
              {token.timestamp
                ? new Date(token.timestamp * 1000).toLocaleString()
                : "—"}
            </div>
          </div>

          {/* Lock countdown + actions */}
          <div className="mt-6">
            <div className="text-sm text-cyan-300 mb-2">
              {hasUnlockTime ? (
                isLocked ? (
                  <span>
                    Locked for{" "}
                    {days}d {hours}h {minutes}m {seconds}s — unlocks at{" "}
                    {unlockDateLabel}
                  </span>
                ) : (
                  <span>Unlocked since {unlockDateLabel}</span>
                )
              ) : (
                <span>Lock info unavailable</span>
              )}
            </div>

            <button
              disabled={isLocked}
              className={`px-4 py-2 rounded-lg ${
                isLocked
                  ? "bg-[#222] opacity-50 cursor-not-allowed"
                  : "bg-[#222] hover:bg-[#333]"
              }`}
            >
              Burn LP {isLocked && "(locked)"}
            </button>

            <button
              disabled={isLocked}
              className={`ml-3 px-4 py-2 rounded-lg ${
                isLocked
                  ? "bg-[#444] text-[#aaa] cursor-not-allowed"
                  : "bg-red-600 text-white hover:bg-red-700"
              }`}
            >
              {isLocked
                ? `Rug Impossible — Locked until ${unlockDateLabel}`
                : "Danger: Rug LP"}
            </button>
>>>>>>> 2dc515a (Updated Mad)
          </div>
        </div>
      </div>

<<<<<<< HEAD
      <section className="chart">
        <h4>Price Sparkline</h4>
        <Sparkline data={[5, 8, 3, 12, 9, 14, 10]} />
      </section>

      <section className="details">
        <h4>Details</h4>
        <pre className="json">{JSON.stringify(token, null, 2)}</pre>
      </section>
=======
      <div className="mt-8 bg-[#06070a] p-4 rounded-lg border border-cyan-600/10">
        <h3 className="text-lg text-cyan-300 font-semibold">
          Liquidity &amp; Metrics
        </h3>
        <div className="mt-3 text-gray-300">
          Liquidity (QIE): {token.liquidityQIE}
        </div>
        <div className="mt-2 text-gray-400">Trust score: {token.trustScore}</div>
      </div>
>>>>>>> 2dc515a (Updated Mad)
    </div>
  );
}
