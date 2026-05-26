package com.marmik.apprit.approval.repository;

import com.marmik.apprit.approval.model.ApprovalDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends MongoRepository<ApprovalDocument, String> {

    /** All docs submitted by a student */
    List<ApprovalDocument> findByUploaderUsernameOrderByUploadedAtDesc(String uploaderUsername);

    /** All docs with PENDING status (for authority inbox) */
    List<ApprovalDocument> findByStatusOrderByUploadedAtAsc(String status);

    /** All docs NOT pending (for history view) */
    List<ApprovalDocument> findByStatusNotOrderByUpdatedAtDesc(String status);

    /** Docs pending for a specific target dept */
    List<ApprovalDocument> findByStatusAndTargetDeptId(String status, Integer targetDeptId);
}
