import React, { useEffect, useState } from "react";

export default function LockTimer({ unlockTime }) {
<<<<<<< HEAD
  const [remaining, setRemaining] = useState(calcRemaining(unlockTime));

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining(unlockTime)), 1000);
    return () => clearInterval(id);
  }, [unlockTime]);

  if (!unlockTime) return <span>—</span>;

  if (remaining.total <= 0) return <span>Unlocked</span>;

  return (
    <span>
      {remaining.days}d {remaining.hours}h {remaining.minutes}m
    </span>
  );
}

function calcRemaining(unix) {
  let t = (Number(unix) * 1000) - Date.now();
  if (isNaN(t) || t <= 0) return { total: 0, days: 0, hours: 0, minutes: 0 };
  
  const total = t;
  const days = Math.floor(t / (1000 * 60 * 60 * 24));
  t -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(t / (1000 * 60 * 60));
  t -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(t / (1000 * 60));
  return { total, days, hours, minutes };
=======
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!unlockTime) return null;

  const diff = unlockTime * 1000 - now;
  if (diff <= 0) return <div className="text-green-300 font-semibold">Unlocked</div>;

  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  const secs = Math.floor((diff % (1000*60)) / 1000);

  return <div className="text-yellow-300 font-semibold">{days}d {hours}h {mins}m {secs}s</div>;
>>>>>>> 2dc515a (Updated Mad)
}
