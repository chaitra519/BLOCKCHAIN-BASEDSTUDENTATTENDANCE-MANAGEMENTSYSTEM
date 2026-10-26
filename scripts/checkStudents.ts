
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress =
    "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

  const attendance = await ethers.getContractAt(
    "Attendance",
    contractAddress
  );

  const ids = await attendance.getAllStudentIds();

  console.log("Total registered students:", ids.length);

  for (const id of ids) {
    const [name, exists] = await attendance.getStudent(id);
    console.log(`ID: ${id} | Name: ${name} | Exists: ${exists}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
