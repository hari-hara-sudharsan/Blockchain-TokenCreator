const hre = require("hardhat");

async function main() {
  const ROUTER_ADDRESS = hre.ethers.ZeroAddress; // ✅ SIMULATION MODE
  const LP_LOCKER_ADDRESS = "0x8b69B344A79AF0BDfB2632cE501Ec380bBDBf1C8";

  const Factory = await hre.ethers.getContractFactory("LaunchFactory");
  const factory = await Factory.deploy(
    ROUTER_ADDRESS,
    LP_LOCKER_ADDRESS
  );

  await factory.waitForDeployment();
  console.log("✅ LaunchFactory deployed to:", await factory.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});