package com.marmik.apprit.approval.service;

import com.marmik.apprit.approval.client.PinataClient;
import com.marmik.apprit.approval.model.ApprovalDocument;
import com.marmik.apprit.approval.model.User;
import com.marmik.apprit.approval.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final PinataClient pinataClient;

    // Mapping of dept IDs to human-readable labels
    private static final Map<Integer, String> DEPT_LABELS = Map.of(
            1, "CSE HOD",
            2, "ISE HOD",
            3, "ECE HOD",
            4, "ME HOD",
            5, "Civil HOD",
            6, "Vice Principal",
            7, "Principal"
    );

    /**
     * Handles document upload:
     * 1. Compute SHA-256 hash of file bytes
     * 2. Pin file to Pinata IPFS
     * 3. Save document metadata to MongoDB
     */
    public ApprovalDocument uploadDocument(MultipartFile file,
                                           String title,
                                           String description,
                                           Integer deptId,
                                           String uploaderUsername) throws IOException {

        // Validate file type
        String filename = file.getOriginalFilename() != null
                ? file.getOriginalFilename() : "document";
        String ext = filename.contains(".")
                ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase() : "";
        if (!ext.equals("pdf") && !ext.equals("docx")) {
            throw new IllegalArgumentException("Only PDF and DOCX files are allowed.");
        }

        // 1. Compute SHA-256
        String sha256 = computeSha256(file.getBytes());
        log.info("SHA-256 for '{}': {}", filename, sha256);

        // 2. Pin to Pinata IPFS
        PinataClient.PinResult pinResult = pinataClient.pinFile(file, filename);
        log.info("IPFS CID: {} | URL: {}", pinResult.ipfsCid(), pinResult.ipfsUrl());

        // 3. Build and save document
        ApprovalDocument doc = ApprovalDocument.builder()
                .title(title)
                .description(description)
                .uploaderUsername(uploaderUsername)
                .originalFilename(filename)
                .contentType(file.getContentType())
                .fileHashSha256(sha256)
                .ipfsCid(pinResult.ipfsCid())
                .ipfsUrl(pinResult.ipfsUrl())
                .targetDeptId(deptId)
                .targetDeptLabel(DEPT_LABELS.getOrDefault(deptId, "Unknown"))
                .status("PENDING")
                .uploadedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Add initial audit entry
        doc.getAuditTrail().add(ApprovalDocument.AuditEntry.builder()
                .action("SUBMITTED")
                .actorUsername(uploaderUsername)
                .comment("Document submitted for approval")
                .timestamp(LocalDateTime.now())
                .build());

        ApprovalDocument saved = documentRepository.save(doc);
        log.info("Document saved to MongoDB with id: {}", saved.getId());
        return saved;
    }

    /** Get all documents submitted by a specific student */
    public List<ApprovalDocument> getMyDocuments(String username) {
        return documentRepository.findByUploaderUsernameOrderByUploadedAtDesc(username);
    }

    /** Get all PENDING documents (for authority inbox) */
    public List<ApprovalDocument> getPendingDocuments() {
        return documentRepository.findByStatusOrderByUploadedAtAsc("PENDING");
    }

    /** Get all reviewed (approved/rejected) documents */
    public List<ApprovalDocument> getReviewedDocuments() {
        return documentRepository.findByStatusNotOrderByUpdatedAtDesc("PENDING");
    }

    /** Approve a document */
    public ApprovalDocument approveDocument(String docId, String reviewerUsername, String comment) {
        ApprovalDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + docId));

        doc.setStatus("APPROVED");
        doc.setReviewedByUsername(reviewerUsername);
        doc.setReviewComment(comment);
        doc.setUpdatedAt(LocalDateTime.now());
        doc.getAuditTrail().add(ApprovalDocument.AuditEntry.builder()
                .action("APPROVED")
                .actorUsername(reviewerUsername)
                .comment(comment)
                .timestamp(LocalDateTime.now())
                .build());

        log.info("Document '{}' APPROVED by '{}'", docId, reviewerUsername);
        return documentRepository.save(doc);
    }

    /** Reject a document */
    public ApprovalDocument rejectDocument(String docId, String reviewerUsername, String comment) {
        ApprovalDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + docId));

        doc.setStatus("REJECTED");
        doc.setReviewedByUsername(reviewerUsername);
        doc.setReviewComment(comment);
        doc.setUpdatedAt(LocalDateTime.now());
        doc.getAuditTrail().add(ApprovalDocument.AuditEntry.builder()
                .action("REJECTED")
                .actorUsername(reviewerUsername)
                .comment(comment)
                .timestamp(LocalDateTime.now())
                .build());

        log.info("Document '{}' REJECTED by '{}'. Reason: {}", docId, reviewerUsername, comment);
        return documentRepository.save(doc);
    }

    /** Request changes for a document */
    public ApprovalDocument requestChanges(String docId, String reviewerUsername, String comment) {
        ApprovalDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + docId));

        doc.setStatus("CHANGES_REQUESTED");
        doc.setReviewedByUsername(reviewerUsername);
        doc.setReviewComment(comment);
        doc.setUpdatedAt(LocalDateTime.now());
        doc.getAuditTrail().add(ApprovalDocument.AuditEntry.builder()
                .action("CHANGES_REQUESTED")
                .actorUsername(reviewerUsername)
                .comment(comment)
                .timestamp(LocalDateTime.now())
                .build());

        log.info("Document '{}' changes requested by '{}'. Reason: {}", docId, reviewerUsername, comment);
        return documentRepository.save(doc);
    }

    /** Re-upload a document for an existing request */
    public ApprovalDocument reuploadDocument(String docId, MultipartFile file, String uploaderUsername) throws IOException {
        ApprovalDocument doc = documentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("Document not found: " + docId));

        if (!doc.getUploaderUsername().equals(uploaderUsername)) {
            throw new IllegalArgumentException("You can only re-upload your own documents.");
        }

        // Validate file type
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document";
        String ext = filename.contains(".") ? filename.substring(filename.lastIndexOf('.') + 1).toLowerCase() : "";
        if (!ext.equals("pdf") && !ext.equals("docx")) {
            throw new IllegalArgumentException("Only PDF and DOCX files are allowed.");
        }

        // 1. Compute SHA-256
        String sha256 = computeSha256(file.getBytes());
        log.info("SHA-256 for '{}' (re-upload): {}", filename, sha256);

        // 2. Pin to Pinata IPFS
        PinataClient.PinResult pinResult = pinataClient.pinFile(file, filename);
        log.info("IPFS CID (re-upload): {} | URL: {}", pinResult.ipfsCid(), pinResult.ipfsUrl());

        // 3. Update document metadata
        doc.setOriginalFilename(filename);
        doc.setContentType(file.getContentType());
        doc.setFileHashSha256(sha256);
        doc.setIpfsCid(pinResult.ipfsCid());
        doc.setIpfsUrl(pinResult.ipfsUrl());
        doc.setStatus("PENDING"); // Or IN_REVIEW, but PENDING puts it back in inbox
        doc.setUpdatedAt(LocalDateTime.now());

        doc.getAuditTrail().add(ApprovalDocument.AuditEntry.builder()
                .action("RE_UPLOADED")
                .actorUsername(uploaderUsername)
                .comment("Document re-uploaded after changes requested")
                .timestamp(LocalDateTime.now())
                .build());

        log.info("Document '{}' RE-UPLOADED by '{}'", docId, uploaderUsername);
        return documentRepository.save(doc);
    }

    /** Compute SHA-256 hex digest of byte array */
    private String computeSha256(byte[] bytes) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(bytes);
            return HexFormat.of().formatHex(hash);
        } catch (Exception e) {
            throw new RuntimeException("Failed to compute SHA-256 hash", e);
        }
    }
}
