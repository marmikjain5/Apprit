package com.institution.approval.repository;

import com.institution.approval.entity.AuthorityMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AuthorityMappingRepository extends JpaRepository<AuthorityMapping, Long> {
    List<AuthorityMapping> findByDepartment_DeptIdOrderByLevelOrderAsc(Long deptId);
    Optional<AuthorityMapping> findByDepartment_DeptIdAndLevelOrder(Long deptId, Integer levelOrder);
}
