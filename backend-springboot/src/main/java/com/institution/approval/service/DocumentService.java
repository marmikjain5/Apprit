package com.institution.approval.service;

import com.institution.approval.document.ApprovalDocument;
import com.institution.approval.repository.ApprovalDocumentRepository;
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

@Service
public class DocumentService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Autowired
    private ApprovalDocumentRepository documentRepository;

    @Autowired
    private BlockchainService blockchainService;

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
