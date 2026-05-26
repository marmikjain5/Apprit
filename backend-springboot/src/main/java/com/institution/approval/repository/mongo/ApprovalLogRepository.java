package com.institution.approval.repository.mongo;

import com.institution.approval.document.ApprovalLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalLogRepository extends MongoRepository<ApprovalLog, String> {

    List<ApprovalLog> findByDocumentIdOrderByTimestampAsc(String documentId);

}