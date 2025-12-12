// // indexer/server.js
// const express = require("express");
// const fs = require("fs");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // FIXED: absolute path to DB inside indexer folder (Railway safe)
// const DB = __dirname + "/db.json";

// const ADMIN_KEY = process.env.INDEXER_ADMIN_KEY || "";

// /* ---------------------------------------------------------
//    Helpers
// --------------------------------------------------------- */
// function readDB() {
//   if (!fs.existsSync(DB)) {
//     fs.writeFileSync(
//       DB,
//       JSON.stringify({ tokens: [] }, null, 2)
//     );
//   }
//   return JSON.parse(fs.readFileSync(DB, "utf8"));
// }

// function writeDB(data) {
//   fs.writeFileSync(DB, JSON.stringify(data, null, 2));
// }

// /* ---------------------------------------------------------
//    GET — All Tokens
// --------------------------------------------------------- */
// app.get("/tokens", (req, res) => {
//   const db = readDB();
//   res.json(db.tokens);
// });

// /* ---------------------------------------------------------
//    GET — Single Token by Address
// --------------------------------------------------------- */
// app.get("/tokens/:address", (req, res) => {
//   const db = readDB();
//   const addr = req.params.address.toLowerCase();

//   const token = db.tokens.find(
//     (t) => (t.tokenAddress || "").toLowerCase() === addr
//   );

//   if (!token)
//     return res.status(404).json({ error: "Token not found" });

//   res.json(token);
// });

// /* ---------------------------------------------------------
//    POST — Add New Token (frontend → backend)
// --------------------------------------------------------- */
// app.post("/tokens", (req, res) => {
//   const incoming = req.body;

//   if (!incoming.tokenAddress)
//     return res.status(400).json({ error: "Missing tokenAddress" });

//   const db = readDB();

//   const exists = db.tokens.find(
//     (t) =>
//       (t.tokenAddress || "").toLowerCase() ===
//       incoming.tokenAddress.toLowerCase()
//   );

//   if (!exists) {
//     db.tokens.push({
//       tokenAddress: incoming.tokenAddress,
//       owner: incoming.owner,
//       totalSupply: incoming.totalSupply,
//       liquidityQIE: incoming.liquidityQIE,
//       lockMonths: incoming.lockMonths,
//       unlockTime: incoming.unlockTime,
//       trustScore: incoming.trustScore,
//       withdrawn: false,
//       imageCid: incoming.imageCid || "",
//       timestamp: Math.floor(Date.now() / 1000)
//     });
//     writeDB(db);
//   }

//   res.json({ ok: true });
// });

// /* ---------------------------------------------------------
//    POST — Update Withdrawn Status (contract → backend)
// --------------------------------------------------------- */
// app.post("/tokens/:address/withdraw", (req, res) => {
//   const key = req.headers["x-admin-key"] || "";
//   if (ADMIN_KEY && key !== ADMIN_KEY)
//     return res.status(403).json({ error: "Invalid admin key" });

//   const addr = req.params.address.toLowerCase();
//   const db = readDB();

//   const idx = db.tokens.findIndex(
//     (t) => (t.tokenAddress || "").toLowerCase() === addr
//   );

//   if (idx === -1)
//     return res.status(404).json({ error: "Token not found" });

//   db.tokens[idx].withdrawn = true;
//   db.tokens[idx].withdrawnAt = Math.floor(Date.now() / 1000);

//   writeDB(db);
//   res.json({ ok: true });
// });

// /* ---------------------------------------------------------
//    START SERVER
// --------------------------------------------------------- */
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () =>
//   console.log(`Indexer API running on port ${PORT}`)
// );

// indexer/server.js
// indexer/server.js
// server.js
// server.js — REST API
// indexer/server.js
// indexer/server.js
// indexer/server.js
// server.js - FULL WORKING VERSION FOR PHASE 1
// indexer/server.js
// indexer/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, "db.json");
const ADMIN_KEY = process.env.INDEXER_ADMIN_KEY || "";

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ tokens: [] }, null, 2), "utf8");
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    if (!raw) return { tokens: [] };
    return JSON.parse(raw);
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

// simple in-memory cache
let tokensCache = null;
let tokensCacheTs = 0;
function getCachedTokens() {
  if (tokensCache && (Date.now() - tokensCacheTs) < 5000) return tokensCache;
  const db = readDB();
  tokensCache = db.tokens || [];
  tokensCacheTs = Date.now();
  return tokensCache;
}

/* ----------------- ROUTES ----------------- */

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/tokens", (req, res) => {
  return res.json(getCachedTokens());
});

app.get("/tokens/:address", (req, res) => {
  const addr = (req.params.address || "").toLowerCase();
  const t = getCachedTokens().find(x => (x.tokenAddress || x.address || "").toLowerCase() === addr);
  if (!t) return res.status(404).json({ error: "Token not found" });
  return res.json(t);
});

app.post("/tokens", (req, res) => {
  try {
    const db = readDB();
    const token = req.body;
    if (!token || !token.tokenAddress) return res.status(400).json({ error: "missing tokenAddress" });

    if (!db.tokens) db.tokens = [];

    const exists = db.tokens.find(t => (t.tokenAddress || "").toLowerCase() === token.tokenAddress.toLowerCase());
    if (!exists) {
      db.tokens.push(token);
      writeDB(db);
      // invalidate cache
      tokensCache = null;
      console.log("Saved token:", token.tokenAddress);
      return res.json({ ok: true, saved: token.tokenAddress });
    } else {
      Object.assign(exists, token);
      writeDB(db);
      tokensCache = null;
      console.log("Updated token:", token.tokenAddress);
      return res.json({ ok: true, updated: token.tokenAddress });
    }
  } catch (err) {
    console.error("POST /tokens failed:", err);
    res.status(500).json({ error: "Save failed" });
  }
});

app.post("/tokens/:address/withdraw", (req, res) => {
  const key = req.headers["x-admin-key"] || "";
  if (ADMIN_KEY && key !== ADMIN_KEY) {
    return res.status(403).json({ error: "Invalid admin key" });
  }

  const addr = (req.params.address || "").toLowerCase();
  const db = readDB();
  const idx = (db.tokens || []).findIndex(t => (t.tokenAddress || "").toLowerCase() === addr);
  if (idx === -1) return res.status(404).json({ error: "Token not found" });
  db.tokens[idx].withdrawn = true;
  db.tokens[idx].withdrawnAt = Math.floor(Date.now() / 1000);
  writeDB(db);
  tokensCache = null;
  return res.json({ ok: true });
});

app.post("/refer/:token", (req, res) => {
  try {
    const db = readDB();
    const tokenAddress = (req.params.token || "").toLowerCase();
    const t = (db.tokens || []).find(x => (x.tokenAddress || "").toLowerCase() === tokenAddress);
    if (!t) return res.status(404).json({ error: "Token not found" });
    t.referrals = (t.referrals || 0) + 1;
    writeDB(db);
    tokensCache = null;
    return res.json({ ok: true, referrals: t.referrals });
  } catch (err) {
    console.error("POST /refer failed:", err);
    res.status(500).json({ error: "failed" });
  }
});

/* ----------------- SERVER START ----------------- */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Indexer running on port ${PORT}`));