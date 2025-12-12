<<<<<<< HEAD
import React from "react";
import { IPFS_GATEWAY } from "../config";
import TrustBadge from "./TrustBadge";
import Sparkline from "./Sparkline";
import { Link } from "react-router-dom";

export default function TokenCard({ token = {} }) {
  // defensive normalisation
  const addr = token.tokenAddress || token.address || "0xUNKNOWN";
  const liquidity = Number(token.liquidityQIE || 0);
  const supply = Number(token.totalSupply || token.totalSupply || 0);
  const name = token.name || token.symbol || addr.slice(0,8);

  const image = token.imageCid ? IPFS_GATEWAY(token.imageCid) : null;

  return (
    <Link to={`/token/${addr}`} className="card token-card">
      <div className="card-left">
        <div className="avatar">{image ? <img src={image} alt={name} /> : <div className="avatar-fallback">{name[0]}</div>}</div>
        <div className="meta">
          <div className="title">{name}</div>
          <div className="subtitle">{addr}</div>
        </div>
      </div>

      <div className="card-mid">
        <Sparkline data={[5,10,6,9,15,8,12]} />
        <div className="liquidity">{isNaN(liquidity) ? "—" : `${liquidity.toFixed(2)} QIE`}</div>
      </div>

      <div className="card-right">
        <TrustBadge token={token} />
      </div>
    </Link>
  );
}
=======
// frontend/src/components/TokenCard.jsx
import { useNavigate } from "react-router-dom";
import { IPFS_GATEWAY } from "../config";
import TrustBadge from "./TrustBadge";
import Sparkline from "./Sparkline";


export default function TokenCard({ token }) {
  const nav = useNavigate();
  const image = token.imageCid ? IPFS_GATEWAY(token.imageCid) : null;
  const priceData = token.priceHistory || [5, 10, 5, 20, 8, 15];

  return (
    <div onClick={() => nav(`/token/${token.tokenAddress}`)} className="cursor-pointer group bg-[#071017] p-4 rounded-xl border border-cyan-600/10 hover:scale-[1.01] transition transform">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-300 to-blue-600 flex items-center justify-center overflow-hidden">
          {image ? <img src={image} alt="token" className="w-full h-full object-cover"/> : <div className="text-white font-bold">{(token.symbol||"TOK").slice(0,3)}</div>}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-white font-semibold">{token.name || token.tokenAddress}</div>
              <div className="text-xs text-gray-400">{token.symbol || ""}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-cyan-300">${(token.price || 0).toFixed ? (token.price || 0).toFixed(2) : token.price}</div>
              <div className="text-xs text-gray-400">{token.trustScore === 3 ? "Green" : token.trustScore === 2 ? "Yellow" : "Red"}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div style={{width:100}}>
              <Sparkline data={priceData} />
            </div>

            <TrustBadge token={token} />
          </div>
        </div>
      </div>
    </div>
  );
}

>>>>>>> 2dc515a (Updated Mad)
