package com.marmik.apprit.approval.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalDocument {

    @Id
    private String id;

    private String title;
    private String description;

    /** Username of the student who submitted */
    private String uploaderUsername;

    /** Original filename */
    private String originalFilename;

    /** MIME type: application/pdf or .docx */
    private String contentType;

    /** SHA-256 hex digest of the file bytes */
    private String fileHashSha256;

    /** IPFS CID returned by Pinata after pinning */
    private String ipfsCid;

    /** Full IPFS gateway URL for viewing/download */
    private String ipfsUrl;

    /**
     * Target approval authority ID:
     * 1=CSE HOD, 2=ISE HOD, 3=ECE HOD, 4=ME HOD, 5=Civil HOD,
     * 6=Vice Principal, 7=Principal
     */
    private Integer targetDeptId;
    private String targetDeptLabel;

    /**
     * Current status: PENDING | IN_REVIEW | APPROVED | REJECTED
     */
    @Builder.Default
    private String status = "PENDING";

    /** Username of the authority who last acted */
    private String reviewedByUsername;

    /** Comment left by the reviewer */
    private String reviewComment;

    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;

    /** Audit trail — list of every action taken */
    @Builder.Default
    private List<AuditEntry> auditTrail = new ArrayList<>();

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuditEntry {
        private String action;          // SUBMITTED | APPROVED | REJECTED
        private String actorUsername;
        private String comment;
        private LocalDateTime timestamp;
    }
}
