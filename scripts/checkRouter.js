const hre = require("hardhat");

async function main() {
  const routerAddr = "0x30a5184a2B7067D5A0352CA4B616Ecf2a4bbFF6f";

  const router = await hre.ethers.getContractAt(
    [
      "function factory() external view returns (address)",
      "function WETH() external view returns (address)"
    ],
    routerAddr
  );

  console.log("Factory:", await router.factory());
  console.log("WETH:", await router.WETH());
}

main();
