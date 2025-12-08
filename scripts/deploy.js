// const hre = require("hardhat");

// async function main() {
//   console.log("Deploying SafeMintLaunchPad to QIE Testnet...");

//   const LaunchPad = await hre.ethers.getContractFactory("SafeMintLaunchPad");
//   const launchpad = await LaunchPad.deploy();

//   await launchpad.waitForDeployment();
  
//   const address = await launchpad.getAddress();
//   console.log("");
//   console.log("SUCCESS! SafeMintLaunchPad deployed to:");
//   console.log(address);
//   console.log("");
//   console.log("Copy this address and paste it into your frontend App.jsx:");
//   console.log(`const LAUNCHPAD_ADDRESS = "${address}";`);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });


const hre = require("hardhat");

async function main() {
  const router = "0xA795c4D885522d5e37956265837636b023445871"; // QIEDex Router
  const factory = "0x"; // Replace after deploying SafeMintFactory

  const LaunchPad = await hre.ethers.getContractFactory("SafeMintLaunchPad");
  const launchpad = await LaunchPad.deploy(router, factory);

  await launchpad.waitForDeployment();

  console.log("SafeMint LaunchPad deployed at:", await launchpad.getAddress());
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
