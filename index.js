// ------------------------
// SAFE-MINT INDEXER PHASE 2
// Full upgrade: caching, safe writeDB, robust routes, referrals
// ------------------------

import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json({ limit: "2mb" }));
app.use(cors());

// ----------------------------
// DB FILE (Windows safe path)
// ----------------------------
const DB_PATH = path.join(process.cwd(), "db.json");

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      return { tokens: [] };
    }

    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch (err) {
    console.error("DB READ ERROR:", err);
    return { tokens: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), {
      encoding: "utf-8",
      flag: "w"
    });
  } catch (err) {
    console.error("DB WRITE ERROR:", err);
  }
}

// ----------------------------
// In-memory cache for tokens
// ----------------------------
let tokensCache = null;
let tokensCacheTs = 0;

function getCachedTokens() {
  if (tokensCache && (Date.now() - tokensCacheTs < 5000)) {
    return tokensCache;
  }
  const db = readDB();
  tokensCache = db.tokens || [];
  tokensCacheTs = Date.now();
  return tokensCache;
}

// ----------------------------
// POST /tokens  → Save or update token
// ----------------------------
app.post("/tokens", (req, res) => {
  try {
    const token = req.body;
    if (!token || !token.tokenAddress) {
      return res.status(400).json({ error: "missing tokenAddress" });
    }

    const db = readDB();
    if (!db.tokens) db.tokens = [];

    const addr = token.tokenAddress.toLowerCase();
    let existing = db.tokens.find(t => (t.tokenAddress || "").toLowerCase() === addr);

    if (!existing) {
      db.tokens.push(token);
      writeDB(db);
      tokensCache = null; // reset cache
      console.log("Saved token:", token.tokenAddress);
      return res.json({ ok: true, saved: token.tokenAddress });
    } else {
      Object.assign(existing, token);
      writeDB(db);
      tokensCache = null;
      return res.json({ ok: true, updated: token.tokenAddress });
    }

  } catch (err) {
    console.error("POST /tokens failed:", err);
    res.status(500).json({ error: "Save failed" });
  }
});

// ----------------------------
// GET /tokens → return cached list
// ----------------------------
app.get("/tokens", (req, res) => {
  return res.json(getCachedTokens());
});

// ----------------------------
// GET /token/:address → single token lookup
// ----------------------------
app.get("/token/:address", (req, res) => {
  const addr = req.params.address.toLowerCase();
  const tokens = getCachedTokens();
  const token = tokens.find(t => (t.tokenAddress || "").toLowerCase() === addr);
  if (!token) return res.status(404).json({ error: "Token not found" });
  res.json(token);
});

// ----------------------------
// REFERRAL ENDPOINT (Phase 2)
// ----------------------------
app.post("/refer/:token", (req, res) => {
  try {
    const addr = req.params.token.toLowerCase();
    const db = readDB();
    const token = db.tokens.find(t => (t.tokenAddress || "").toLowerCase() === addr);

    if (!token) {
      return res.status(404).json({ error: "Token not found" });
    }

    token.referrals = (token.referrals || 0) + 1;
    writeDB(db);
    tokensCache = null;

    res.json({ ok: true, referrals: token.referrals });

  } catch (err) {
    console.error("/refer error:", err);
    res.status(500).json({ error: "referral failed" });
  }
});


// ----------------------------
// SERVER START
// ----------------------------
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Phase-2 Indexer running on port ${PORT}`);
});

