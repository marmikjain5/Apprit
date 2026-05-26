package com.institution.approval.service;

import com.institution.approval.document.ApprovalDocument;
import com.institution.approval.entity.User;
import com.institution.approval.entity.AuthorityMapping;
import com.institution.approval.repository.mongo.ApprovalDocumentRepository;
import com.institution.approval.repository.UserRepository;
import com.institution.approval.repository.AuthorityMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Autowired
    private ApprovalDocumentRepository documentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityMappingRepository authorityMappingRepository;

    @Autowired
    private BlockchainService blockchainService;

    @Autowired
    private NotificationService notificationService;

    public ApprovalDocument uploadDocument(MultipartFile file, String title, String description, Long uploadedBy, Long deptId) throws IOException, NoSuchAlgorithmException {
        // Create dir if not exists
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        // Generate unique filename
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        
        // Save file
        Files.write(filePath, file.getBytes());

        // Generate SHA-256 Hash
        String fileHash = calculateSHA256(file.getBytes());

        ApprovalDocument document = ApprovalDocument.builder()
                .title(title)
                .description(description)
                .fileName(fileName)
                .fileUrl("/" + uploadDir + "/" + fileName)
                .fileHashSha256(fileHash)
                .uploadedBy(uploadedBy)
                .deptId(deptId)
                .status("PENDING")
                .currentLevel(1)
                .build();

        ApprovalDocument savedDoc = documentRepository.save(document);

        // Record hash on blockchain
        blockchainService.storeDocumentHashOnChain(savedDoc.getId(), fileHash, uploadedBy);

        return savedDoc;
    }

    public List<ApprovalDocument> getDocumentsByUser(Long userId) {
        return documentRepository.findByUploadedBy(userId);
    }

    public List<ApprovalDocument> getPendingDocumentsForDept(Long deptId, Integer level) {
        return documentRepository.findByDeptIdAndCurrentLevelAndStatus(deptId, level, "PENDING");
    }

    public ApprovalDocument getDocumentById(String documentId) {
        return documentRepository.findById(documentId)
                .orElseThrow(() -> new RuntimeException("Document not found"));
    }

    public ApprovalDocument resubmitDocument(String documentId, MultipartFile file, String title, String description, Long userId) throws IOException, NoSuchAlgorithmException {
        ApprovalDocument document = getDocumentById(documentId);
        
        if (!document.getUploadedBy().equals(userId)) {
            throw new RuntimeException("You are not authorized to resubmit this document.");
        }
        
        if (!document.getStatus().equals("CHANGES_REQUESTED") && !document.getStatus().equals("REJECTED")) {
            throw new RuntimeException("Only documents with status CHANGES_REQUESTED or REJECTED can be resubmitted.");
        }

        // Generate unique filename
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        
        // Save file
        Files.write(filePath, file.getBytes());

        // Generate SHA-256 Hash
        String fileHash = calculateSHA256(file.getBytes());

        // Update document fields
        document.setTitle(title);
        document.setDescription(description);
        document.setFileName(fileName);
        document.setFileUrl("/" + uploadDir + "/" + fileName);
        document.setFileHashSha256(fileHash);
        document.setStatus("PENDING");
        document.setCurrentLevel(1); // Reset to level 1
        document.setUpdatedAt(LocalDateTime.now());

        ApprovalDocument savedDoc = documentRepository.save(document);

        // Record new hash on blockchain
        blockchainService.storeDocumentHashOnChain(savedDoc.getId(), fileHash, userId);

        // Create notification
        notificationService.sendNotification(userId, documentId, "Your document has been resubmitted successfully.");

        return savedDoc;
    }

    public List<ApprovalDocument> getPendingDocumentsForUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isStudent = user.getRoles().stream()
                .anyMatch(r -> r.getRoleName().equals("ROLE_STUDENT"));
        if (isStudent) {
            return java.util.Collections.emptyList();
        }

        boolean isPrincipal = user.getRoles().stream()
                .anyMatch(r -> r.getRoleName().equals("ROLE_PRINCIPAL"));

        if (isPrincipal) {
            return documentRepository.findAll().stream()
                    .filter(doc -> doc.getCurrentLevel() == 4 && 
                                  (doc.getStatus().equals("PENDING") || doc.getStatus().equals("PARTIALLY_APPROVED")))
                    .collect(Collectors.toList());
        }

        if (user.getDepartment() == null) {
            return java.util.Collections.emptyList();
        }

        Long deptId = user.getDepartment().getDeptId();
        List<AuthorityMapping> userMappings = authorityMappingRepository.findByDepartment_DeptIdOrderByLevelOrderAsc(deptId);

        List<Integer> levels = userMappings.stream()
                .filter(m -> user.getRoles().stream()
                        .anyMatch(r -> r.getRoleName().equals(m.getRequiredRole().getRoleName())))
                .map(AuthorityMapping::getLevelOrder)
                .collect(Collectors.toList());

        if (levels.isEmpty()) {
            return java.util.Collections.emptyList();
        }

        return documentRepository.findAll().stream()
                .filter(doc -> doc.getDeptId().equals(deptId) &&
                              levels.contains(doc.getCurrentLevel()) &&
                              (doc.getStatus().equals("PENDING") || doc.getStatus().equals("PARTIALLY_APPROVED")))
                .collect(Collectors.toList());
    }

    private String calculateSHA256(byte[] data) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(data);
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }
}
