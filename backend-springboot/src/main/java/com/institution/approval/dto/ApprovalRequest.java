package com.institution.approval.dto;

import lombok.Data;

@Data
public class ApprovalRequest {
    private String action; // APPROVED, REJECTED
    private String comments;
}
