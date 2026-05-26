package com.marmik.apprit.approval;

import com.institution.approval.entity.User;
import com.institution.approval.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.stream.Collectors;

@SpringBootTest
class ApprovalApplicationTests {

    @Autowired
    private UserRepository userRepository;

    @Test
    void contextLoads() {
        List<User> users = userRepository.findAll();
        System.out.println("=== PRINTING USERS AND ROLES ===");
        for (User u : users) {
            String roles = u.getRoles().stream()
                    .map(r -> r.getRoleName())
                    .collect(Collectors.joining(", "));
            System.out.println("Username: " + u.getUsername() + " | Roles: " + roles);
        }
        System.out.println("================================");
    }
}

