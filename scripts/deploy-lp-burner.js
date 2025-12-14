const hre = require("hardhat")

async function main() {
  const Burner = await hre.ethers.getContractFactory("LPBurner")
  const burner = await Burner.deploy()
  await burner.waitForDeployment()

  console.log("LPBurner deployed at:", await burner.getAddress())
}

main().catch(console.error)