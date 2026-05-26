package com.marmik.apprit.approval.controller;

import com.marmik.apprit.approval.model.ApprovalDocument;
import com.marmik.apprit.approval.model.User;
import com.marmik.apprit.approval.service.DocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
@Slf4j
public class DocumentController {

    private final DocumentService documentService;

    /**
     * POST /api/documents/upload
     * Accepts multipart form — file, title, description, deptId
     */
    @PostMapping("/upload")
    public ResponseEntity<?> upload(
            @RequestParam("file")        MultipartFile file,
            @RequestParam("title")       String title,
            @RequestParam(value = "description", defaultValue = "") String description,
            @RequestParam("deptId")      Integer deptId) {
        try {
            String username = getCurrentUsername();
            ApprovalDocument saved = documentService.uploadDocument(file, title, description, deptId, username);
            return ResponseEntity.ok(Map.of(
                    "message",        "Document submitted successfully!",
                    "id",             saved.getId(),
                    "title",          saved.getTitle(),
                    "ipfsCid",        saved.getIpfsCid(),
                    "ipfsUrl",        saved.getIpfsUrl(),
                    "fileHashSha256", saved.getFileHashSha256(),
                    "status",         saved.getStatus()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Upload error for user {}", getCurrentUsername(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Upload failed: " + e.getMessage()));
        }
    }

    /**
     * GET /api/documents/my
     * Returns all documents submitted by the logged-in student
     */
    @GetMapping("/my")
    public ResponseEntity<List<ApprovalDocument>> myDocuments() {
        long start = System.currentTimeMillis();
        String username = getCurrentUsername();
        log.info("Incoming request: GET /api/documents/my for user '{}'", username);
        List<ApprovalDocument> docs = documentService.getMyDocuments(username);
        log.info("Request GET /api/documents/my completed. Fetched {} docs in {}ms.", docs.size(), (System.currentTimeMillis() - start));
        return ResponseEntity.ok(docs);
    }

    /**
     * GET /api/documents/pending
     * Returns all PENDING documents (for authority inbox)
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ApprovalDocument>> pendingDocuments() {
        long start = System.currentTimeMillis();
        log.info("Incoming request: GET /api/documents/pending");
        List<ApprovalDocument> docs = documentService.getPendingDocuments();
        log.info("Request GET /api/documents/pending completed. Fetched {} docs in {}ms.", docs.size(), (System.currentTimeMillis() - start));
        return ResponseEntity.ok(docs);
    }

    /**
     * GET /api/documents/reviewed
     * Returns approved/rejected documents (for authority history)
     */
    @GetMapping("/reviewed")
    public ResponseEntity<List<ApprovalDocument>> reviewedDocuments() {
        long start = System.currentTimeMillis();
        log.info("Incoming request: GET /api/documents/reviewed");
        List<ApprovalDocument> docs = documentService.getReviewedDocuments();
        log.info("Request GET /api/documents/reviewed completed. Fetched {} docs in {}ms.", docs.size(), (System.currentTimeMillis() - start));
        return ResponseEntity.ok(docs);
    }

    /**
     * POST /api/documents/{id}/approve
     * Body: { "comment": "..." }
     */
    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable String id,
                                     @RequestBody(required = false) Map<String, String> body) {
        try {
            String reviewer = getCurrentUsername();
            String comment  = body != null ? body.getOrDefault("comment", "") : "";
            ApprovalDocument doc = documentService.approveDocument(id, reviewer, comment);
            return ResponseEntity.ok(Map.of(
                    "message", "Document approved and recorded.",
                    "status",  doc.getStatus(),
                    "id",      doc.getId()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Approve error for doc {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Approval failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/documents/{id}/reject
     * Body: { "comment": "..." }
     */
    @PostMapping("/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable String id,
                                    @RequestBody Map<String, String> body) {
        try {
            String reviewer = getCurrentUsername();
            String comment  = body.getOrDefault("comment", "");
            if (comment.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "A rejection reason/comment is required."));
            }
            ApprovalDocument doc = documentService.rejectDocument(id, reviewer, comment);
            return ResponseEntity.ok(Map.of(
                    "message", "Document rejected.",
                    "status",  doc.getStatus(),
                    "id",      doc.getId()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Reject error for doc {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Rejection failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/documents/{id}/request-changes
     * Body: { "comment": "..." }
     */
    @PostMapping("/{id}/request-changes")
    public ResponseEntity<?> requestChanges(@PathVariable String id,
                                            @RequestBody Map<String, String> body) {
        try {
            String reviewer = getCurrentUsername();
            String comment  = body.getOrDefault("comment", "");
            if (comment.isBlank()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "A comment explaining required changes is mandatory."));
            }
            ApprovalDocument doc = documentService.requestChanges(id, reviewer, comment);
            return ResponseEntity.ok(Map.of(
                    "message", "Changes requested.",
                    "status",  doc.getStatus(),
                    "id",      doc.getId()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Request changes error for doc {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Request failed: " + e.getMessage()));
        }
    }

    /**
     * POST /api/documents/{id}/reupload
     * Accepts multipart form — file
     */
    @PostMapping("/{id}/reupload")
    public ResponseEntity<?> reupload(@PathVariable String id,
                                      @RequestParam("file") MultipartFile file) {
        try {
            String username = getCurrentUsername();
            ApprovalDocument saved = documentService.reuploadDocument(id, file, username);
            return ResponseEntity.ok(Map.of(
                    "message",        "Document re-uploaded successfully!",
                    "id",             saved.getId(),
                    "status",         saved.getStatus()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Re-upload error for doc {} by user {}", id, getCurrentUsername(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Re-upload failed: " + e.getMessage()));
        }
    }

    /** Extract username from the current JWT-authenticated principal */
    private String getCurrentUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) throw new RuntimeException("Not authenticated");
        Object principal = auth.getPrincipal();
        if (principal instanceof User user) return user.getUsername();
        return principal.toString();
    }
}
