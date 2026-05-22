package com.marmik.apprit.approval.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/documents")
@CrossOrigin(origins = "*") // Configure for production later
public class DocumentController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "College File Approval System Core Backend");
        response.put("database_connection", "Not Configured");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitDocument(
            @RequestParam("fileName") String fileName,
            @RequestParam("studentId") String studentId) {
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Document submitted successfully to core workflow queue");
        response.put("fileName", fileName);
        response.put("studentId", studentId);
        response.put("status", "PENDING_APPROVAL");
        
        return ResponseEntity.ok(response);
    }
}
