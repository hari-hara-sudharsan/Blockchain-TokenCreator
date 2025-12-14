const hre = require("hardhat")

async function main() {
  const V = await hre.ethers.getContractFactory("ValidatorStaking")
  const v = await V.deploy()
  await v.waitForDeployment()

  console.log("ValidatorStaking deployed to:", await v.getAddress())
}

main().catch(console.error)