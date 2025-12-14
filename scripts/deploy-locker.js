const hre = require("hardhat")

async function main() {
  const Locker = await hre.ethers.getContractFactory("LiquidityLocker")
  const locker = await Locker.deploy()
  await locker.waitForDeployment()

  console.log("LiquidityLocker deployed to:", await locker.getAddress())
}

main().catch(console.error)