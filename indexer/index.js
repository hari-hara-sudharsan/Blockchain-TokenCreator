// ----------------------------
// SAFEMINT INDEXER - FIXED
// ----------------------------
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// ----------------------------
// APP INITIALIZATION
// ----------------------------
const app = express();     // <---- THIS IS WHAT YOU WERE MISSING
app.use(cors());
app.use(express.json());

// ----------------------------
// DB HANDLING
// ----------------------------
const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ tokens: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (err) {
    console.error("DB READ ERROR:", err);
    return { tokens: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), {
      encoding: "utf-8",
      flag: "w",
    });
  } catch (err) {
    console.error("DB WRITE ERROR:", err);
  }
}

// ----------------------------
// CACHED TOKENS
// ----------------------------
let cache = null;
let cacheTS = 0;

function getCachedTokens() {
  if (cache && Date.now() - cacheTS < 5000) return cache;
  cache = readDB().tokens || [];
  cacheTS = Date.now();
  return cache;
}

// ----------------------------
// ROUTES
// ----------------------------

// GET ALL TOKENS
app.get("/tokens", (req, res) => {
  return res.json(getCachedTokens());
});

// GET SINGLE TOKEN
app.get("/tokens/:address", (req, res) => {
  const address = req.params.address.toLowerCase();
  const tokens = getCachedTokens();
  const token = tokens.find(t => t.tokenAddress.toLowerCase() === address);

  if (!token) return res.status(404).json({ error: "Token not found" });
  return res.json(token);
});

// SAVE TOKEN
app.post("/tokens", (req, res) => {
  try {
    const db = readDB();
    const token = req.body;

    if (!token.tokenAddress) {
      return res.status(400).json({ error: "Missing tokenAddress" });
    }

    if (!db.tokens) db.tokens = [];

    const existing = db.tokens.find(
      t => t.tokenAddress.toLowerCase() === token.tokenAddress.toLowerCase()
    );

    if (existing) {
      Object.assign(existing, token);
    } else {
      db.tokens.push(token);
    }

    writeDB(db);
    cache = null;

    console.log("Saved token:", token.tokenAddress);
    return res.json({ ok: true });
  } catch (err) {
    console.error("POST /tokens failed:", err);
    return res.status(500).json({ error: "Save failed" });
  }
});

// ----------------------------
// START SERVER
// ----------------------------
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Indexer running on port ${PORT}`);
});