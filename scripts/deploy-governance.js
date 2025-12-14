const hre = require("hardhat")

async function main() {
  const G = await hre.ethers.getContractFactory("Governance")
  const g = await G.deploy()
  await g.waitForDeployment()

  console.log("Governance deployed to:", await g.getAddress())
}

main().catch(console.error)