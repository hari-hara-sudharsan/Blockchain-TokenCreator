// indexer/index.js
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const { ethers } = require("ethers");
const { computeTrustScore } = require("./trustEngine");

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");
const PORT = process.env.PORT || 4000;
const RPC_URL = process.env.RPC_URL || "";
const FACTORY_ADDRESS = (process.env.LAUNCHPAD_ADDRESS || "").trim();
const FACTORY_ABI_PATH = path.join(__dirname, "LaunchPadABI.json");

// Safe DB helpers
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ tokens: [] }, null, 2), "utf8");
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw || '{"tokens":[]}');
  } catch (err) {
    console.error("DB READ ERROR:", err);
    return { tokens: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), {
      encoding: "utf8",
      flag: "w",
    });
  } catch (err) {
    console.error("DB WRITE ERROR:", err);
  }
}

// In-memory cache (optional)
let tokensCache = null;
let tokensCacheTs = 0;

function getCachedTokens() {
  if (tokensCache && Date.now() - tokensCacheTs < 5000) return tokensCache;
  const db = readDB();
  tokensCache = db.tokens || [];
  tokensCacheTs = Date.now();
  return tokensCache;
}

// ✅ ensurePriceSeries: seed a simple numeric series if missing
function ensurePriceSeries(token) {
  const base = Number(token.initialPrice || 1);
  const arr = [];

  let last = base;

  for (let i = 0; i < 30; i++) {
    const delta = (Math.random() - 0.5) * 0.08;
    last = Math.max(0.0001, last * (1 + delta));
    arr.push(Number(last.toFixed(6)));
  }

  token.priceSeries = arr;
}

// ✅ Hard guarantee that every token has a drawable series
function forcePriceSeries(token) {
  if (Array.isArray(token.priceSeries) && token.priceSeries.length > 2) return;

  const base = Number(token.liquidityQIE || 1) / 100 || 1;
  token.priceSeries = Array.from({ length: 20 }, (_, i) => {
    const v = base * (1 + Math.sin(i / 3) * 0.1);
    return { price: Number(v.toFixed(4)) };
  });
}

// ✅ NEW: price helper
function computePrice(liquidity, supply) {
  if (!liquidity || !supply) return 0;
  return Number(liquidity) / Number(supply);
}

// ✅ NEW: append price point into DB for a token
function appendPrice(tokenAddress, point) {
  const db = readDB();

  const token = (db.tokens || []).find(
    t => String(t.tokenAddress || t.address || "").toLowerCase() === String(tokenAddress || "").toLowerCase()
  );
  if (!token) return;

  if (!token.priceSeries) token.priceSeries = [];

  token.priceSeries.push(point);

  // keep last 100 points
  token.priceSeries = token.priceSeries.slice(-100);

  writeDB(db);
}

// Routes
app.get("/tokens", (req, res) => {
  // Read fresh DB so newly launched tokens are always visible
  const db = readDB();
  res.json(db.tokens || []);
});

app.get("/tokens/:address", (req, res) => {
  const db = readDB();
  const token = (db.tokens || []).find(
    t => String(t.tokenAddress || "").toLowerCase() === String(req.params.address || "").toLowerCase()
  );

  if (!token) return res.status(404).json({ error: "Token not found" });

  // Make sure it has a price series
  if (!Array.isArray(token.priceSeries) || token.priceSeries.length === 0) {
    ensurePriceSeries(token);
    writeDB(db);
  }

  res.json(token);
});

app.post("/tokens", (req, res) => {
  try {
    const db = readDB();
    const token = req.body;

    if (!token || !token.tokenAddress) {
      return res.status(400).json({ error: "Missing tokenAddress" });
    }

    if (!db.tokens) db.tokens = [];

    // 🔑 Trust computation
    token.trust = computeTrustScore(token);

    // 🔒 Enforce & force price series so frontend can always draw
    ensurePriceSeries(token);
    forcePriceSeries(token);

    const addr = token.tokenAddress.toLowerCase();
    const existing = db.tokens.find(
      t => String(t.tokenAddress || "").toLowerCase() === addr
    );

    if (existing) {
      Object.assign(existing, token);
    } else {
      db.tokens.push({
        ...token,
        createdAt: Date.now()
      });
    }

    writeDB(db);
    tokensCache = null;

    return res.json({ ok: true, tokenAddress: token.tokenAddress });

  } catch (err) {
    console.error("POST /tokens failed:", err);
    return res.status(500).json({ error: "Save failed" });
  }
});

// referral
app.post("/refer/:token", (req, res) => {
  try {
    const db = readDB();
    if (!db.tokens) db.tokens = [];

    const addr = String(req.params.token || "").toLowerCase();
    const t = db.tokens.find(
      (x) => String(x.tokenAddress || "").toLowerCase() === addr
    );

    if (!t) return res.status(404).json({ error: "Token not found" });

    t.referrals = (t.referrals || 0) + 1;
    writeDB(db);
    tokensCache = null;

    return res.json({ ok: true, referrals: t.referrals });
  } catch (err) {
    console.error("/refer failed:", err);
    return res.status(500).json({ error: "refer failed" });
  }
});

setInterval(() => {
  const db = readDB();
  let changed = false;

  for (const token of db.tokens || []) {
    if (Array.isArray(token.priceSeries)) {
      const last = token.priceSeries[token.priceSeries.length - 1];
      const nextPrice = Math.max(0.0001, Number(last.price) + (Math.random() - 0.5) * 0.02);

      token.priceSeries.push({ price: Number(nextPrice.toFixed(6)) });
      if (token.priceSeries.length > 60) {
        token.priceSeries.shift();
      }
      changed = true;
    }
  }

  if (changed) {
    writeDB(db);
    tokensCache = null;
  }
}, 4000);

// Simple seeding if db empty (developer convenience)
(function seedIfEmpty() {
  const db = readDB();
  if (!db.tokens || db.tokens.length === 0) {
    db.tokens = [
      {
        tokenAddress: "0xSIM0001",
        name: "SimToken Alpha",
        symbol: "SIMA",
        totalSupply: 1000000,
        liquidityQIE: 120.5,
        unlockTime: Math.floor(Date.now() / 1000) + 30 * 24 * 3600 * 6,
        trustScore: 2,
        initialPrice: 0.12,
      },
      {
        tokenAddress: "0xSIM0002",
        name: "SimToken Beta",
        symbol: "SIMB",
        totalSupply: 500000,
        liquidityQIE: 20,
        unlockTime: Math.floor(Date.now() / 1000) + 30 * 24 * 3600 * 3,
        trustScore: 1,
        initialPrice: 0.45,
      },
    ];

    db.tokens.forEach((t) => {
      ensurePriceSeries(t);
      forcePriceSeries(t);
    });
    writeDB(db);
    tokensCache = null;
    console.log("Seeded demo tokens (simulation mode)...");
  }
})();

// Optionally attach blockchain listener (hybrid)
async function startChainListener() {
  if (!RPC_URL || !FACTORY_ADDRESS) {
    console.log("⚠  Missing RPC_URL or LAUNCHPAD_ADDRESS — event listener disabled.");
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);

    // load ABI if available
    let factoryAbi = null;
    if (fs.existsSync(FACTORY_ABI_PATH)) {
      factoryAbi = JSON.parse(fs.readFileSync(FACTORY_ABI_PATH, "utf8"));
    } else {
      console.log("No LaunchPad ABI file found at", FACTORY_ABI_PATH);
    }

    if (!factoryAbi) {
      console.log("Factory ABI missing - cannot subscribe to events.");
      return;
    }

    const contract = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider);
    console.log("📡 Listening for Launched events on:", FACTORY_ADDRESS);

    // ✅ ONLY REAL EVENT: Launched
    contract.on("Launched", (owner, token, supply, liquidity, unlock) => {
      console.log("🔥 New token launched:", token);

      const db = readDB();
      if (!db.tokens) db.tokens = [];

      const tokenObj = {
        tokenAddress: token,
        owner,
        totalSupply: Number(supply || 0),
        liquidityQIE: Number(liquidity || 0),
        unlockTime: Number(unlock || Math.floor(Date.now() / 1000)),
        trustScore: 2,
        name: `OnChain-${String(token).slice(2, 8)}`,
        symbol: `TKN${String(token).slice(2, 6)}`,
        initialPrice: 1,
        createdAt: Date.now(),
      };

      tokenObj.trust = computeTrustScore(tokenObj);
      ensurePriceSeries(tokenObj);
      forcePriceSeries(tokenObj);

      const tokenLc = String(token).toLowerCase();
      const exists = (db.tokens || []).find(
        (t) => String(t.tokenAddress || "").toLowerCase() === tokenLc
      );

      if (!exists) {
        db.tokens.push(tokenObj);
        writeDB(db);
        tokensCache = null;
        console.log("Simulated new launch (onchain event):", token);
      } else {
        Object.assign(exists, tokenObj);
        ensurePriceSeries(exists);
        forcePriceSeries(exists);
        writeDB(db);
        tokensCache = null;
        console.log("Updated token from event:", token);
      }

      // ✅ EXTRA: append price point derived from liquidity & supply
      const price = computePrice(liquidity, supply);
      appendPrice(token, {
        time: Date.now(),
        price,
      });
    });

  } catch (err) {
    console.error("Event listener failed:", err);
  }
}

// start listener but don't block startup
startChainListener();

// validator staking
app.post("/validator/stake", (req, res) => {
  const { address, amount } = req.body;
  const db = readDB();

  if (!db.validators) db.validators = [];

  let v = db.validators.find(x => x.address === address);

  if (!v) {
    v = { address, stake: 0, active: true };
    db.validators.push(v);
  }

  v.stake += Number(amount);
  writeDB(db);

  res.json({ ok: true });
});

// validator endorse
app.post("/validator/endorse", (req, res) => {
  const { validator, token } = req.body;
  const db = readDB();

  const t = (db.tokens || []).find(x => x.tokenAddress === token);
  if (!t) return res.status(404).json({ error: "Token not found" });

  t.validatorEndorsements = t.validatorEndorsements || [];
  if (!t.validatorEndorsements.includes(validator)) {
    t.validatorEndorsements.push(validator);
  }

  writeDB(db);
  res.json({ ok: true });
});

// governance
app.get("/governance", (req, res) => {
  const db = readDB();
  res.json(db.proposals || []);
});

app.post("/governance/vote/:id", (req, res) => {
  const { vote } = req.body;
  const db = readDB();

  const p = (db.proposals || []).find(x => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "Proposal not found" });

  vote === "yes" ? p.yes++ : p.no++;
  writeDB(db);

  res.json({ ok: true });
});

// validators list
app.get("/validators", (req, res) => {
  const db = readDB();
  res.json(db.validators || []);
});

// interactions tracking
app.post("/interact/:address", (req, res) => {
  const db = readDB();
  const addr = String(req.params.address || "").toLowerCase();

  db.interactions ??= [];

  if (!db.interactions.includes(addr)) {
    db.interactions.push(addr);
    writeDB(db);
  }

  res.json({ total: db.interactions.length });
});

// start server
app.listen(PORT, () => {
  console.log(`Indexer running on port ${PORT}`);
});
