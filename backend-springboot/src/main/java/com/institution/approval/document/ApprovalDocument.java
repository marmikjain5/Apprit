package com.institution.approval.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalDocument {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String fileName;
    private String fileUrl;
    private String fileHashSha256;
    
    // Relational references mapped logically
    private Long uploadedBy; 
    private Long deptId;
    
    private String status; // PENDING, PARTIALLY_APPROVED, APPROVED, REJECTED
    @Builder.Default
    private Integer currentLevel = 1;
    
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}
