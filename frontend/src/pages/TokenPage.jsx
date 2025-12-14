// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { INDEXER_URL } from "../config";
// import TrustBadge from "../components/TrustBadge";
// import LockTimer from "../components/LockTimer";
// import { Sparklines, SparklinesLine } from "react-sparklines";
// import confetti from "canvas-confetti";
// import SpeedDemonBadge from "../components/SpeedDemonBadge";
// import ValidatorPanel from "../components/ValidatorPanel";
// import Sparkline from "../components/Sparkline";
// import { burnLP } from "../services/lpBurn";

// export default function TokenPage() {
//   const { address } = useParams();
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   async function fetchToken() {
//     try {
//       const res = await fetch(`${INDEXER_URL}/tokens/${address.toLowerCase()}`);
//       if (!res.ok) throw new Error("Token not found");
//       const data = await res.json();
//       setToken(data);
//     } catch (err) {
//       console.error("Token fetch failed", err);
//       setToken(null);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchToken();
//     const id = setInterval(fetchToken, 5000);
//     return () => clearInterval(id);
//   }, [address]);

//   if (loading) return <div className="container">Loading…</div>;
//   if (!token) return <div className="container">Token not found</div>;

//   // ✅ NEW SPARKLINE DATA LOGIC (updated as requested)
//   const prices = Array.isArray(token.priceSeries)
//     ? token.priceSeries.map(p => Number(p.price)).filter(n => !isNaN(n))
//     : [];

//   // ✅ DEBUG (OUTSIDE JSX)
//   console.log("PRICE SERIES RAW:", token.priceSeries);
//   console.log("PRICE SERIES NUMBERS:", prices);

//   // ✅ Local handler using burnLP(token.pair)
//   async function handleBurnLP() {
//     try {
//       await burnLP(token.pair);
//       alert("LP burn scheduled via LPBurner contract");
//     } catch (e) {
//       alert(e.message);
//     }
//   }

//   return (
//     <div className="container">
//       <div className="header">
//         <h1>
//           {token.name} <small>({token.symbol})</small>
//         </h1>
//         <TrustBadge token={token} />
//       </div>

//       <div className="card mt-4">
//         <div className="row-around">
//           <div>
//             <div>Liquidity</div>
//             <div className="big">
//               {Number(token.liquidityQIE || 0).toLocaleString()}
//             </div>
//           </div>

//           <div>
//             <div>Lock</div>
//             <LockTimer unlockTime={token.unlockTime} />
//           </div>

//           <div>
//             <div>Created</div>
//             <div>{new Date().toLocaleString()}</div>
//           </div>

//           {/* 🔹 Community Referrals block */}
//           <div className="row">
//             <span>Community Referrals</span>
//             <strong>{token.referrals || 0}</strong>
//           </div>
//         </div>

//         {/* ✅ UPDATED SPARKLINE RENDER - ONLY IF VALID */}
//         <div className="mt-6">
//           <h4>Price</h4>

//           {prices.length >= 2 ? (
//             <Sparklines data={prices} height={80}>
//               <SparklinesLine color="#00f2ff" style={{ strokeWidth: 2 }} />
//             </Sparklines>
//           ) : (
//             <div>No price data yet</div>
//           )}
//         </div>

//         <div className="mt-6 row-around">
//           <button className="btn outline" disabled>
//             Burn LP (Coming Soon)
//           </button>

//           <button
//             className="btn"
//             onClick={() => {
//               confetti({ particleCount: 120, spread: 100 });
//               alert("Demo action");
//             }}
//           >
//             Claim Demo
//           </button>

//           <button
//             onClick={handleBurnLP}
//             className="btn danger"
//           >
//             🔥 Burn LP
//           </button>
//         </div>
//       </div>

//       {/* Validator panel */}
//       <ValidatorPanel token={token} />
//     </div>
//   );
// }

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getToken } from "../services/tokenService"
import PriceChart from "../components/PriceGraph"
import AdoptionChart from "../components/AdoptionChart"
import TrustBadge from "../components/TrustBadge"

export default function TokenPage() {
  const { address } = useParams()
  const [token, setToken] = useState(null)

  useEffect(() => {
    getToken(address).then(setToken).catch(console.error)
  }, [address])

  if (!token) return <p>Loading…</p>

  return (
    <div className="container">
      <h2>{token.name} ({token.symbol})</h2>

      <TrustBadge trust={token.trust} />

      <div className="card">
        <h4>📈 Price Movement</h4>
        <PriceChart data={token.priceSeries} />
      </div>

      <div className="card">
        <h4>👥 Adoption</h4>
        <AdoptionChart count={token.interactions || 1} />
        <p>{token.interactions || 1} unique wallets</p>
      </div>
    </div>
  )
}