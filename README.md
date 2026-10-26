# ⛓️ Blockchain-Based Student Attendance Management System

A web-based student attendance management system that uses blockchain technology and smart contracts to record and manage attendance transparently.

## 📌 Project Overview

Traditional attendance systems may allow records to be changed without a clear history of those changes. This project explores how blockchain technology can help maintain reliable attendance records.

The system uses a Solidity smart contract deployed on a local Hardhat blockchain, with a React frontend that interacts with the contract through Ethers.js.

The project is developed as an academic project to demonstrate the practical use of blockchain technology in student attendance management.

## ✨ Features

- **Student Management:** Manage student attendance information.
- **Blockchain Integration:** Use a Solidity smart contract to handle attendance-related operations.
- **Faculty Authorization:** Support authorization of faculty wallet addresses.
- **Attendance Tracking:** Record attendance against students and subjects.
- **Attendance History:** View recorded attendance information through the frontend.
- **Smart Contract Security:** Apply contract-level rules to control permitted operations.
- **MetaMask Integration:** Connect a compatible wallet to interact with the blockchain, where configured.
- **Local Blockchain Testing:** Develop and test the application using Hardhat.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| JavaScript | Frontend logic |
| Solidity | Smart contract development |
| Hardhat | Smart contract compilation, deployment, and local blockchain testing |
| Ethers.js | Communication between the frontend and smart contract |
| Node.js | JavaScript runtime |
| npm | Dependency management |
| MetaMask | Blockchain wallet interaction, where configured |

## 🏗️ System Architecture

The application follows this basic workflow:

1. The user interacts with the React frontend.
2. Ethers.js connects the frontend to the blockchain provider and smart contract.
3. The Solidity contract processes attendance-related transactions.
4. The local blockchain records successful transactions.
5. The frontend displays the available attendance information.

```text
        User
         |
         v
   React Frontend
         |
         v
      Ethers.js
         |
         v
 Solidity Smart Contract
         |
         v
   Hardhat Blockchain
         |
         v
 Attendance Records
```

## 📂 Project Structure

```text
BLOCKCHAIN-BASEDSTUDENTATTENDANCE-MANAGEMENTSYSTEM/
│
├── contracts/
│   └── Attendance.sol
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── contract.js
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── scripts/
│   ├── deploy.ts
│   ├── authorizeFaculty.ts
│   ├── setupAttendance.ts
│   ├── checkStudents.ts
│   └── verifyAttendance.ts
│
├── test/
├── hardhat.config.ts
├── package.json
├── package-lock.json
└── README.md
```

*Note: The structure above highlights the main project files. Other development and test files may also be present.*

## ⚙️ Requirements

Before running the project, install:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) browser extension, if required by your frontend configuration

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/chaitra519/BLOCKCHAIN-BASEDSTUDENTATTENDANCE-MANAGEMENTSYSTEM.git
```

Navigate to the project folder:

```bash
cd BLOCKCHAIN-BASEDSTUDENTATTENDANCE-MANAGEMENTSYSTEM
```

### 2. Install the root dependencies

```bash
npm install
```

### 3. Compile the smart contract

```bash
npx hardhat compile
```

### 4. Start the local blockchain

Open a terminal in the project folder and run:

```bash
npx hardhat node
```

Keep this terminal running. Hardhat will display local test accounts and the local network information.

### 5. Deploy the smart contract

Open a second terminal in the same project folder and run:

```bash
npx hardhat run scripts/deploy.ts --network localhost
```

Use the contract address printed by the deployment command when configuring the frontend.

### 6. Configure the frontend

Open a third terminal and run:

```bash
cd frontend
npm install
```

Check `src/contract.js` and make sure the contract address and ABI match the contract deployed on your local Hardhat network.

If MetaMask is required, configure it to use the local Hardhat network and connect an appropriate local test account. Never use a real wallet's private key or seed phrase in project files.

### 7. Run the frontend

From the `frontend` directory, run:

```bash
npm run dev
```

Open the local URL printed by Vite in your browser, usually:

```text
http://localhost:5173
```

If Vite displays a different port, open the URL shown in your terminal.

**Important:** The local Hardhat node must remain running while you use the application. If you restart the local blockchain, you may need to deploy the contract again and update the frontend contract address.

## 📸 Screenshots

Add screenshots of your actual running application in this section.

### 1. Application Dashboard

![Application Dashboard](screenshots/dashboard.png)

*The main dashboard of the student attendance system.*

### 2. Student Management

![Student Management](screenshots/student-management.png)

*The student management interface.*

### 3. Attendance Management

![Attendance Management](screenshots/attendance-management.png)

*The attendance marking interface.*

### 4. Attendance History

![Attendance History](screenshots/attendance-history.png)

*The attendance history and available records.*

### 5. Smart Contract Deployment

![Smart Contract Deployment](screenshots/contract-deployment.png)

*The smart contract deployment on the local Hardhat network.*

**To add screenshots:** Create a folder named `screenshots` in the root project directory, save your screenshots there using the filenames above, and push the files to GitHub. Replace the placeholder images with screenshots of features that actually exist in your application.

## 🔐 Security and Limitations

- The current setup uses a local Hardhat blockchain for development and testing.
- Blockchain transactions depend on the rules implemented in the smart contract.
- The local test accounts and their private keys are for development only.
- A local deployment is not a public production deployment.
- A production version would require further testing, access-control review, secure configuration, and deployment to a suitable network.

## 🔮 Future Enhancements

- Deploy the smart contract to a suitable public test network.
- Improve attendance reports and percentage calculations.
- Add additional role-based access controls.
- Improve the user interface and mobile responsiveness.
- Add exportable attendance reports.
- Conduct more comprehensive smart contract tests.

## 🎓 Learning Outcomes

This project demonstrates the use of:

- Blockchain concepts in attendance management.
- Solidity smart contract development.
- React-based frontend development.
- Ethers.js for blockchain interaction.
- Hardhat for local blockchain development and testing.

## 👩‍💻 Author

**Chaitra Chagantipati**

GitHub: [@chaitra519](https://github.com/chaitra519)

## 📄 License

A license has not yet been specified. Add an appropriate license file if you intend to publish the project for reuse by others.


## 🎥 Project Presentation Video

Watch the presentation video of the **Blockchain-Based Student Attendance Management System**.

▶️ [**Watch Project Presentation Video**](https://drive.google.com/file/d/1P7Rv95TwbOnVVwHZI8PA9cTryjhLRgVK/view?usp=sharing)
