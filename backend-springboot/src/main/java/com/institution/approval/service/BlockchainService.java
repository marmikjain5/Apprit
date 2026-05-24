package com.institution.approval.service;

import com.institution.approval.document.BlockchainRecord;
import com.institution.approval.repository.BlockchainRecordRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import jakarta.annotation.PostConstruct;
import java.util.UUID;

@Service
public class BlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(BlockchainService.class);

    @Value("${web3j.client-address}")
    private String clientAddress;

    @Value("${blockchain.contract.address}")
    private String contractAddress;

    @Value("${blockchain.private.key}")
    private String privateKey;

    @Autowired
    private BlockchainRecordRepository blockchainRecordRepository;

    private Web3j web3j;
    private Credentials credentials;

    @PostConstruct
    public void init() {
        try {
            web3j = Web3j.build(new HttpService(clientAddress));
            credentials = Credentials.create(privateKey);
            logger.info("Connected to Ethereum client version: {}", web3j.web3ClientVersion().send().getWeb3ClientVersion());
        } catch (Exception e) {
            logger.error("Failed to connect to Ethereum network", e);
        }
    }

    // Mocking the actual smart contract call since we don't have the generated wrapper yet
    public void storeDocumentHashOnChain(String documentId, String sha256Hash, Long uploadedBy) {
        try {
            // Here you would call: DocumentApproval contract = DocumentApproval.load(...)
            // contract.storeDocumentHash(documentId, sha256Hash, uploadedBy).send();
            
            logger.info("Simulating blockchain transaction for doc hash: {}", sha256Hash);
            String mockTxHash = "0x" + UUID.randomUUID().toString().replace("-", "");
            
            BlockchainRecord record = BlockchainRecord.builder()
                    .documentId(documentId)
                    .transactionHash(mockTxHash)
                    .blockNumber(1L) // Mock block number
                    .actionType("DOCUMENT_CREATED")
                    .build();
            
            blockchainRecordRepository.save(record);
        } catch (Exception e) {
            logger.error("Error storing hash on chain", e);
        }
    }

    public void recordApprovalOnChain(String documentId, Long approverId, String action) {
        try {
            logger.info("Simulating blockchain transaction for approval action: {}", action);
            String mockTxHash = "0x" + UUID.randomUUID().toString().replace("-", "");
            
            BlockchainRecord record = BlockchainRecord.builder()
                    .documentId(documentId)
                    .transactionHash(mockTxHash)
                    .blockNumber(2L) // Mock block number
                    .actionType("APPROVAL_RECORDED_" + action)
                    .build();
            
            blockchainRecordRepository.save(record);
        } catch (Exception e) {
            logger.error("Error recording approval on chain", e);
        }
    }
}
