package com.institution.approval.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "blockchain_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockchainRecord {
    @Id
    private String id;
    
    private String documentId;
    private String transactionHash;
    private Long blockNumber;
    private String actionType; // DOCUMENT_CREATED, APPROVAL_RECORDED
    
    @Builder.Default
    private LocalDateTime recordedAt = LocalDateTime.now();
}
