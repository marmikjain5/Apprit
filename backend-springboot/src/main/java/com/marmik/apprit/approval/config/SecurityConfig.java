package com.marmik.apprit.approval.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/actuator/health").permitAll()
                // Document upload/reupload — students and clubs
                .requestMatchers("/api/documents/upload").hasAnyAuthority("ROLE_STUDENT", "ROLE_CLUB")
                .requestMatchers("/api/documents/*/reupload").hasAnyAuthority("ROLE_STUDENT", "ROLE_CLUB")
                // My documents — students and clubs
                .requestMatchers("/api/documents/my").hasAnyAuthority("ROLE_STUDENT", "ROLE_CLUB")
                // Pending/reviewed/approve/reject/request-changes — authority roles
                .requestMatchers("/api/documents/pending").hasAnyAuthority(
                        "ROLE_HOD", "ROLE_DEAN", "ROLE_PRINCIPAL", "ROLE_VICE_PRINCIPAL", "ROLE_FACULTY")
                .requestMatchers("/api/documents/reviewed").hasAnyAuthority(
                        "ROLE_HOD", "ROLE_DEAN", "ROLE_PRINCIPAL", "ROLE_VICE_PRINCIPAL", "ROLE_FACULTY")
                .requestMatchers("/api/documents/*/approve").hasAnyAuthority(
                        "ROLE_HOD", "ROLE_DEAN", "ROLE_PRINCIPAL", "ROLE_VICE_PRINCIPAL", "ROLE_FACULTY")
                .requestMatchers("/api/documents/*/reject").hasAnyAuthority(
                        "ROLE_HOD", "ROLE_DEAN", "ROLE_PRINCIPAL", "ROLE_VICE_PRINCIPAL", "ROLE_FACULTY")
                .requestMatchers("/api/documents/*/request-changes").hasAnyAuthority(
                        "ROLE_HOD", "ROLE_DEAN", "ROLE_PRINCIPAL", "ROLE_VICE_PRINCIPAL", "ROLE_FACULTY")
                // All other requests need auth
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:4200",
                "http://localhost:4201",
                "http://localhost:4202",
                "http://127.0.0.1:4200",
                "http://127.0.0.1:4201",
                "http://127.0.0.1:4202"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
