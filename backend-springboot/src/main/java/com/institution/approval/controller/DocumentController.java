package com.institution.approval.controller;

import com.institution.approval.document.ApprovalDocument;
import com.institution.approval.security.UserDetailsImpl;
import com.institution.approval.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("deptId") Long deptId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            ApprovalDocument document = documentService.uploadDocument(file, title, description, userDetails.getId(), deptId);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not upload the file: " + e.getMessage());
        }
    }

    @GetMapping("/my-documents")
    public ResponseEntity<List<ApprovalDocument>> getMyDocuments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ApprovalDocument> documents = documentService.getDocumentsByUser(userDetails.getId());
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<ApprovalDocument>> getPendingDocuments(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        List<ApprovalDocument> documents = documentService.getPendingDocumentsForUser(userDetails.getId());
        return ResponseEntity.ok(documents);
    }

    @PutMapping("/{id}/resubmit")
    public ResponseEntity<?> resubmitDocument(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            ApprovalDocument document = documentService.resubmitDocument(id, file, title, description, userDetails.getId());
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Could not resubmit the file: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApprovalDocument> getDocument(@PathVariable String id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }
}
