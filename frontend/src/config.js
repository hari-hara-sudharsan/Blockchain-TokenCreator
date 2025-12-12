// src/config.js
// export const INDEXER_URL = import.meta.env.VITE_INDEXER_URL || "http://localhost:4000";
// export const LAUNCHPAD_ADDRESS = import.meta.env.VITE_LAUNCHPAD_ADDRESS || "";
// export const QIE_EXPLORER = import.meta.env.VITE_QIE_EXPLORER || "https://testnet.qie.digital";
// export const IPFS_GATEWAY = (cid) => (cid ? `https://ipfs.io/ipfs/${cid}` : null);
// export const IPFS_DEFAULT = "https://ipfs.io/ipfs/";

//export const API_URL = "http://localhost:4000";

// frontend/src/config.js
<<<<<<< HEAD
// export const INDEXER_URL = import.meta.env.VITE_INDEXER_URL || "http://localhost:4000";
// export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE === "true");
// export const IPFS_GATEWAY = (cid) => (cid ? `https://ipfs.io/ipfs/${cid}` : null);


//export const INDEXER_URL = "http://localhost:4000";

// export const QIE_RPC = "https://qiechainrpc.com"; 
// // Replace with your exact working QIE RPC

// export const CHAIN_ID = 5050; // Example QIE Chain ID

// // frontend/src/config.js
// export const INDEXER_URL = (import.meta.env.DEV) ? "http://localhost:4000" : "https://your.production.indexer";
// export const LAUNCHPAD_ADDRESS = "0x65d52515dcE4e8481aD7aA889F1343d8a0FE0B8d";
// Central config. Edit INDEXER_URL if your indexer runs elsewhere.
export const INDEXER_URL = import.meta.env.VITE_INDEXER_URL || "http://localhost:4000";
export const IPFS_GATEWAY = (cid) => (cid ? `https://ipfs.io/ipfs/${cid}` : null);
export const LAUNCHPAD_ADDRESS = import.meta.env.VITE_LAUNCHPAD_ADDRESS || "0x65d52515dcE4e8481aD7aA889F1343d8a0FE0B8d";
=======
export const INDEXER_URL = import.meta.env.VITE_INDEXER_URL || "http://localhost:4000";
export const DEMO_MODE = (import.meta.env.VITE_DEMO_MODE === "true");
export const IPFS_GATEWAY = (cid) => (cid ? `https://ipfs.io/ipfs/${cid}` : null);
>>>>>>> 2dc515a (Updated Mad)
