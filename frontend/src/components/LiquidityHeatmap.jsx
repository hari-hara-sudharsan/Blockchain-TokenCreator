import React from "react";

/**
 * Simple visual: liquidity buckets and risk
 */
export default function LiquidityHeatmap({ liquidity = 0 }) {
  const level = liquidity > 400 ? "High" : liquidity > 150 ? "Medium" : "Low";
  const percent = Math.min(100, Math.round((liquidity / 500) * 100));

  return (
    <div className="heatmap-card">
      <div className="heatmap-title">Liquidity Strength</div>
      <div className="heatbar">
        <div className="fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="heat-info">
        {level} • {liquidity} QIE
      </div>
    </div>
  );
}
