package com.marmik.apprit.approval.client;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * HTTP client for Pinata IPFS pinning API.
 * Uploads files and returns their IPFS CID.
 * Docs: https://docs.pinata.cloud/reference/post_pinning-pinfiletoipfs
 */
@Component
@Slf4j
public class PinataClient {

    @Value("${pinata.jwt}")
    private String pinataJwt;

    @Value("${pinata.gateway}")
    private String pinataGateway;

    private static final String PINATA_PIN_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Pins the uploaded file to Pinata IPFS.
     *
     * @param file     the multipart file from the HTTP request
     * @param fileName the name to use when pinning on IPFS
     * @return PinResult containing IpfsHash (CID) and the full gateway URL
     */
    @SuppressWarnings("unchecked")
    public PinResult pinFile(MultipartFile file, String fileName) throws IOException {
        log.info("Uploading '{}' ({} bytes) to Pinata IPFS", fileName, file.getSize());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setBearerAuth(pinataJwt);

        // Build multipart body
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return fileName;
            }
        };
        body.add("file", resource);

        // Optional metadata for easy identification in Pinata dashboard
        body.add("pinataMetadata", "{\"name\":\"" + fileName + "\"}");
        body.add("pinataOptions",  "{\"cidVersion\":1}");

        HttpEntity<MultiValueMap<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                PINATA_PIN_URL, HttpMethod.POST, request, Map.class);

        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            String cid = (String) response.getBody().get("IpfsHash");
            String gatewayUrl = pinataGateway + cid;
            log.info("File pinned to IPFS. CID: {}", cid);
            return new PinResult(cid, gatewayUrl);
        }

        throw new RuntimeException("Pinata upload failed with status: " + response.getStatusCode());
    }

    public record PinResult(String ipfsCid, String ipfsUrl) {}
}
