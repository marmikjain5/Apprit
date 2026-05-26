package com.marmik.apprit.approval;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marmik.apprit.approval.model.ApprovalDocument;
import com.marmik.apprit.approval.repository.DocumentRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class ApprovalApplicationTests {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSerializeMjDocuments() {
        System.out.println("=== DIAGNOSTIC JSON SERIALIZATION REPORT ===");
        try {
            List<ApprovalDocument> docs = documentRepository.findByUploaderUsernameOrderByUploadedAtDesc("mj");
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(docs);
            System.out.println("RAW JSON PAYLOAD FROM BACKEND:");
            System.out.println(json);
        } catch (Exception e) {
            System.err.println("Serialization failed!");
            e.printStackTrace();
        }
        System.out.println("=== END OF DIAGNOSTIC JSON REPORT ===");
    }
}
