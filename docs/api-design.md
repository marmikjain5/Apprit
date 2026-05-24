# REST API Design

This document outlines the RESTful API endpoints for the Blockchain-Based Digital Signature and Approval Management System.

---

## 1. Authentication Endpoints

### 1.1 User Registration
- **Method**: `POST`
- **URL**: `/api/auth/register`
- **Auth Requirement**: Public (No JWT)
- **Request Body**:
```json
{
  "username": "johndoe",
  "email": "johndoe@college.edu",
  "password": "Password123",
  "firstName": "John",
  "lastName": "Doe",
  "deptId": 1,
  "roles": ["ROLE_STUDENT"]
}
```
- **Response Body**:
```json
{
  "message": "User registered successfully!"
}
```

### 1.2 User Login
- **Method**: `POST`
- **URL**: `/api/auth/login`
- **Auth Requirement**: Public (No JWT)
- **Request Body**:
```json
{
  "username": "johndoe",
  "password": "Password123"
}
```
- **Response Body**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "id": 101,
  "username": "johndoe",
  "email": "johndoe@college.edu",
  "roles": ["ROLE_STUDENT"]
}
```

---

## 2. Document Management Endpoints

### 2.1 Upload Document
- **Method**: `POST`
- **URL**: `/api/documents/upload`
- **Auth Requirement**: `Bearer JWT` (Any Role)
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: (Binary File, PDF)
  - `title`: "Tech Fest Budget"
  - `description`: "Budget proposal for Tech Fest 2024"
  - `deptId`: 5
- **Response Body**:
```json
{
  "id": "65ab3f98c12a",
  "title": "Tech Fest Budget",
  "fileName": "1675204812_budget.pdf",
  "fileUrl": "/uploads/documents/1675204812_budget.pdf",
  "fileHashSha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  "uploadedBy": 101,
  "status": "PENDING",
  "currentLevel": 1
}
```

### 2.2 Get My Documents
- **Method**: `GET`
- **URL**: `/api/documents/my-documents`
- **Auth Requirement**: `Bearer JWT` (Any Role)
- **Response Body**:
```json
[
  {
    "id": "65ab3f98c12a",
    "title": "Tech Fest Budget",
    "status": "PENDING",
    "createdAt": "2024-02-01T10:00:00"
  }
]
```

### 2.3 Get Specific Document
- **Method**: `GET`
- **URL**: `/api/documents/{id}`
- **Auth Requirement**: `Bearer JWT` (Any Role)
- **Response Body**: (Full Document JSON Object)

---

## 3. Approval Workflow Endpoints

### 3.1 Get Pending Documents for Approver
- **Method**: `GET`
- **URL**: `/api/approvals/pending?deptId=5&level=1`
- **Auth Requirement**: `Bearer JWT` (Authority Roles e.g. HOD, Dean)
- **Response Body**:
```json
[
  {
    "id": "65ab3f98c12a",
    "title": "Tech Fest Budget",
    "uploadedBy": 101,
    "status": "PENDING",
    "currentLevel": 1
  }
]
```

### 3.2 Process Approval (Approve / Reject)
- **Method**: `POST`
- **URL**: `/api/approvals/{documentId}/process`
- **Auth Requirement**: `Bearer JWT` (Authority Roles)
- **Request Body**:
```json
{
  "action": "APPROVED", 
  "comments": "Looks good, proceeding to next level."
}
```
*(Action can be "APPROVED" or "REJECTED")*
- **Response Body**:
```json
{
  "id": "65ab3f98c12a",
  "status": "PARTIALLY_APPROVED",
  "currentLevel": 2
}
```

---

## 4. Blockchain & Audit Endpoints

### 4.1 Get Document Approval History
- **Method**: `GET`
- **URL**: `/api/audit/history/{documentId}`
- **Auth Requirement**: `Bearer JWT`
- **Response Body**:
```json
[
  {
    "id": "65ab3f9bc44d",
    "documentId": "65ab3f98c12a",
    "approverRole": "ROLE_FACULTY",
    "action": "APPROVED",
    "comments": "Verified initial details.",
    "level": 1,
    "timestamp": "2024-02-01T11:00:00"
  }
]
```

### 4.2 Get Blockchain Records
- **Method**: `GET`
- **URL**: `/api/audit/blockchain/{documentId}`
- **Auth Requirement**: `Bearer JWT`
- **Response Body**:
```json
[
  {
    "id": "65ab3f9a77cc",
    "documentId": "65ab3f98c12a",
    "transactionHash": "0xabc123456789...",
    "blockNumber": 1450234,
    "actionType": "DOCUMENT_CREATED",
    "recordedAt": "2024-02-01T10:00:05"
  },
  {
    "id": "65ab3f9dc45e",
    "documentId": "65ab3f98c12a",
    "transactionHash": "0xdef987654321...",
    "blockNumber": 1450250,
    "actionType": "APPROVAL_RECORDED_APPROVED",
    "recordedAt": "2024-02-01T11:00:10"
  }
]
```

---

## 5. Notification Endpoints

### 5.1 Get My Notifications
- **Method**: `GET`
- **URL**: `/api/notifications/my-notifications`
- **Auth Requirement**: `Bearer JWT`
- **Response Body**:
```json
[
  {
    "id": "65ab3f9ec67f",
    "message": "Your document was approved by Faculty.",
    "documentId": "65ab3f98c12a",
    "isRead": false,
    "createdAt": "2024-02-01T11:00:01"
  }
]
```

### 5.2 Mark Notification as Read
- **Method**: `PATCH`
- **URL**: `/api/notifications/{notificationId}/read`
- **Auth Requirement**: `Bearer JWT`
- **Response Body**:
```json
{
  "message": "Notification marked as read."
}
```
