package com.institution.approval.controller;

import com.institution.approval.dto.ApprovalRequest;
import com.institution.approval.security.UserDetailsImpl;
import com.institution.approval.service.ApprovalWorkflowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/approvals")
public class ApprovalController {

    @Autowired
    private ApprovalWorkflowService approvalWorkflowService;

    @PostMapping("/{documentId}/process")
    public ResponseEntity<?> processApproval(
            @PathVariable String documentId,
            @RequestBody ApprovalRequest approvalRequest,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            return ResponseEntity.ok(
                approvalWorkflowService.processApproval(
                    documentId, 
                    userDetails.getId(), 
                    approvalRequest.getAction(), 
                    approvalRequest.getComments()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error processing approval: " + e.getMessage());
        }
    }
}
