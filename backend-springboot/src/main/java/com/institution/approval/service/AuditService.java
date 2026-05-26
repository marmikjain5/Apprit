package com.institution.approval.service;

import com.institution.approval.document.ApprovalLog;
import com.institution.approval.document.BlockchainRecord;
import com.institution.approval.repository.mongo.ApprovalLogRepository;
import com.institution.approval.repository.mongo.BlockchainRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    @Autowired
    private ApprovalLogRepository approvalLogRepository;

    @Autowired
    private BlockchainRecordRepository blockchainRecordRepository;

    @Autowired
    private com.institution.approval.repository.UserRepository userRepository;

    public List<ApprovalLog> getDocumentApprovalHistory(String documentId) {
        List<ApprovalLog> logs = approvalLogRepository.findByDocumentIdOrderByTimestampAsc(documentId);
        for (ApprovalLog log : logs) {
            if (log.getApproverName() == null || log.getApproverName().trim().isEmpty()) {
                userRepository.findById(log.getApproverId()).ifPresent(user -> {
                    String fullName = "";
                    if (user.getFirstName() != null && !user.getFirstName().isEmpty()) {
                        fullName = user.getFirstName() + " " + (user.getLastName() != null ? user.getLastName() : "");
                    }
                    if (fullName.trim().isEmpty()) {
                        fullName = user.getUsername();
                    }
                    log.setApproverName(fullName);
                });
            }
        }
        return logs;
    }

    public List<BlockchainRecord> getDocumentBlockchainRecords(String documentId) {
        return blockchainRecordRepository.findByDocumentIdOrderByRecordedAtAsc(documentId);
    }
}
