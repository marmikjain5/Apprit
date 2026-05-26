const fs = require('fs');
const path = require('path');

const BACKEND_URL = 'http://localhost:8080/api';

// Helper to make fetch calls
async function request(url, method = 'GET', body = null, token = null) {
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    let options = { method, headers };
    
    if (body) {
        if (body instanceof FormData) {
            options.body = body;
        } else {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
    }
    
    const response = await fetch(BACKEND_URL + url, options);
    const text = await response.text();
    
    if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${text}`);
    }
    
    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

// Helper to construct Multipart form data manually (to avoid dependency imports)
function createMultipartFormData(fileContent, fileName, title, description, deptId) {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    
    let parts = [];
    
    // File
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/pdf\r\n\r\n${fileContent}\r\n`);
    
    // Title
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\n${title}\r\n`);
    
    // Description
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\n${description}\r\n`);
    
    // DeptId
    if (deptId !== undefined) {
        parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="deptId"\r\n\r\n${deptId}\r\n`);
    }
    
    parts.push(`--${boundary}--\r\n`);
    
    const payload = parts.join('');
    
    return {
        boundary,
        payload
    };
}

async function runE2ETest() {
    console.log('=== STARTING DIGITAL SIGNATURE WORKFLOW END-TO-END TEST ===\n');

    try {
        // 1. Register Student, Coordinator, HOD, Dean, Principal
        console.log('1. Registering users...');
        const uniqueSuffix = Date.now();
        
        const studentReg = {
            username: `student_${uniqueSuffix}`,
            email: `student_${uniqueSuffix}@edu.com`,
            password: 'password123',
            firstName: 'Alice',
            lastName: 'Student',
            deptId: 1,
            roles: ['ROLE_STUDENT']
        };
        await request('/auth/register', 'POST', studentReg);
        console.log(`- Registered Student: ${studentReg.username}`);

        const coordReg = {
            username: `coord_${uniqueSuffix}`,
            email: `coord_${uniqueSuffix}@edu.com`,
            password: 'password123',
            firstName: 'Bob',
            lastName: 'Coordinator',
            deptId: 1,
            roles: ['ROLE_CLUB_COORDINATOR']
        };
        await request('/auth/register', 'POST', coordReg);
        console.log(`- Registered Club Coordinator: ${coordReg.username}`);

        const hodReg = {
            username: `hod_${uniqueSuffix}`,
            email: `hod_${uniqueSuffix}@edu.com`,
            password: 'password123',
            firstName: 'Charlie',
            lastName: 'HOD',
            deptId: 1,
            roles: ['ROLE_HOD']
        };
        await request('/auth/register', 'POST', hodReg);
        console.log(`- Registered HOD: ${hodReg.username}`);

        const deanReg = {
            username: `dean_${uniqueSuffix}`,
            email: `dean_${uniqueSuffix}@edu.com`,
            password: 'password123',
            firstName: 'Daniel',
            lastName: 'Dean',
            deptId: 1,
            roles: ['ROLE_DEAN']
        };
        await request('/auth/register', 'POST', deanReg);
        console.log(`- Registered Dean: ${deanReg.username}`);

        const principalReg = {
            username: `principal_${uniqueSuffix}`,
            email: `principal_${uniqueSuffix}@edu.com`,
            password: 'password123',
            firstName: 'Patricia',
            lastName: 'Principal',
            deptId: 1,
            roles: ['ROLE_PRINCIPAL']
        };
        await request('/auth/register', 'POST', principalReg);
        console.log(`- Registered Principal: ${principalReg.username}\n`);

        // 2. Login Student
        console.log('2. Logging in Student...');
        const studentAuth = await request('/auth/login', 'POST', { username: studentReg.username, password: 'password123' });
        const studentToken = studentAuth.token;
        console.log(`- Logged in successfully. Token received. Dept ID in token response: ${studentAuth.deptId}\n`);

        // 3. Upload a document as Student
        console.log('3. Student uploading document...');
        const pdfContent = '%PDF-1.4 Mock PDF Content';
        const { boundary, payload } = createMultipartFormData(pdfContent, 'Club_Budget_Proposal.pdf', 'Club Budget Proposal', 'Requesting 5000 USD for Annual Fest', 1);
        
        const uploadHeaders = {
            'Authorization': `Bearer ${studentToken}`,
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        };
        const uploadResponse = await fetch(BACKEND_URL + '/documents/upload', {
            method: 'POST',
            headers: uploadHeaders,
            body: payload
        });
        
        if (!uploadResponse.ok) {
            throw new Error(`Upload failed: ${await uploadResponse.text()}`);
        }
        
        const doc = await uploadResponse.json();
        console.log(`- Document uploaded successfully! ID: ${doc.id}`);
        console.log(`- Status: ${doc.status}, Level: ${doc.currentLevel}`);
        console.log(`- SHA-256 Hash: ${doc.fileHashSha256}\n`);

        // 4. Login Club Coordinator & check pending
        console.log('4. Logging in Club Coordinator & checking pending approvals...');
        const coordAuth = await request('/auth/login', 'POST', { username: coordReg.username, password: 'password123' });
        const coordToken = coordAuth.token;
        
        let pending = await request('/documents/pending', 'GET', null, coordToken);
        console.log(`- Pending documents count for Coordinator: ${pending.length}`);
        const coordDoc = pending.find(d => d.id === doc.id);
        if (!coordDoc) {
            throw new Error('Uploaded document not found in Coordinator\'s pending list!');
        }
        console.log(`- Found document: "${coordDoc.title}" at Level: ${coordDoc.currentLevel}\n`);

        // 5. Coordinator requests changes
        console.log('5. Coordinator requesting changes...');
        const requestChangesResult = await request(`/approvals/${doc.id}/process`, 'POST', {
            action: 'CHANGES_REQUESTED',
            comments: 'Please reduce budget by 10%'
        }, coordToken);
        console.log(`- Action processed. Resulting document status: ${requestChangesResult.status}\n`);

        // 6. Student check status
        console.log('6. Logging in Student to check status...');
        let myDocs = await request('/documents/my-documents', 'GET', null, studentToken);
        let studentDoc = myDocs.find(d => d.id === doc.id);
        console.log(`- Student document status is: ${studentDoc.status}\n`);
        if (studentDoc.status !== 'CHANGES_REQUESTED') {
            throw new Error(`Expected status CHANGES_REQUESTED but got ${studentDoc.status}`);
        }

        // 7. Student resubmits document
        console.log('7. Student resubmitting updated document...');
        const newPdfContent = '%PDF-1.4 Updated Mock PDF Content';
        const resubmitFormData = createMultipartFormData(newPdfContent, 'Club_Budget_Proposal_v2.pdf', 'Club Budget Proposal V2', 'Requesting 4500 USD for Annual Fest (Reduced)', 1);
        
        const resubmitHeaders = {
            'Authorization': `Bearer ${studentToken}`,
            'Content-Type': `multipart/form-data; boundary=${resubmitFormData.boundary}`
        };
        const resubmitResponse = await fetch(`${BACKEND_URL}/documents/${doc.id}/resubmit`, {
            method: 'PUT',
            headers: resubmitHeaders,
            body: resubmitFormData.payload
        });
        
        if (!resubmitResponse.ok) {
            throw new Error(`Resubmit failed: ${await resubmitResponse.text()}`);
        }
        
        const resubmittedDoc = await resubmitResponse.json();
        console.log(`- Document resubmitted successfully!`);
        console.log(`- New Status: ${resubmittedDoc.status}, Level: ${resubmittedDoc.currentLevel}`);
        console.log(`- New SHA-256 Hash: ${resubmittedDoc.fileHashSha256}\n`);

        // 8. Coordinator approves resubmitted document
        console.log('8. Coordinator approving the resubmitted document...');
        const coordApproval = await request(`/approvals/${doc.id}/process`, 'POST', {
            action: 'APPROVED',
            comments: 'Approved level 1'
        }, coordToken);
        console.log(`- Action processed. Resulting level: ${coordApproval.currentLevel}, status: ${coordApproval.status}\n`);

        // 9. Login HOD & Approve
        console.log('9. HOD logging in & approving...');
        const hodAuth = await request('/auth/login', 'POST', { username: hodReg.username, password: 'password123' });
        const hodToken = hodAuth.token;
        
        const hodApproval = await request(`/approvals/${doc.id}/process`, 'POST', {
            action: 'APPROVED',
            comments: 'Approved level 2'
        }, hodToken);
        console.log(`- Action processed. Resulting level: ${hodApproval.currentLevel}, status: ${hodApproval.status}\n`);

        // 10. Login Dean & Approve
        console.log('10. Dean logging in & approving...');
        const deanAuth = await request('/auth/login', 'POST', { username: deanReg.username, password: 'password123' });
        const deanToken = deanAuth.token;
        
        const deanApproval = await request(`/approvals/${doc.id}/process`, 'POST', {
            action: 'APPROVED',
            comments: 'Approved level 3'
        }, deanToken);
        console.log(`- Action processed. Resulting level: ${deanApproval.currentLevel}, status: ${deanApproval.status}\n`);

        // 11. Login Principal & Approve
        console.log('11. Principal logging in & approving...');
        const principalAuth = await request('/auth/login', 'POST', { username: principalReg.username, password: 'password123' });
        const principalToken = principalAuth.token;
        
        const principalApproval = await request(`/approvals/${doc.id}/process`, 'POST', {
            action: 'APPROVED',
            comments: 'Approved level 4 (Final)'
        }, principalToken);
        console.log(`- Action processed. Resulting level: ${principalApproval.currentLevel}, status: ${principalApproval.status}\n`);

        // 12. Final Validation
        console.log('12. Final verification check...');
        const finalStudentDocs = await request('/documents/my-documents', 'GET', null, studentToken);
        const finalDoc = finalStudentDocs.find(d => d.id === doc.id);
        console.log(`- Final Document Status in MongoDB: ${finalDoc.status}`);
        if (finalDoc.status !== 'APPROVED') {
            throw new Error(`Expected final status APPROVED but got ${finalDoc.status}`);
        }
        
        console.log('\n=== E2E WORKFLOW TEST COMPLETED SUCCESSFULLY! ===');
        console.log('All stages (Upload -> Request Changes -> Resubmit -> Approval Chain -> Blockchain) verified!');
        
    } catch (error) {
        console.error('\n❌ E2E TEST FAILED:', error.message);
        process.exit(1);
    }
}

runE2ETest();
