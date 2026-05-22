from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import hashlib
from typing import Optional
import os

app = FastAPI(
    title="College Blockchain File Approval Service",
    description="Microservice for cryptographic hashing, IPFS pinning, and Ethereum/Polygon Smart Contract interaction.",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this in production to Spring Boot backend or Angular URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class DocumentVerificationRequest(BaseModel):
    document_hash: str
    blockchain_tx_id: Optional[str] = None

class DocumentApprovalRequest(BaseModel):
    document_hash: str
    approver_address: str
    signature: str

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Blockchain File Approval Microservice",
        "web3_connected": False,  # Will configure provider connection later
        "message": "Welcome. Use POST /api/v1/documents/hash to generate standard file hashes."
    }

@app.post("/api/v1/documents/hash", summary="Generate SHA-256 hash of a file")
async def generate_file_hash(file: UploadFile = File(...)):
    """
    Computes the SHA-256 hash of an uploaded file.
    This hash serves as the immutable digital fingerprint on the blockchain.
    """
    try:
        sha256_hash = hashlib.sha256()
        # Read file in chunks to handle larger files efficiently
        while chunk := await file.read(8192):
            sha256_hash.update(chunk)
        
        file_hash = sha256_hash.hexdigest()
        
        return {
            "filename": file.filename,
            "content_type": file.content_type,
            "sha256": file_hash
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@app.post("/api/v1/documents/verify", summary="Verify file hash integrity on-chain")
def verify_document(request: DocumentVerificationRequest):
    """
    Verifies if a document hash exists on-ledger and gets its status (Pending, Approved, Rejected).
    """
    # This is a placeholder for actual smart contract reading logic via Web3.py
    return {
        "document_hash": request.document_hash,
        "is_verified": False,
        "status": "Not Found On Chain",
        "message": "Smart contract integration pending configuration."
    }

@app.post("/api/v1/documents/approve", summary="Record a new approval transaction")
def approve_document(request: DocumentApprovalRequest):
    """
    Records an approval signature onto the blockchain smart contract.
    """
    # This is a placeholder for smart contract transaction signing and broadcasting
    return {
        "document_hash": request.document_hash,
        "approver": request.approver_address,
        "status": "Simulated Success",
        "transaction_hash": "0x4b78...6789"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
