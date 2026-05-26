package com.marmik.apprit.approval.service;

import com.marmik.apprit.approval.config.JwtUtils;
import com.marmik.apprit.approval.model.User;
import com.marmik.apprit.approval.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public Map<String, Object> register(Map<String, Object> payload) {
        String username  = (String) payload.get("username");
        String email     = (String) payload.get("email");
        String password  = (String) payload.get("password");
        String firstName = (String) payload.getOrDefault("firstName", username);
        String lastName  = (String) payload.getOrDefault("lastName", "");

        @SuppressWarnings("unchecked")
        List<String> roles = (List<String>) payload.getOrDefault("roles", List.of("ROLE_STUDENT"));

        // Validations
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username '" + username + "' is already taken.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email '" + email + "' is already registered.");
        }
        if (!email.toLowerCase().endsWith("@bmsit.in")) {
            throw new IllegalArgumentException("Only @bmsit.in email addresses are permitted.");
        }

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
                .firstName(firstName)
                .lastName(lastName)
                .roles(Set.copyOf(roles))
                .build();

        userRepository.save(user);
        log.info("New user registered: {} with roles {}", username, roles);

        return Map.of("message", "Registration successful. You can now log in.");
    }

    public Map<String, Object> login(String username, String password) {
        long start = System.currentTimeMillis();
        log.info("Attempting login for username: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    log.warn("Login failed: User '{}' not found. Time taken: {}ms", username, (System.currentTimeMillis() - start));
                    return new IllegalArgumentException("Invalid username or password.");
                });

        long afterDb = System.currentTimeMillis();
        log.info("User found in database. Query time: {}ms", (afterDb - start));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            log.warn("Login failed: Password mismatch for user '{}'. Time taken: {}ms", username, (System.currentTimeMillis() - afterDb));
            throw new IllegalArgumentException("Invalid username or password.");
        }

        long afterPassword = System.currentTimeMillis();
        log.info("Password verification successful. Match time: {}ms", (afterPassword - afterDb));

        if (!user.isActive()) {
            throw new IllegalArgumentException("Account is disabled. Please contact administration.");
        }

        List<String> roles = new ArrayList<>(user.getRoles());
        String token = jwtUtils.generateToken(username, roles);

        long afterToken = System.currentTimeMillis();
        log.info("JWT generated successfully. Token time: {}ms. Total login time: {}ms", (afterToken - afterPassword), (afterToken - start));

        return Map.of(
                "token",     token,
                "username",  user.getUsername(),
                "email",     user.getEmail(),
                "firstName", user.getFirstName() != null ? user.getFirstName() : "",
                "roles",     roles
        );
    }
}
