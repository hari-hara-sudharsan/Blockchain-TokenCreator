// // indexer/indexer.js
// const { ethers } = require("ethers");
// const fs = require("fs");
// require("dotenv").config();

// // Option C — Demo Mode (NO RPC NEEDED)

// const fs = require("fs");
// console.log("Indexer running in DEMO mode (no blockchain RPC).");

// // Ensure DB exists
// if (!fs.existsSync("db.json")) {
//   fs.writeFileSync("db.json", JSON.stringify({ tokens: [] }, null, 2));
// }

// // Nothing else to do — backend will serve all tokens from REST API


// const LAUNCHPAD_ABI = require("./LaunchPadABI.json");
// const RPC = process.env.QIE_RPC;
// const LAUNCHPAD_ADDRESS = process.env.LAUNCHPAD_ADDRESS;
// const START_BLOCK = Number(process.env.LAUNCHPAD_START_BLOCK || 0);
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
// const provider = new ethers.JsonRpcProvider(process.env.QIE_RPC, {
//   timeout: 20000
// });


// console.log("Starting Indexer…");
// console.log("ENV CHECK:", { RPC, LAUNCHPAD_ADDRESS, START_BLOCK });

// if (!fs.existsSync("db.json")) fs.writeFileSync("db.json", JSON.stringify({ tokens: [] }, null, 2));

// async function main() {
//   console.log("Listening from block:", START_BLOCK);

//   const contract = new ethers.Contract(LAUNCHPAD_ADDRESS, LAUNCHPAD_ABI, provider);

//   const latest = await provider.getBlockNumber();
//   let from = START_BLOCK;

//   while (from <= latest) {
//     const to = Math.min(from + 5000, latest);
//     console.log(`Fetching logs: ${from} → ${to}`);
//     try {
//       const logs = await provider.getLogs({
//         address: LAUNCHPAD_ADDRESS,
//         fromBlock: from,
//         toBlock: to,
//         topics: [ethers.id("Launched(address,address,uint256,uint256,uint256,uint256)")]
//       });

//       for (const log of logs) {
//         const parsed = contract.interface.parseLog(log);
//         saveLaunch(parsed.args, log.transactionHash);
//       }
//     } catch (err) {
//       console.warn("getLogs error:", err?.message || err);
//     }
//     from = to + 1;
//   }

//   contract.on("Launched", (owner, token, supply, liquidity, months, unlockTime, event) => {
//     console.log("New Launch:", token);
//     saveLaunch({ owner, token, totalSupply: supply, liquidityQIE: liquidity, lockMonths: months, unlockTime }, event.transactionHash);
//   });

//   console.log("Indexer realtime listener attached.");
// }

// function saveLaunch(data, txHash) {
//   const db = JSON.parse(fs.readFileSync("db.json"));
//   const exists = db.tokens.find((x) => (x.tokenAddress || "").toLowerCase() === (data.token || "").toLowerCase());
//   if (exists) return;
//   db.tokens.push({
//     owner: data.owner,
//     tokenAddress: data.token,
//     name: data.name || "",
//     totalSupply: data.totalSupply?.toString?.() || String(data.totalSupply),
//     liquidityQIE: data.liquidityQIE?.toString?.() || String(data.liquidityQIE || "0"),
//     lockMonths: Number(data.lockMonths || 0),
//     unlockTime: Number(data.unlockTime || 0),
//     creationTx: txHash,
//     trustScore: 2,
//     withdrawn: false,
//     imageCid: ""
//   });
//   fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
//   console.log("Saved token:", data.token);
// }

// main().catch((e) => {
//   console.error("Indexer Error:", e);
//   process.exit(1);
// });

// indexer/indexer.js
// DEMO MODE – No RPC, no blockchain logs.

// indexer.js
// indexer.js — demo-only simulated blockchain indexer

// indexer/indexer.js
// indexer/indexer.js
// indexer/indexer.js
const { ethers } = require("ethers");
const fs = require("fs");
const path = require("path");
const { generateOHLC } = require("./priceEngine"); 
require("dotenv").config();


const LAUNCHPAD_ABI = require("./LaunchPadABI.json"); // we'll provide this file
const LAUNCHPAD_ADDRESS = process.env.LAUNCHPAD_ADDRESS;
const RPC = process.env.QIE_RPC || process.env.RPC || "https://rpc1testnet.qie.digital";
const START_BLOCK = Number(process.env.LAUNCHPAD_START_BLOCK) || 0;
const DB_PATH = path.join(__dirname, "db.json");

function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify({ tokens: [] }, null, 2), "utf8");
    }
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return raw ? JSON.parse(raw) : { tokens: [] };
  } catch (e) {
    console.error("readDB error", e);
    return { tokens: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), { encoding: "utf-8", flag: "w" });
  } catch (err) {
    console.error("DB WRITE ERROR:", err);
  }
}

console.log("Starting Indexer…");
console.log("ENV CHECK:", { RPC, LAUNCHPAD_ADDRESS, START_BLOCK });

async function seedDemoTokens() {
  const db = readDB();
  if (!db.tokens || db.tokens.length === 0) {
    db.tokens = db.tokens || [];
    for (let i = 1; i <= 5; i++) {
      const addr = "0xSIM" + Math.random().toString(16).slice(2, 8);
      const t = {
        tokenAddress: addr,
        name: `SIM-${i}`,
        symbol: `SIM${i}`,
        owner: "0xSIMOWNER",
        totalSupply: 1000000,
        liquidityQIE: Math.floor(Math.random() * 500) + 10,
        lockMonths: 6,
        unlockTime: Math.floor(Date.now() / 1000) + 6 * 30 * 86400,
        trustScore: 2,
        imageCid: "",
        timestamp: Math.floor(Date.now() / 1000)
      };
      db.tokens.push(t);
      console.log("Simulated new launch:", addr);
    }
    writeDB(db);
  }
}

async function main() {
  // attempt provider
  let provider;
  try {
    provider = new ethers.JsonRpcProvider(RPC);
    // test network; if fails will throw
    await provider.getBlockNumber();
    console.log("Connected to RPC — running live indexer.");
  } catch (err) {
    console.warn("RPC connect failed, running in simulation-only mode. Error:", err && err.message);
    await seedDemoTokens();
    console.log("Seeded demo tokens (simulation mode)...");
    return;
  }

  // We have provider -> attempt to attach to contract
  if (!LAUNCHPAD_ADDRESS) {
    console.warn("No LAUNCHPAD_ADDRESS set — seeding demo tokens only.");
    await seedDemoTokens();
    return;
  }

  const contract = new ethers.Contract(LAUNCHPAD_ADDRESS, LAUNCHPAD_ABI, provider);

  // fetch past logs starting from START_BLOCK in batches (if START_BLOCK > 0)
  try {
    const latest = await provider.getBlockNumber();
    let from = START_BLOCK || 0;
    console.log("Listening from block:", from);

    while (from <= latest) {
      const to = Math.min(from + 5000, latest);
      console.log(`Fetching logs: ${from} → ${to}`);
      try {
        const logs = await provider.getLogs({
          address: LAUNCHPAD_ADDRESS,
          topics: [ethers.id("Launched(address,address,uint256,uint256,uint256,uint256)")],
          fromBlock: from,
          toBlock: to
        });
        for (const log of logs) {
          try {
            const parsed = contract.interface.parseLog(log);
            const args = parsed.args;
            saveLaunch({
              owner: args.owner,
              token: args.token,
              totalSupply: args.supply?.toString?.() || args.totalSupply?.toString?.(),
              liquidityQIE: args.liquidity?.toString?.(),
              lockMonths: args.months || 0,
              unlockTime: Number(args.unlockTime || args.unlock || 0),
            }, log.transactionHash);
          } catch (e) {
            // ignore parse errors
          }
        }
      } catch (e) {
        // sometimes provider returns HTML (blocked); just break and rely on listener
        console.warn("Warning: fetching logs failed:", e.message || e);
      }
      from = to + 1;
    }
  } catch (e) {
    console.warn("Error while fetching past logs:", e);
  }

  // realtime
  try {
    contract.on("Launched", (owner, token, supply, liquidity, months, unlockTime, event) => {
      console.log("New Launch event:", token);
      saveLaunch({
        owner, token, totalSupply: supply?.toString?.(), liquidityQIE: liquidity?.toString?.(),
        lockMonths: months, unlockTime: Number(unlockTime)
      }, event.transactionHash);
    });
    console.log("Indexer realtime listener attached.");
  } catch (e) {
    console.error("Failed to attach event listener:", e);
  }
}

function saveLaunch(data, txHash) {
  const db = readDB();
  db.tokens = db.tokens || [];
  const tokenAddr = (data.token || data.tokenAddress || "").toLowerCase();
  const exists = db.tokens.find(x => (x.tokenAddress || "").toLowerCase() === tokenAddr);
  if (exists) return;
  const tokenObj = {
    tokenAddress: data.token || data.tokenAddress,
    owner: data.owner || "",
    totalSupply: data.totalSupply || "0",
    liquidityQIE: data.liquidityQIE || "0",
    lockMonths: data.lockMonths || 0,
    unlockTime: Number(data.unlockTime) || Math.floor(Date.now() / 1000) + 6 * 30 * 86400,
    trustScore: 2,
    creationTx: txHash,
    timestamp: Math.floor(Date.now() / 1000),
    // 👇 THESE 3 LINES ONLY ADDED:
    priceHistory: generateOHLC(1, 40),
    volatility: Math.random() * 0.3,
    growth: (Math.random() * 200 - 50).toFixed(2) // -50% to +150%
    // 👆 END OF ADDED LINES
  };
  db.tokens.push(tokenObj);
  writeDB(db);
  console.log("Saved Token:", tokenObj.tokenAddress);
}


/* run */
main().catch(async (err) => {
  console.error("Indexer startup error:", err);
  // Seed demo tokens so UI still works
  await seedDemoTokens();
});
