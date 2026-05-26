package com.institution.approval.config;

import com.institution.approval.entity.AuthorityMapping;
import com.institution.approval.entity.Department;
import com.institution.approval.entity.Role;
import com.institution.approval.repository.AuthorityMappingRepository;
import com.institution.approval.repository.DepartmentRepository;
import com.institution.approval.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AuthorityMappingRepository authorityMappingRepository;

    @Override
    public void run(String... args) throws Exception {
        // Seed default roles if not present
        List<String> defaultRoles = Arrays.asList(
                "ROLE_STUDENT", 
                "ROLE_CLUB",
                "ROLE_FACULTY", 
                "ROLE_HOD", 
                "ROLE_DEAN", 
                "ROLE_VICE_PRINCIPAL", 
                "ROLE_PRINCIPAL"
        );
        for (String roleName : defaultRoles) {
            if (!roleRepository.findByRoleName(roleName).isPresent()) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
                System.out.println("Seeded role: " + roleName);
            }
        }

        // Seed default departments if not present
        List<String> defaultDepts = Arrays.asList(
                "Computer Science & Engineering",
                "Information Science & Engineering",
                "Electronics & Communication Engineering",
                "Mechanical Engineering",
                "Civil Engineering",
                "Vice Principal's Office",
                "Principal's Office"
        );
        for (String deptName : defaultDepts) {
            if (!departmentRepository.findByDeptName(deptName).isPresent()) {
                Department dept = new Department();
                dept.setDeptName(deptName);
                departmentRepository.save(dept);
                System.out.println("Seeded department: " + deptName);
            }
        }

        // Seed authority mappings for workflow levels
        seedAuthorityMappings();
    }

    private void seedAuthorityMappings() {
        // Mappings for Academic Departments (CSE, ISE, ECE, ME, Civil)
        // IDs are 1 to 5 based on seeding order
        Role hodRole = roleRepository.findByRoleName("ROLE_HOD").orElseThrow();
        Role deanRole = roleRepository.findByRoleName("ROLE_DEAN").orElseThrow();

        for (long deptId = 1; deptId <= 5; deptId++) {
            Department dept = departmentRepository.findById(deptId).orElse(null);
            if (dept != null) {
                // Level 1 HOD Mapping
                if (!authorityMappingRepository.findByDepartment_DeptIdAndLevelOrder(deptId, 1).isPresent()) {
                    AuthorityMapping map1 = AuthorityMapping.builder()
                            .department(dept)
                            .levelOrder(1)
                            .requiredRole(hodRole)
                            .build();
                    authorityMappingRepository.save(map1);
                    System.out.println("Seeded Level 1 HOD mapping for: " + dept.getDeptName());
                }

                // Level 2 Dean Mapping
                if (!authorityMappingRepository.findByDepartment_DeptIdAndLevelOrder(deptId, 2).isPresent()) {
                    AuthorityMapping map2 = AuthorityMapping.builder()
                            .department(dept)
                            .levelOrder(2)
                            .requiredRole(deanRole)
                            .build();
                    authorityMappingRepository.save(map2);
                    System.out.println("Seeded Level 2 Dean mapping for: " + dept.getDeptName());
                }
            }
        }

        // Mapping for Vice Principal's Office (ID: 6)
        Department vpDept = departmentRepository.findById(6L).orElse(null);
        Role vpRole = roleRepository.findByRoleName("ROLE_VICE_PRINCIPAL").orElseThrow();
        if (vpDept != null && !authorityMappingRepository.findByDepartment_DeptIdAndLevelOrder(6L, 1).isPresent()) {
            AuthorityMapping mapVP = AuthorityMapping.builder()
                    .department(vpDept)
                    .levelOrder(1)
                    .requiredRole(vpRole)
                    .build();
            authorityMappingRepository.save(mapVP);
            System.out.println("Seeded Level 1 mapping for: " + vpDept.getDeptName());
        }

        // Mapping for Principal's Office (ID: 7)
        Department pDept = departmentRepository.findById(7L).orElse(null);
        Role pRole = roleRepository.findByRoleName("ROLE_PRINCIPAL").orElseThrow();
        if (pDept != null && !authorityMappingRepository.findByDepartment_DeptIdAndLevelOrder(7L, 1).isPresent()) {
            AuthorityMapping mapP = AuthorityMapping.builder()
                    .department(pDept)
                    .levelOrder(1)
                    .requiredRole(pRole)
                    .build();
            authorityMappingRepository.save(mapP);
            System.out.println("Seeded Level 1 mapping for: " + pDept.getDeptName());
        }
    }
}
