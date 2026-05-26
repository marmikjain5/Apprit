package com.institution.approval.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "approval_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalLog {
    @Id
    private String id;
    private String documentId;
    
    private Long approverId;
    private String approverRole;
    private String action; // APPROVED, REJECTED
    private String comments;
    private Integer level;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
