
import { ethers } from "ethers";
import contractArtifact from "../../artifacts/contracts/Attendance.sol/Attendance.json";

const CONTRACT_ADDRESS = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

export async function connectContract() {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask first.");
  }

  // Open MetaMask and request account access.
  await window.ethereum.request({
    method: "wallet_requestPermissions",
    params: [{ eth_accounts: {} }],
  });

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  if (!accounts.length) {
    throw new Error("No MetaMask account selected.");
  }

  // Check the local Hardhat network.
  const chainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (chainId !== "0x7a69") {
    throw new Error("Please switch MetaMask to Hardhat Local (Chain ID 31337).");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner(accounts[0]);

  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractArtifact.abi,
    signer
  );

  return {
    contract,
    account: accounts[0],
  };
}
