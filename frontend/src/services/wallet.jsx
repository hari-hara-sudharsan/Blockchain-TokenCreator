import { ethers } from "ethers";

export async function connectWallet() {
  if (!window.ethereum) {
    alert("No QIE Wallet / MetaMask found");
    return null;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
}

export async function getSigner() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  return await provider.getSigner();
}
