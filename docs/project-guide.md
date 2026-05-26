# Project Guide: Roadmap, Deployment & Best Practices

## STEP 10 — DEVELOPMENT ROADMAP

Here is the week-by-week implementation strategy for completing the mini-project:

- **Phase 1: Project Setup & DB Config (Completed)**
  - Scaffold Spring Boot, Angular, and Hardhat projects.
  - Set up `docker-compose.yml` for Oracle DB and MongoDB.
- **Phase 2: Authentication Module (Backend + Frontend)**
  - Implement JWT Security in Spring Boot.
  - Create Oracle Users and Roles tables.
  - Build Angular Login/Register components and `AuthGuard`.
- **Phase 3: Document Upload Module**
  - Implement Multipart file handling in Spring Boot.
  - Generate SHA-256 hashes for uploaded PDFs.
  - Build the Angular Drag-and-Drop file uploader UI.
- **Phase 4: Approval Workflow Engine**
  - Map Authority Hierarchies in Oracle DB.
  - Implement the multi-level state machine in Spring Boot Services.
  - Build the Authority Dashboard in Angular.
- **Phase 5: Blockchain Integration**
  - Write and deploy `DocumentApproval.sol` to a local Hardhat network.
  - Integrate Web3j in Spring Boot to store document hashes.
- **Phase 6: Notifications & Audit**
  - Implement MongoDB `ApprovalLogs` and `BlockchainRecords`.
  - Build the real-time Notifications Panel UI.
- **Phase 7: UI Polish & Testing**
  - Apply Angular Material theming.
  - Perform End-to-End API testing using Postman.
- **Phase 8: Presentation & Deployment**
  - Write final reports and record a project demo.

---

## STEP 11 — DEPLOYMENT GUIDE

To run the entire system locally on your development machine, follow these steps in separate terminal windows:

### 1. Start Databases
Make sure Docker Desktop is running.
```powershell
cd Apprit
docker-compose up -d
```
*(Wait 1-2 minutes for Oracle XE to fully initialize).*

### 2. Start Blockchain Network
```powershell
cd Apprit/blockchain
npm install
npm run node
```
Keep this terminal open. It runs a local Ethereum network at `http://127.0.0.1:8545`.

In another terminal, deploy the smart contract:
```powershell
cd Apprit/blockchain
npm run deploy:local
```
**Important:** Copy the deployed contract address from the console output and paste it into your `backend-springboot/src/main/resources/application.properties` under `blockchain.contract.address`.

### 3. Start Backend Server
```powershell
cd Apprit/backend-springboot
./mvnw spring-boot:run
```
The REST API will be available at `http://localhost:8080/api/v1`.

### 4. Start Frontend Web App
```powershell
cd Apprit/frontend-angular
npm install
ng serve
```
Open your browser to `http://localhost:4200`.

---

## STEP 12 — BEST PRACTICES & FUTURE SCOPE

### Best Practices Implemented
1. **Security First**: Passwords are never stored in plaintext (BCrypt hashing). APIs are secured via stateless JWTs. Cross-Origin Resource Sharing (CORS) is restricted to the frontend URL.
2. **Polyglot Persistence**: The system smartly leverages Oracle DB for strict relational mapping (Users/Roles) and MongoDB for flexible, rapidly-changing unstructured data (Logs/Notifications).
3. **Immutability & Zero-Trust**: By storing the SHA-256 hash of a file on a decentralized blockchain instead of the file itself, the system proves the existence and integrity of a document without exposing sensitive data to the public ledger.

### Future Enhancements (Post-Project Scope)
1. **IPFS Integration**: Instead of storing PDFs locally (`/uploads`), push them to the InterPlanetary File System (IPFS) and store the `CID` on the blockchain for a fully decentralized storage layer.
2. **AI Document Classification**: Integrate OCR (Optical Character Recognition) and an LLM to automatically categorize uploaded documents (e.g., "Budget", "Leave Request") and auto-assign them to the correct department.
3. **Email Integration**: Integrate AWS SES or JavaMailSender to send actual email alerts when a document is approved or rejected, rather than just in-app notifications.
4. **Mobile App**: Build a Flutter or React Native mobile application for Deans/HODs to approve documents on the go.
