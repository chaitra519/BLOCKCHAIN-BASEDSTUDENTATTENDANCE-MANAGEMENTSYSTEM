
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const contractAddress =
    "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const attendance = await ethers.getContractAt(
    "Attendance",
    contractAddress
  );

  const count = await attendance.getRecordCount();

  console.log("Total blockchain attendance records:", count.toString());

  for (let i = 0; i < Number(count); i++) {
    const record = await attendance.getAttendanceRecord(i);

    console.log(`\nRecord ${i + 1}`);
    console.log("Student ID:", record[0]);
    console.log("Subject:", record[1]);
    console.log(
      "Time:",
      new Date(Number(record[2]) * 1000).toLocaleString()
    );
    console.log("Present:", record[3]);
    console.log("Marked by:", record[4]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
