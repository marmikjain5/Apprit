# Blockchain-Based Digital File Approval System for Colleges

This repository houses a full-stack, secure, and verifiable digital file approval system designed for collegiate workflows (e.g., degree issuing, transcript verification, department sign-offs). It features a multi-service architecture using modern enterprise and blockchain technologies.

---

## 🏛️ System Architecture

The project is divided into three primary services:

1. **`backend-springboot`**: Core enterprise J2EE backend handling user roles, JWT authentication, department workflow transitions, database persistence, and service routing.
2. **`frontend-angular`**: Modern TypeScript Single Page Application dashboard allowing students to upload files and view status, and deans/registrars to manage approval queues.
3. **`blockchain-service`**: FastAPI Python microservice acting as a Web3/IPFS bridge. It handles SHA-256 document hashing, decentralized IPFS pinning, and Ethereum/Polygon Smart Contract transaction signing.

---

## 📂 Project Directory Structure

```text
.
├── backend-springboot/          # Java Spring Boot Core API (Maven)
├── frontend-angular/            # Angular SPA Client App
├── blockchain-service/          # FastAPI Python Web3 microservice
│   └── contracts/               # Solidity Smart Contracts (DocumentApproval.sol)
└── README.md                    # Main Project Guide
```

---

## 🚀 Getting Started

### 1. Backend Setup (Spring Boot)
- **Prerequisites:** Java 21+, Maven 3.9+
- **Configuration:** Update database properties in `backend-springboot/src/main/resources/application.properties` (or `application.yml`).
- **Run the server:**
  ```powershell
  cd backend-springboot
  ./mvnw spring-boot:run
  ```
- **REST Endpoint:** Core REST APIs run on `http://localhost:8080/api/v1`

---

### 2. Blockchain Service Setup (FastAPI & Smart Contracts)
- **Prerequisites:** Python 3.10+, Node.js (for smart contract testing/deployment using Hardhat)
- **Installation:**
  ```powershell
  cd blockchain-service
  python -m venv venv
  .\venv\Scripts\Activate
  pip install -r requirements.txt
  ```
- **Running the service:**
  ```powershell
  python main.py
  ```
- **Interactive OpenAPI Documentation:** Available at `http://localhost:8000/docs`

---

### 3. Frontend Setup (Angular)
- **Prerequisites:** Node.js v18+, Angular CLI
- **Installation:**
  ```powershell
  cd frontend-angular
  npm install
  ```
- **Run the Development Server:**
  ```powershell
  npm start
  ```
- **App Dashboard:** Open `http://localhost:4200` in your web browser.

---

## 🔒 Security & Verifiability

- **Workflow Verification:** Every document registered generates a unique cryptographic SHA-256 fingerprint.
- **Ledger Immutability:** The document status is pinned to IPFS and recorded permanently on-chain in the `DocumentApproval` contract.
- **Role-based Actions:** Standard users upload documents, authorized keys (dean/registrars) execute on-chain smart contract state transitions.
