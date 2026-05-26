package com.institution.approval.repository.mongo;

import com.institution.approval.document.ApprovalDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApprovalDocumentRepository extends MongoRepository<ApprovalDocument, String> {
    List<ApprovalDocument> findByUploadedBy(Long uploadedBy);
    List<ApprovalDocument> findByDeptIdAndCurrentLevelAndStatus(Long deptId, Integer currentLevel, String status);
}