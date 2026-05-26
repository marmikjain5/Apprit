package com.institution.approval.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "approval_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApprovalLog {

    @Id
    private String id;

    private String documentId;

    private Long timestamp;

    private Long approverId;

    private String approverName;

    private String approverRole;

    private String action;

    private String comments;

    private Integer level;
}