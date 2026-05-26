package com.institution.approval.service;

import com.institution.approval.document.ApprovalDocument;
import com.institution.approval.document.ApprovalLog;
import com.institution.approval.entity.AuthorityMapping;
import com.institution.approval.entity.User;
import com.institution.approval.repository.ApprovalDocumentRepository;
import com.institution.approval.repository.ApprovalLogRepository;
import com.institution.approval.repository.AuthorityMappingRepository;
import com.institution.approval.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApprovalWorkflowService {

    @Autowired
    private ApprovalDocumentRepository documentRepository;

    @Autowired
    private ApprovalLogRepository approvalLogRepository;

    @Autowired
    private AuthorityMappingRepository authorityMappingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private NotificationService notificationService;

    public ApprovalDocument processApproval(String documentId, Long approverId, String action, String comments) {
        ApprovalDocument document = documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));

        User approver = userRepository.findById(approverId)
                .orElseThrow(() -> new RuntimeException("Approver not found"));

        if (!document.getStatus().equals("PENDING") && !document.getStatus().equals("PARTIALLY_APPROVED")) {
            throw new RuntimeException("Document is already fully approved or rejected.");
        }

        // Verify the approver is authorized for the current level
        AuthorityMapping currentMapping = authorityMappingRepository
                .findByDepartment_DeptIdAndLevelOrder(document.getDeptId(), document.getCurrentLevel())
                .orElseThrow(() -> new RuntimeException("Workflow mapping not found for current level."));

        boolean hasRole = approver.getRoles().stream()
                .anyMatch(r -> r.getRoleName().equals(currentMapping.getRequiredRole().getRoleName()));

        if (!hasRole) {
            throw new RuntimeException("User does not have the required role to approve at this level.");
        }

        // Record Approval Log
        ApprovalLog log = ApprovalLog.builder()
                .documentId(documentId)
                .approverId(approverId)
                .approverRole(currentMapping.getRequiredRole().getRoleName())
                .action(action)
                .comments(comments)
                .level(document.getCurrentLevel())
                .build();
        approvalLogRepository.save(log);

        // Record on blockchain
        blockchainService.recordApprovalOnChain(documentId, approverId, action);

        // Update Document State
        if (action.equalsIgnoreCase("REJECTED")) {
            document.setStatus("REJECTED");
            document.setUpdatedAt(LocalDateTime.now());
            documentRepository.save(document);
            notificationService.sendNotification(document.getUploadedBy(), documentId, "Your document was REJECTED.");
            return document;
        }

        // Action is APPROVED. Check if there are more levels.
        List<AuthorityMapping> mappings = authorityMappingRepository
                .findByDepartment_DeptIdOrderByLevelOrderAsc(document.getDeptId());
        
        int maxLevel = mappings.size();

        if (document.getCurrentLevel() >= maxLevel) {
            document.setStatus("APPROVED");
            notificationService.sendNotification(document.getUploadedBy(), documentId, "Your document was fully APPROVED!");
        } else {
            document.setStatus("PARTIALLY_APPROVED");
            document.setCurrentLevel(document.getCurrentLevel() + 1);
            notificationService.sendNotification(document.getUploadedBy(), documentId, "Your document passed level " + (document.getCurrentLevel()-1));
        }

        document.setUpdatedAt(LocalDateTime.now());
        return documentRepository.save(document);
    }
}
