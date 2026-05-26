package com.marmik.apprit.approval;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication(scanBasePackages = {"com.institution.approval"})
@EntityScan(basePackages = "com.institution.approval.entity")
@EnableJpaRepositories(basePackages = "com.institution.approval.repository")
@EnableMongoRepositories(basePackages = "com.institution.approval.repository.mongo")
public class ApprovalApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApprovalApplication.class, args);
    }
}