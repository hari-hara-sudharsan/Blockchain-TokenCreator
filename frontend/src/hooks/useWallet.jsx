import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function useWallet() {
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.ethereum) {
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      (async () => {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts?.length > 0) setAddress(accounts[0]);
          const network = await p.getNetwork();
          setChainId(network.chainId);
        } catch (e) { console.warn("Wallet read failed:", e); }
      })();

      window.ethereum.on("accountsChanged", (accounts) => {
        setAddress(accounts[0] || "");
      });
      window.ethereum.on("chainChanged", async () => {
        const n = await new ethers.BrowserProvider(window.ethereum).getNetwork();
        setChainId(n.chainId);
      });

      return () => {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      };
    } else {
      console.warn("No injected wallet found – install MetaMask/QIE Wallet");
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) throw new Error("Install QIE Wallet / MetaMask");
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const p = new ethers.BrowserProvider(window.ethereum);
      setProvider(p);
      const s = await p.getSigner();
      const addr = await s.getAddress();
      setAddress(addr);
      return addr;
    } catch (e) {
      console.error("Connect failed:", e);
      throw e;
    }
  };

  return { address, provider, chainId, connect };
}