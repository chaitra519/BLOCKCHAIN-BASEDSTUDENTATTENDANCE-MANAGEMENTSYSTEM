
import { network } from "hardhat";
import { writeFileSync } from "node:fs";

const { ethers } = await network.connect();

async function main() {
  const [admin] = await ethers.getSigners();

  const attendance = await ethers.deployContract("Attendance");
  await attendance.waitForDeployment();

  const address = await attendance.getAddress();

  writeFileSync(
    "deployment.json",
    JSON.stringify(
      {
        contractAddress: address,
        network: "hardhat-local",
        admin: admin.address
      },
      null,
      2
    )
  );

  console.log("Attendance contract deployed!");
  console.log("Contract address:", address);
  console.log("Admin address:", admin.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
