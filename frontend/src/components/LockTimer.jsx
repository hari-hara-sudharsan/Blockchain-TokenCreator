// LockTimer.jsx
import React, { useEffect, useState } from "react";

export default function LockTimer({ unlockTime }) {
  const [remaining, setRemaining] = useState({});
  useEffect(() => {
    function calc() {
      const t = (Number(unlockTime || 0) * 1000) - Date.now();
      if (t <= 0) return setRemaining({ done: true });
      let ms = t;
      const days = Math.floor(ms / (1000*60*60*24)); ms -= days * (1000*60*60*24);
      const hours = Math.floor(ms / (1000*60*60)); ms -= hours * (1000*60*60);
      const minutes = Math.floor(ms / (1000*60));
      setRemaining({ days, hours, minutes });
    }
    calc();
    const id = setInterval(calc, 1000*30);
    return ()=>clearInterval(id);
  }, [unlockTime]);

  if (remaining.done) return <div className="lock-done">Unlocked</div>;
  return <div>{remaining.days}d {remaining.hours}h {remaining.minutes}m</div>;
}