package com.institution.approval.repository;

import com.institution.approval.document.ApprovalDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ApprovalDocumentRepository extends MongoRepository<ApprovalDocument, String> {
    List<ApprovalDocument> findByUploadedBy(Long userId);
    List<ApprovalDocument> findByDeptIdAndCurrentLevelAndStatus(Long deptId, Integer currentLevel, String status);
    List<ApprovalDocument> findByDeptId(Long deptId);
}
