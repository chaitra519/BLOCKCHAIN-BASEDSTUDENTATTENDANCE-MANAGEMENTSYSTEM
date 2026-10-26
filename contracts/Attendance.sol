
 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Attendance {
    address public admin;

    struct Student {
        string name;
        bool exists;
    }

    struct AttendanceRecord {
        string studentId;
        string subject;
        uint256 timestamp;
        bool isPresent;
        address markedBy;
    }

    mapping(string => Student) private students;
    string[] private studentIds;

    mapping(address => bool) public authorizedFaculty;

    AttendanceRecord[] private records;

    event StudentAdded(string studentId, string name);
    event FacultyAuthorized(address faculty);

    event AttendanceMarked(
        string studentId,
        string subject,
        uint256 timestamp,
        bool isPresent,
        address markedBy
    );

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier onlyFaculty() {
        require(
            authorizedFaculty[msg.sender],
            "Not authorized faculty"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // Register a new student
    function addStudent(
        string memory studentId,
        string memory name
    ) external onlyAdmin {
        require(
            bytes(studentId).length > 0,
            "Student ID required"
        );

        require(
            bytes(name).length > 0,
            "Student name required"
        );

        require(
            !students[studentId].exists,
            "Student already exists"
        );

        students[studentId] = Student(name, true);
        studentIds.push(studentId);

        emit StudentAdded(studentId, name);
    }

    // Authorize a faculty wallet
    function authorizeFaculty(address faculty)
        external
        onlyAdmin
    {
        require(
            faculty != address(0),
            "Invalid address"
        );

        authorizedFaculty[faculty] = true;

        emit FacultyAuthorized(faculty);
    }

    // Mark attendance
    function markAttendance(
        string memory studentId,
        string memory subject,
        bool isPresent
    ) external onlyFaculty {
        require(
            students[studentId].exists,
            "Student not found"
        );

        require(
            bytes(subject).length > 0,
            "Subject required"
        );

        uint256 currentTime = block.timestamp;

        records.push(
            AttendanceRecord(
                studentId,
                subject,
                currentTime,
                isPresent,
                msg.sender
            )
        );

        emit AttendanceMarked(
            studentId,
            subject,
            currentTime,
            isPresent,
            msg.sender
        );
    }

    // Get one student's details
    function getStudent(string memory studentId)
        external
        view
        returns (string memory, bool)
    {
        Student memory student = students[studentId];

        return (student.name, student.exists);
    }

    // Get all registered student IDs
    function getAllStudentIds()
        external
        view
        returns (string[] memory)
    {
        return studentIds;
    }

    // Get total attendance records
    function getRecordCount()
        external
        view
        returns (uint256)
    {
        return records.length;
    }

    // Get one attendance record by index
    function getAttendanceRecord(uint256 index)
        external
        view
        returns (
            string memory,
            string memory,
            uint256,
            bool,
            address
        )
    {
        require(
            index < records.length,
            "Invalid index"
        );

        AttendanceRecord memory record = records[index];

        return (
            record.studentId,
            record.subject,
            record.timestamp,
            record.isPresent,
            record.markedBy
        );
    }
}
