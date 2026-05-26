package com.institution.approval.service;

import com.institution.approval.document.BlockchainRecord;
import com.institution.approval.repository.mongo.BlockchainRecordRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.util.UUID;

@Service
public class BlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(BlockchainService.class);

    @Value("${web3j.clientAddress}")
    private String clientAddress;

    @Value("${web3j.contractAddress}")
    private String contractAddress;

    @Value("${web3j.privateKey}")
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

            logger.info(
                    "Connected to Ethereum client version: {}",
                    web3j.web3ClientVersion()
                            .send()
                            .getWeb3ClientVersion());

        } catch (Exception e) {

            logger.error("Failed to connect to Ethereum network", e);
        }
    }

    public void storeDocumentHashOnChain(
            String documentId,
            String sha256Hash,
            Long uploadedBy) {

        try {
            logger.info("Storing document hash on chain. Doc ID: {}, Hash: {}, UploadedBy: {}", documentId, sha256Hash, uploadedBy);

            org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                    "storeDocumentHash",
                    java.util.Arrays.asList(
                            new org.web3j.abi.datatypes.Utf8String(documentId),
                            new org.web3j.abi.datatypes.Utf8String(sha256Hash),
                            new org.web3j.abi.datatypes.generated.Uint256(uploadedBy)
                    ),
                    java.util.Collections.emptyList()
            );

            String encodedFunction = org.web3j.abi.FunctionEncoder.encode(function);
            org.web3j.tx.TransactionManager txManager = new org.web3j.tx.RawTransactionManager(web3j, credentials);
            org.web3j.tx.gas.ContractGasProvider gasProvider = new org.web3j.tx.gas.DefaultGasProvider();

            org.web3j.protocol.core.methods.response.EthSendTransaction transactionResponse = txManager.sendTransaction(
                    gasProvider.getGasPrice("storeDocumentHash"),
                    gasProvider.getGasLimit("storeDocumentHash"),
                    contractAddress,
                    encodedFunction,
                    java.math.BigInteger.ZERO
            );

            if (transactionResponse.hasError()) {
                throw new RuntimeException("Web3j transaction failed: " + transactionResponse.getError().getMessage());
            }

            String txHash = transactionResponse.getTransactionHash();

            // Wait for transaction receipt
            org.web3j.tx.response.TransactionReceiptProcessor receiptProcessor = new org.web3j.tx.response.PollingTransactionReceiptProcessor(
                    web3j,
                    1000,
                    10
            );
            org.web3j.protocol.core.methods.response.TransactionReceipt receipt = receiptProcessor.waitForTransactionReceipt(txHash);
            Long blockNumber = receipt.getBlockNumber().longValue();

            logger.info("Document hash successfully stored on chain. Tx: {}, Block: {}", txHash, blockNumber);

            BlockchainRecord record = BlockchainRecord.builder()
                    .documentId(documentId)
                    .transactionHash(txHash)
                    .blockNumber(blockNumber)
                    .actionType("DOCUMENT_CREATED")
                    .build();

            blockchainRecordRepository.save(record);

        } catch (Exception e) {
            logger.error("Error storing hash on chain", e);
            throw new RuntimeException("Blockchain transaction failed", e);
        }
    }

    public void recordApprovalOnChain(
            String documentId,
            Long approverId,
            String action) {

        try {
            logger.info("Recording approval action on chain. Doc ID: {}, Approver: {}, Action: {}", documentId, approverId, action);

            org.web3j.abi.datatypes.Function function = new org.web3j.abi.datatypes.Function(
                    "recordApproval",
                    java.util.Arrays.asList(
                            new org.web3j.abi.datatypes.Utf8String(documentId),
                            new org.web3j.abi.datatypes.Utf8String(action)
                    ),
                    java.util.Collections.emptyList()
            );

            String encodedFunction = org.web3j.abi.FunctionEncoder.encode(function);
            org.web3j.tx.TransactionManager txManager = new org.web3j.tx.RawTransactionManager(web3j, credentials);
            org.web3j.tx.gas.ContractGasProvider gasProvider = new org.web3j.tx.gas.DefaultGasProvider();

            org.web3j.protocol.core.methods.response.EthSendTransaction transactionResponse = txManager.sendTransaction(
                    gasProvider.getGasPrice("recordApproval"),
                    gasProvider.getGasLimit("recordApproval"),
                    contractAddress,
                    encodedFunction,
                    java.math.BigInteger.ZERO
            );

            if (transactionResponse.hasError()) {
                throw new RuntimeException("Web3j transaction failed: " + transactionResponse.getError().getMessage());
            }

            String txHash = transactionResponse.getTransactionHash();

            // Wait for transaction receipt
            org.web3j.tx.response.TransactionReceiptProcessor receiptProcessor = new org.web3j.tx.response.PollingTransactionReceiptProcessor(
                    web3j,
                    1000,
                    10
            );
            org.web3j.protocol.core.methods.response.TransactionReceipt receipt = receiptProcessor.waitForTransactionReceipt(txHash);
            Long blockNumber = receipt.getBlockNumber().longValue();

            logger.info("Approval action successfully recorded on chain. Tx: {}, Block: {}", txHash, blockNumber);

            BlockchainRecord record = BlockchainRecord.builder()
                    .documentId(documentId)
                    .transactionHash(txHash)
                    .blockNumber(blockNumber)
                    .actionType("APPROVAL_RECORDED_" + action)
                    .build();

            blockchainRecordRepository.save(record);

        } catch (Exception e) {
            logger.error("Error recording approval on chain", e);
            throw new RuntimeException("Blockchain transaction failed", e);
        }
    }
}