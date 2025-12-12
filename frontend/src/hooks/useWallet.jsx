<<<<<<< HEAD
// src/hooks/useWallet.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && (window.ethereum || window.qie)) {
      const web3Provider = new ethers.BrowserProvider(window.ethereum || window.qie);
      setProvider(web3Provider);

      // auto-detect accounts if already connected
      (async () => {
        try {
          const accounts = await web3Provider.send("eth_accounts", []);
          if (accounts && accounts.length) {
            const s = web3Provider.getSigner();
            setSigner(s);
            setAccount(accounts[0]);
            const net = await web3Provider.getNetwork();
            setNetwork(net);
          }
        } catch (e) {
          // ignore
        }
      })();

      // account / chain changed events
      if (window.ethereum) {
        window.ethereum.on?.("accountsChanged", (accs) => {
          setAccount(accs[0] || null);
          if (!accs.length) setSigner(null);
        });
        window.ethereum.on?.("chainChanged", async () => {
          const net = await web3Provider.getNetwork();
          setNetwork(net);
        });
      }
    }
  }, []);

  async function connect() {
    if (! (window.ethereum || window.qie) ) throw new Error("Wallet not injected");
    const web3Provider = new ethers.BrowserProvider(window.ethereum || window.qie);
    await web3Provider.send("eth_requestAccounts", []);
    const s = web3Provider.getSigner();
    setProvider(web3Provider);
    setSigner(s);
    const acc = await s.getAddress();
    setAccount(acc);
    const net = await web3Provider.getNetwork();
    setNetwork(net);
    return { provider: web3Provider, signer: s, account: acc, network: net };
  }

  return { provider, signer, account, network, connect };
=======
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

      // read current accounts (if already connected)
      (async () => {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts && accounts.length > 0) setAddress(accounts[0]);
          const network = await p.getNetwork();
          setChainId(network.chainId);
        } catch (e) { /* ignore */ }
      })();

      window.ethereum.on?.("accountsChanged", (accounts) => {
        setAddress(accounts[0] || "");
      });
      window.ethereum.on?.("chainChanged", async () => {
        const n = await new ethers.BrowserProvider(window.ethereum).getNetwork();
        setChainId(n.chainId);
      });
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) throw new Error("Install QIE Wallet / MetaMask");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const p = new ethers.BrowserProvider(window.ethereum);
    setProvider(p);
    const s = await p.getSigner();
    const addr = await s.getAddress();
    setAddress(addr);
    return addr;
  };

  return { address, provider, chainId, connect };
>>>>>>> 2dc515a (Updated Mad)
}
