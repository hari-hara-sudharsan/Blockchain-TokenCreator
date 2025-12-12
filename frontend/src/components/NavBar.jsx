<<<<<<< HEAD
import React, { useEffect, useState } from "react";

export default function NavBar({ onOpenLaunch }) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // Wallet injection stub — if QIE wallet injects provider, listen
    if (window.ethereum?.request) {
      window.ethereum.request({ method: "eth_accounts" }).then((acc = []) => {
        if (acc && acc.length) setAccount(acc[0]);
      }).catch(() => {});
      // listen for connect
      window.ethereum?.on?.("accountsChanged", (acc) => {
        setAccount(acc?.[0] || null);
      });
    }
  }, []);

  async function connect() {
    if (!window.ethereum?.request) {
      alert("No wallet detected. Use QIE Wallet or MetaMask-like provider.");
      return;
    }
    try {
      const acc = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(acc?.[0] || null);
    } catch (e) { console.error(e); }
  }

  return (
    <nav className="nav">
      <div className="nav-left">
        <div className="logo">SafeMint<span className="accent">™</span></div>
        <div className="nav-links">
          <a href="/">Launches</a>
          <a href="#discover">Discover</a>
          <a href="#analytics">Analytics</a>
        </div>
      </div>

      <div className="nav-right">
        <button className="btn" onClick={onOpenLaunch}>🚀 Launch Token</button>
        <button className="btn outline" onClick={connect}>
          {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </div>
    </nav>
  );
}
=======
import { useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-between items-center px-6 py-4 bg-black/40 border-b border-cyan-500/10">
      <h1 className="text-xl font-bold text-cyan-300">SafeMint</h1>

      <div className="flex gap-4">
        <button
          onClick={() => navigate("/launch")}
          className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold"
        >
          Launch Token
        </button>

        <button
          onClick={() => window.ethereum?.request({ method: "eth_requestAccounts" })}
          className="px-4 py-2 bg-gray-700 text-cyan-300 rounded-lg"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
>>>>>>> 2dc515a (Updated Mad)
