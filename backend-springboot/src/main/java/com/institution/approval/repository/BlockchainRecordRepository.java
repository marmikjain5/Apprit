package com.institution.approval.repository;

import com.institution.approval.document.BlockchainRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface BlockchainRecordRepository extends MongoRepository<BlockchainRecord, String> {
    List<BlockchainRecord> findByDocumentIdOrderByRecordedAtAsc(String documentId);
}
