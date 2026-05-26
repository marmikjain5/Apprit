package com.institution.approval.config;
import com.institution.approval.entity.Department;
import com.institution.approval.entity.Role;
import com.institution.approval.repository.DepartmentRepository;
import com.institution.approval.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.institution.approval.entity.AuthorityMapping;
import com.institution.approval.repository.AuthorityMappingRepository;

@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired private RoleRepository roleRepository;
    @Autowired private DepartmentRepository departmentRepository;
    @Autowired private AuthorityMappingRepository authorityMappingRepository;

    @Override
    public void run(String... args) {
        seedRole("ROLE_STUDENT"); seedRole("ROLE_FACULTY");
        seedRole("ROLE_HOD"); seedRole("ROLE_DEAN"); seedRole("ROLE_PRINCIPAL");
        seedRole("ROLE_CLUB_COORDINATOR");
        
        seedDept("Computer Science"); seedDept("Electronics");
        seedDept("Mechanical"); seedDept("Civil");
        
        seedAuthorityMappings();
        
        System.out.println("DataSeeder: Roles, Departments and Authority Mappings seeded.");
    }

    private void seedRole(String name) {
        if (roleRepository.findByRoleName(name).isEmpty()) {
            Role r = new Role(); r.setRoleName(name); roleRepository.save(r);
        }
    }
    
    private void seedDept(String name) {
        if (!departmentRepository.existsByDeptName(name)) {
            Department d = new Department(); d.setDeptName(name); departmentRepository.save(d);
        }
    }

    private void seedAuthorityMappings() {
        if (authorityMappingRepository.count() == 0) {
            Iterable<Department> depts = departmentRepository.findAll();
            Role coord = roleRepository.findByRoleName("ROLE_CLUB_COORDINATOR").get();
            Role hod = roleRepository.findByRoleName("ROLE_HOD").get();
            Role dean = roleRepository.findByRoleName("ROLE_DEAN").get();
            Role principal = roleRepository.findByRoleName("ROLE_PRINCIPAL").get();

            for (Department d : depts) {
                saveMapping(d, coord, 1);
                saveMapping(d, hod, 2);
                saveMapping(d, dean, 3);
                saveMapping(d, principal, 4);
            }
        }
    }

    private void saveMapping(Department dept, Role role, int level) {
        AuthorityMapping mapping = new AuthorityMapping();
        mapping.setDepartment(dept);
        mapping.setRequiredRole(role);
        mapping.setLevelOrder(level);
        authorityMappingRepository.save(mapping);
    }
}