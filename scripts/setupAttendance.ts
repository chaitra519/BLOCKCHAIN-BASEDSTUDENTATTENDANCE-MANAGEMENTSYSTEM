
import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const [admin] = await ethers.getSigners();

  const contractAddress =
    "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

  const attendance = await ethers.getContractAt(
    "Attendance",
    contractAddress,
    admin
  );

  const students = [
    { id: "23501A0501", name: "Chaitra" },
    { id: "23501A0502", name: "Bhavana" },
    { id: "23501A0503", name: "Charitha Sri" },
    { id: "23501A0504", name: "Gnana Deepika" },
  ];

  console.log("Using contract:", contractAddress);
  console.log("Admin account:", admin.address);

  for (const student of students) {
    const [, exists] = await attendance.getStudent(student.id);

    if (!exists) {
      const tx = await attendance.addStudent(
        student.id,
        student.name
      );

      await tx.wait();

      console.log(
        `Added: ${student.name} (${student.id})`
      );
    } else {
      console.log(
        `Already registered: ${student.name} (${student.id})`
      );
    }
  }

  const allIds = await attendance.getAllStudentIds();

  console.log("Total registered students:", allIds.length);
  console.log("Student registration complete!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
