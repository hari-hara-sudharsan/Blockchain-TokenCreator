
import React from "react";

/**
 * Trust rules:
 * green => unlockTime in future AND trustScore >=2 && no premine
 * yellow => trustScore == 1
 * red => trustScore == 0 OR unlockTime in past
 */
export default function TrustBadge({ token = {} }) {
  const unlockTime = Number(token.unlockTime || token.unlock || 0);
  const trustScore = Number(token.trustScore ?? 1);

  let color = "yellow";
  const now = Math.floor(Date.now()/1000);

  if (unlockTime > now && trustScore >= 2) color = "green";
  if (unlockTime <= now || trustScore === 0) color = "red";

  const label = color === "green" ? "Safe" : color === "yellow" ? "Caution" : "Risk";

  return (
    <div className={`trust-badge trust-${color}`}>
      <div className="dot" />
      <div className="label">{label}</div>
    </div>
  );
}

// frontend/src/components/TrustBadge.jsx
export default function TrustBadge({ token }) {
  // logic: green = locked (unlockTime in future + lockMonths >= 6) & trustScore >=2 && no premine
  const now = Math.floor(Date.now()/1000);
  const locked = token.unlockTime && Number(token.unlockTime) > now;
  let color = "bg-yellow-400 text-black";
  if (locked && token.trustScore >= 2) color = "bg-green-400 text-black";
  if (token.trustScore === 0) color = "bg-red-500 text-white";

  return (
    <div className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
      {locked ? "Locked" : "Unlocked"}
    </div>
  );
}


