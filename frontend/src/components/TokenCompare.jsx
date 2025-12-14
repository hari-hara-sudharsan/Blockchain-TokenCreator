// frontend/src/components/TokenCompare.jsx
import React from "react";
import Sparkline from "./Sparkline";

export default function TokenCompare({ a, b }) {
  return (
    <div className="compare">
      <div className="col">
        <h4>{a?.name || a?.symbol}</h4>
        <Sparkline data={[5, 8, 6, 12, 9]} />
        <div>Liquidity: {a?.liquidityQIE}</div>
      </div>
      <div className="col vs">VS</div>
      <div className="col">
        <h4>{b?.name || b?.symbol}</h4>
        <Sparkline data={[3, 10, 5, 8, 11]} />
        <div>Liquidity: {b?.liquidityQIE}</div>
      </div>
    </div>
  );
}

// frontend/src/components/TokenCompare.jsx (snippet)
export function runCompare(tokens) {
  const worker = new Worker("/workers/compareWorker.js");
  worker.postMessage({ tokens });
  worker.onmessage = (e) => {
    console.log("compare results", e.data.result);
    worker.terminate();
    // update state
  };
}
