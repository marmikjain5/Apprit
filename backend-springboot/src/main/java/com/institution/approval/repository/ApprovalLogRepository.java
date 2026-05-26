package com.institution.approval.repository;

import com.institution.approval.document.ApprovalLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ApprovalLogRepository extends MongoRepository<ApprovalLog, String> {
    List<ApprovalLog> findByDocumentIdOrderByTimestampAsc(String documentId);
}
