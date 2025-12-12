<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import TokenCard from "../components/TokenCard";
import { INDEXER_URL } from "../config";
=======
// frontend/src/pages/TokenList.jsx
import { useEffect, useState } from "react";
import TokenCard from "../components/TokenCard";
import { getAllTokens } from "../services/indexerApi";
>>>>>>> 2dc515a (Updated Mad)

export default function TokenList() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  function getCache(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  function setCache(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      // ignore storage errors
    }
  }

  async function fetchTokens() {
    setLoading(true);
    try {
      const res = await fetch(`${INDEXER_URL}/tokens`);
      const data = await res.json();
      // indexer might return object map or array
      const list = Array.isArray(data) ? data : (Array.isArray(data.tokens) ? data.tokens : Object.values(data || {}));
      setTokens(list.reverse ? list.reverse() : list);
    } catch (err) {
      console.error("Failed to fetch tokens", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function load() {
      const cached = getCache("tokens");
      if (cached) setTokens(cached);

      const res = await fetch(`${INDEXER_URL}/tokens`);
      const fresh = await res.json();
      setTokens(fresh);
      setCache("tokens", fresh);
    }
    load();

    const t = setInterval(fetchTokens, 5000); // refresh
    return () => clearInterval(t);
  }, []);

  return (
    <div className="token-list">
      <header className="page-header">
        <h1>Latest Launches</h1>
        <p className="muted">Live — shows trust score, liquidity, and lock status.</p>
      </header>

      {loading && <div className="loader">Loading launches…</div>}

      <div className="grid">
        {tokens && tokens.length ? tokens.map((t) => (
          <TokenCard key={t.tokenAddress || t.address} token={t} />
        )) : !loading && <div className="empty">No tokens yet.</div>}
      </div>
    </div>
  );
}
=======
  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const items = await getAllTokens();
        if (mounted) setTokens(items);
      } catch(e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return ()=> mounted = false;
  },[]);

  if (loading) return <div className="p-6">Loading tokens...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6">
      {tokens.map(t => <TokenCard token={t} key={t.tokenAddress} />)}
    </div>
  );
}

>>>>>>> 2dc515a (Updated Mad)
