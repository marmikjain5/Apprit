// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DocumentApproval
 * @dev Decentralized record system for verifiable digital file approvals.
 * It stores document hashes, metadata URIs, and cryptographic signatures of collegiate authorities.
 */
contract DocumentApproval {

    enum Status { NonExistent, Pending, Approved, Rejected }

    struct Document {
        bytes32 docHash;          // SHA-256 hash of the digital document
        string metadataURI;       // Decentratized storage (IPFS/Arweave) link with metadata
        Status status;            // Current approval status
        address submitter;        // Address that registered the document
        uint256 submissionTime;   // Block timestamp when registered
        uint256 completionTime;   // Block timestamp when final action is recorded
        address[] approvers;      // List of addresses that signed off
    }

    // Mapping from document hash (SHA-256 bytes32) to Document info
    mapping(bytes32 => Document) private documents;

    // Authorized college registrars/dean addresses who can approve
    mapping(address => bool) public authorizedApprovers;

    // Contract owner
    address public owner;

    // Events
    event ApproverAuthorized(address indexed approver);
    event ApproverRevoked(address indexed approver);
    event DocumentSubmitted(bytes32 indexed docHash, address indexed submitter, string metadataURI);
    event DocumentStatusChanged(bytes32 indexed docHash, Status status, address indexed actor);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier onlyAuthorized() {
        require(authorizedApprovers[msg.sender], "Caller is not an authorized college approver");
        _;
    }

    constructor() {
        owner = msg.sender;
        authorizedApprovers[msg.sender] = true;
        emit ApproverAuthorized(msg.sender);
    }

    /**
     * @dev Authorize a collegiate authority (e.g. Registrar, Dean, HOD)
     */
    function authorizeApprover(address _approver) external onlyOwner {
        authorizedApprovers[_approver] = true;
        emit ApproverAuthorized(_approver);
    }

    /**
     * @dev Revoke authority from an address
     */
    function revokeApprover(address _approver) external onlyOwner {
        authorizedApprovers[_approver] = false;
        emit ApproverRevoked(_approver);
    }

    /**
     * @dev Submit a document hash for approval.
     */
    function submitDocument(bytes32 _docHash, string calldata _metadataURI) external {
        require(documents[_docHash].status == Status.NonExistent, "Document hash already exists");

        Document storage doc = documents[_docHash];
        doc.docHash = _docHash;
        doc.metadataURI = _metadataURI;
        doc.status = Status.Pending;
        doc.submitter = msg.sender;
        doc.submissionTime = block.timestamp;

        emit DocumentSubmitted(_docHash, msg.sender, _metadataURI);
    }

    /**
     * @dev Record an official approval for a pending document.
     */
    function approveDocument(bytes32 _docHash) external onlyAuthorized {
        require(documents[_docHash].status == Status.Pending, "Document is not in PENDING state");
        
        Document storage doc = documents[_docHash];
        
        // Prevent duplicate approval from the same authority
        for (uint i = 0; i < doc.approvers.length; i++) {
            require(doc.approvers[i] != msg.sender, "Authority has already approved this document");
        }

        doc.approvers.push(msg.sender);
        
        // For simple workflow: First authorized signature marks it as APPROVED
        // This can be expanded to multi-signature threshold logic
        doc.status = Status.Approved;
        doc.completionTime = block.timestamp;

        emit DocumentStatusChanged(_docHash, Status.Approved, msg.sender);
    }

    /**
     * @dev Reject a document.
     */
    function rejectDocument(bytes32 _docHash) external onlyAuthorized {
        require(documents[_docHash].status == Status.Pending, "Document is not in PENDING state");
        
        Document storage doc = documents[_docHash];
        doc.status = Status.Rejected;
        doc.completionTime = block.timestamp;

        emit DocumentStatusChanged(_docHash, Status.Rejected, msg.sender);
    }

    /**
     * @dev Verify if a document is registered and get its details.
     */
    function getDocumentDetails(bytes32 _docHash) external view returns (
        bytes32 docHash,
        string memory metadataURI,
        Status status,
        address submitter,
        uint256 submissionTime,
        uint256 completionTime,
        address[] memory approvers
    ) {
        Document memory doc = documents[_docHash];
        require(doc.status != Status.NonExistent, "Document is not registered");
        return (
            doc.docHash,
            doc.metadataURI,
            doc.status,
            doc.submitter,
            doc.submissionTime,
            doc.completionTime,
            doc.approvers
        );
    }
}
