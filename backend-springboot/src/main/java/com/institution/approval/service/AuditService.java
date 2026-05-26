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

    public List<ApprovalLog> getDocumentApprovalHistory(String documentId) {
        return approvalLogRepository.findByDocumentIdOrderByTimestampAsc(documentId);
    }

    public List<BlockchainRecord> getDocumentBlockchainRecords(String documentId) {
        return blockchainRecordRepository.findByDocumentIdOrderByRecordedAtAsc(documentId);
    }
}
