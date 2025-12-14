// // frontend/src/config.js
// //export const INDEXER_URL = import.meta.env.VITE_INDEXER_URL || "http://localhost:4000";

// export const IPFS_GATEWAY = (cid) => cid ? `https://ipfs.io/ipfs/${cid}` : null;

// // On-chain factory
// //export const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || "0x65d52515dcE4e8481aD7aA889F1343d8a0FE0B8d";

// export const FACTORY_ABI = null; // optional: if you want to bundle ABI in frontend (but prefer indexer to have ABI file)

 export const RPCS = [
   "https://rpc1testnet.qie.digital",   "https://rpc2testnet.qie.digital",
   "https://rpc.ankr.com/eth_goerli" ];

// export const FACTORY_ADDRESS = "0xC90e131bD3620B07754a8dD628Bf7eC6A0DAbCBa"
// export const LOCKER_ADDRESS  = "0x8b69B344A79AF0BDfB2632cE501Ec380bBDBf1C8"
// export const LP_BURNER_ADDRESS = "0x3f127ACb59F3Eb4a2035Bb52D97141162FE97c76"

// // AFTER DEPLOY
// export const VALIDATOR_ADDRESS = "0x632468ECfd0E2FE6b0Ef21cD69491A19164d7d45"

 export const INDEXER_URL = "http://localhost:4000"


// export const GOVERNANCE_ADDRESS = "0xA2E6b1cB3E2E3bD3f1b5F4c6D7E8F9A0B1C2D3E4"

export const FACTORY_ADDRESS =
  "0xC90e131bD3620B07754a8dD628Bf7eC6A0DAbCBa"

export const LP_BURNER_ADDRESS =
  "0x3f127ACb59F3Eb4a2035Bb52D97141162FE97c76"

export const LOCKER_ADDRESS =
  "0x8b69B344A79AF0BDfB2632cE501Ec380bBDBf1C8"

// ❗ MUST BE REAL DEPLOYED ADDRESSES
export const GOVERNANCE_ADDRESS =
  "0x51C35f3bD40dcb8F120321ab2eE988a56e91A286"

export const VALIDATOR_ADDRESS =
  "0x977D27D92A95Cb86CC675eF5B24148087b94Df6B"

export const LAUNCHPAD_ADDRESS =
  "0xC90e131bD3620B07754a8dD628Bf7eC6A0DAbCBa"  