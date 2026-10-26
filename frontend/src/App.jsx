
import { useState } from "react";
import { connectContract } from "./contract";
import "./App.css";

const ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

function App() {
  const [students, setStudents] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [newStudentId, setNewStudentId] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [facultyAddress, setFacultyAddress] = useState("");
  const [subject, setSubject] = useState("Blockchain Technology");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const isAdmin =
    account.toLowerCase() === ADMIN_ADDRESS.toLowerCase();

  async function loadStudents(attendanceContract, selectedSubject = subject) {
    try {
      const ids = await attendanceContract.getAllStudentIds();
      const studentList = [];

      for (const id of ids) {
        const [name, exists] = await attendanceContract.getStudent(id);
        if (exists) {
          studentList.push({ id, name, status: "Not Marked" });
        }
      }

      const count = Number(await attendanceContract.getRecordCount());
      const latestByStudent = new Map();
      const allRecords = [];

      for (let i = 0; i < count; i++) {
        const record = await attendanceContract.getAttendanceRecord(i);

        const item = {
          id: i,
          studentId: record[0],
          subject: record[1],
          timestamp: Number(record[2]),
          isPresent: record[3],
          markedBy: record[4],
        };

        allRecords.push(item);

        if (item.subject === selectedSubject) {
          const previous = latestByStudent.get(item.studentId);
          if (!previous || item.timestamp >= previous.timestamp) {
            latestByStudent.set(item.studentId, item);
          }
        }
      }

      setStudents(
        studentList.map((student) => {
          const record = latestByStudent.get(student.id);
          return {
            ...student,
            status: record
              ? record.isPresent
                ? "Present"
                : "Absent"
              : "Not Marked",
          };
        })
      );

      setAttendanceHistory(allRecords.reverse());
      setMessage(
        `Loaded ${studentList.length} students and ${count} attendance records from the blockchain.`
      );
    } catch (error) {
      setMessage(
        error.shortMessage ||
          error.message ||
          "Could not load blockchain data. Check the network and contract address."
      );
    }
  }

  async function handleConnect() {
    try {
      setMessage("Connecting to MetaMask...");
      const result = await connectContract();

      setContract(result.contract);
      setAccount(result.account);

      await loadStudents(result.contract);
    } catch (error) {
      setMessage(error.shortMessage || error.message || "Connection failed.");
    }
  }

  async function updateAttendance(id, status) {
    if (!contract) {
      setMessage("Please connect MetaMask first.");
      return;
    }

    try {
      setBusy(true);
      setMessage("Sending attendance transaction...");

      const transaction = await contract.markAttendance(
        id,
        subject,
        status === "Present"
      );

      await transaction.wait();
      await loadStudents(contract);
      setMessage(`Attendance saved on blockchain for ${id}.`);
    } catch (error) {
      setMessage(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Transaction failed."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleAddStudent(event) {
    event.preventDefault();

    if (!contract || !isAdmin) {
      setMessage("Connect the admin wallet to register students.");
      return;
    }

    const id = newStudentId.trim();
    const name = newStudentName.trim();

    if (!id || !name) {
      setMessage("Please enter both student ID and name.");
      return;
    }

    try {
      setBusy(true);
      setMessage("Registering student on the blockchain...");

      const transaction = await contract.addStudent(id, name);
      await transaction.wait();

      setNewStudentId("");
      setNewStudentName("");

      await loadStudents(contract);
      setMessage(`Student ${name} registered successfully.`);
    } catch (error) {
      setMessage(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Could not register student."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleAuthorizeFaculty(event) {
    event.preventDefault();

    if (!contract || !isAdmin) {
      setMessage("Connect the admin wallet to authorize faculty.");
      return;
    }

    const address = facultyAddress.trim();

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      setMessage("Please enter a valid wallet address.");
      return;
    }

    try {
      setBusy(true);
      setMessage("Authorizing faculty on the blockchain...");

      const transaction = await contract.authorizeFaculty(address);
      await transaction.wait();

      setFacultyAddress("");
      setMessage(`Faculty wallet ${address} authorized successfully.`);
    } catch (error) {
      setMessage(
        error.reason ||
          error.shortMessage ||
          error.message ||
          "Could not authorize faculty."
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleSubjectChange(event) {
    const nextSubject = event.target.value;
    setSubject(nextSubject);

    if (contract) {
      await loadStudents(contract, nextSubject);
    } else {
      setStudents((previous) =>
        previous.map((student) => ({
          ...student,
          status: "Not Marked",
        }))
      );
    }
  }

  // Build reports from all records for the selected subject.
  const reports = students.map((student) => {
    const records = attendanceHistory.filter(
      (record) =>
        record.studentId === student.id &&
        record.subject === subject
    );

    const attended = records.filter((record) => record.isPresent).length;
    const total = records.length;
    const percentage =
      total > 0 ? Math.round((attended / total) * 100) : 0;

    return { ...student, attended, total, percentage };
  });

  const presentCount = students.filter(
    (student) => student.status === "Present"
  ).length;

  const absentCount = students.filter(
    (student) => student.status === "Absent"
  ).length;

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Student Attendance System</h1>
          <p>Blockchain-Based Attendance Management</p>
        </div>

        <button onClick={handleConnect}>
          {account
            ? `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect MetaMask"}
        </button>
      </header>

      <main className="container">
        <section className="welcome">
          <h2>Attendance Dashboard</h2>
          <p>Manage students and record attendance on Hardhat.</p>
          <p><strong>Subject:</strong> {subject}</p>
          {account && (
            <p>
              <strong>Role:</strong>{" "}
              {isAdmin ? "Administrator" : "Faculty / Other Wallet"}
            </p>
          )}
        </section>

        {isAdmin && (
          <>
            <section className="attendance-card">
              <h2>Admin Dashboard — Add Student</h2>
              <p>Register a new student on the blockchain.</p>

              <form onSubmit={handleAddStudent}>
                <div>
                  <label htmlFor="studentId">Student ID</label>
                  <input
                    id="studentId"
                    value={newStudentId}
                    onChange={(event) => setNewStudentId(event.target.value)}
                    placeholder="Enter student ID"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="studentName">Student Name</label>
                  <input
                    id="studentName"
                    value={newStudentName}
                    onChange={(event) => setNewStudentName(event.target.value)}
                    placeholder="Enter student name"
                    required
                  />
                </div>
                <button type="submit" disabled={busy || !contract}>
                  {busy ? "Please wait..." : "Add Student"}
                </button>
              </form>
            </section>

            <section className="attendance-card">
              <h2>Authorize Faculty</h2>
              <p>Enter the faculty member's MetaMask wallet address.</p>

              <form onSubmit={handleAuthorizeFaculty}>
                <div>
                  <label htmlFor="facultyAddress">Faculty Wallet Address</label>
                  <input
                    id="facultyAddress"
                    value={facultyAddress}
                    onChange={(event) => setFacultyAddress(event.target.value)}
                    placeholder="0x..."
                    required
                  />
                </div>
                <button type="submit" disabled={busy || !contract}>
                  {busy ? "Please wait..." : "Authorize Faculty"}
                </button>
              </form>
            </section>
          </>
        )}

        <section className="stats">
          <div className="stat-card">
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
          <div className="stat-card">
            <p>Present</p>
            <h2>{presentCount}</h2>
          </div>
          <div className="stat-card">
            <p>Absent</p>
            <h2>{absentCount}</h2>
          </div>
        </section>

        <section className="attendance-card">
          <div className="section-heading">
            <div>
              <h2>Mark Attendance</h2>
              <p>Connect an authorized faculty wallet to record attendance.</p>
            </div>

            <select value={subject} onChange={handleSubjectChange}>
              <option>Blockchain Technology</option>
              <option>Data Mining</option>
              <option>Artificial Intelligence</option>
              <option>Computer Networks</option>
            </select>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>
                      <span
                        className={
                          student.status === "Present"
                            ? "status present"
                            : student.status === "Absent"
                              ? "status absent"
                              : "status"
                        }
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="present-button"
                        disabled={busy || !contract}
                        onClick={() => updateAttendance(student.id, "Present")}
                      >
                        Present
                      </button>
                      <button
                        className="absent-button"
                        disabled={busy || !contract}
                        onClick={() => updateAttendance(student.id, "Absent")}
                      >
                        Absent
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4">No students loaded. Connect MetaMask.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Attendance Percentage Reports */}
        <section className="attendance-card">
          <div className="section-heading">
            <div>
              <h2>Attendance Percentage Reports</h2>
              <p>
                Report for {subject}. Each recorded attendance entry counts
                as one class record.
              </p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Attended</th>
                  <th>Total Records</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.name}</td>
                    <td>{report.attended}</td>
                    <td>{report.total}</td>
                    <td>
                      <span
                        className={
                          report.total === 0
                            ? "status"
                            : report.percentage >= 75
                              ? "status present"
                              : "status absent"
                        }
                      >
                        {report.total > 0 ? `${report.percentage}%` : "N/A"}
                      </span>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      Connect MetaMask to load attendance reports.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Attendance History */}
        <section className="attendance-card history-card">
          <div className="section-heading">
            <div>
              <h2>Attendance History</h2>
              <p>All attendance records retrieved from the blockchain.</p>
            </div>
            <button
              onClick={() => contract && loadStudents(contract)}
              disabled={!contract}
            >
              Refresh History
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Subject</th>
                  <th>Date &amp; Time</th>
                  <th>Status</th>
                  <th>Faculty Wallet</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.length > 0 ? (
                  attendanceHistory.map((record) => (
                    <tr key={record.id}>
                      <td>{record.studentId}</td>
                      <td>{record.subject}</td>
                      <td>
                        {new Date(record.timestamp * 1000).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={
                            record.isPresent
                              ? "status present"
                              : "status absent"
                          }
                        >
                          {record.isPresent ? "Present" : "Absent"}
                        </span>
                      </td>
                      <td title={record.markedBy}>
                        {record.markedBy.slice(0, 6)}...
                        {record.markedBy.slice(-4)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">
                      No attendance history loaded. Connect MetaMask first.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {message && <p className="note">{message}</p>}
      </main>
    </div>
  );
}

export default App;
