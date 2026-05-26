// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentApproval {

    struct ApprovalRecord {
        address approverAddress;
        string action; // "APPROVED" or "REJECTED"
        uint256 timestamp;
    }

    struct Document {
        string sha256Hash;
        uint256 uploadedBy;
        bool exists;
        ApprovalRecord[] approvalHistory;
    }

    // Mapping from documentId (string) to Document
    mapping(string => Document) private documents;

    // Events
    event DocumentStored(string indexed documentId, string sha256Hash, uint256 uploadedBy);
    event ApprovalRecorded(string indexed documentId, address indexed approverAddress, string action);

    // 1. Store the initial document hash
    function storeDocumentHash(string memory _docId, string memory _sha256Hash, uint256 _uploadedBy) public {
        require(!documents[_docId].exists, "Document already exists on blockchain!");

        Document storage doc = documents[_docId];
        doc.sha256Hash = _sha256Hash;
        doc.uploadedBy = _uploadedBy;
        doc.exists = true;

        emit DocumentStored(_docId, _sha256Hash, _uploadedBy);
    }

    // 2. Record an approval action
    function recordApproval(string memory _docId, string memory _action) public {
        require(documents[_docId].exists, "Document does not exist!");
        
        Document storage doc = documents[_docId];
        doc.approvalHistory.push(ApprovalRecord({
            approverAddress: msg.sender,
            action: _action,
            timestamp: block.timestamp
        }));

        emit ApprovalRecorded(_docId, msg.sender, _action);
    }

    // 3. Verify if a given hash matches the stored document hash
    function verifyDocumentHash(string memory _docId, string memory _hashToVerify) public view returns (bool) {
        require(documents[_docId].exists, "Document does not exist!");
        
        // String comparison in Solidity requires keccak256 hashing
        return keccak256(abi.encodePacked(documents[_docId].sha256Hash)) == keccak256(abi.encodePacked(_hashToVerify));
    }

    // 4. Retrieve the full approval history of a document
    function getApprovalHistory(string memory _docId) public view returns (ApprovalRecord[] memory) {
        require(documents[_docId].exists, "Document does not exist!");
        return documents[_docId].approvalHistory;
    }
}
