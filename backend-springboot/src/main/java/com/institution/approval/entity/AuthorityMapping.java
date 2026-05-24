package com.institution.approval.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "authority_mappings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"dept_id", "level_order"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthorityMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long mappingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dept_id", nullable = false)
    private Department department;

    @Column(name = "level_order", nullable = false)
    private Integer levelOrder; // e.g., 1 (Faculty), 2 (HOD), 3 (Dean)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    private Role requiredRole;
}
