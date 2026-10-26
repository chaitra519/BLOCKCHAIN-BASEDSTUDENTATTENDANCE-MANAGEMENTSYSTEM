
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();
  const [admin, faculty] = await ethers.getSigners();

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const attendance = await ethers.getContractAt(
    "Attendance",
    contractAddress,
    admin
  );

  const tx = await attendance.authorizeFaculty(faculty.address);
  await tx.wait();

  console.log("Admin:", admin.address);
  console.log("Authorized faculty:", faculty.address);
  console.log("Faculty authorization successful!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
