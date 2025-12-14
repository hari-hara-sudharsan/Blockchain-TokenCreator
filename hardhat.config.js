// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.24",
// };

require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

// IMPORTANT: do NOT commit real private keys to source control.
// Use environment variables (e.g. a `.env` file) to set `QIE_RPC_URL` and `DEPLOYER_PRIVATE_KEY`.
module.exports = {
  solidity: "0.8.17",
  solidity: "0.8.20",
  solidity: "0.8.24",

  networks: {
    qie_testnet: {
      // Provide a valid RPC URL via environment variable `QIE_RPC_URL`.
      // Example: QIE_RPC_URL="https://your-qie-testnet-rpc.example"
      url: process.env.QIE_RPC|| "https://rpc1testnet.qie.digital",
      // Provide the deployer private key via `DEPLOYER_PRIVATE_KEY` (hex, 0x...)
      accounts: process.env.PRIVATE_KEY
        ? [process.env.PRIVATE_KEY]
        : ["0xc481469161d16c3ed3f09d6945ebbc2f76ea76fe75b1b8349cf643c4d7606ab3"],
      chainId: 1983,
      // Increase the network connection timeout (milliseconds) in case the RPC is slow.
      timeout: 600000,
    },
  },
};