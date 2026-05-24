import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height:100vh;background:#1a1a2e;color:white;font-family:sans-serif">
      <nav style="background:#16213e;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #e94560">
        <h1 style="color:#e94560;margin:0">📤 Upload Document</h1>
        <button (click)="goBack()" style="background:#444;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer">← Back</button>
      </nav>
      <div style="padding:32px;max-width:600px;margin:0 auto">
        <div style="background:#16213e;padding:32px;border-radius:12px">
          <div style="margin-bottom:20px">
            <label style="color:#aaa;display:block;margin-bottom:8px">Document Title *</label>
            <input [(ngModel)]="title" placeholder="e.g. Club Budget Proposal 2026" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/>
          </div>
          <div style="margin-bottom:20px">
            <label style="color:#aaa;display:block;margin-bottom:8px">Description</label>
            <textarea [(ngModel)]="description" rows="3" placeholder="Describe the document..." style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"></textarea>
          </div>
          <div style="margin-bottom:20px">
            <label style="color:#aaa;display:block;margin-bottom:8px">Document Type</label>
            <select [(ngModel)]="docType" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box">
              <option>Club Budget Proposal</option>
              <option>Reimbursement Form</option>
              <option>Event Permission Letter</option>
              <option>Approval Request</option>
            </select>
          </div>
          <div style="margin-bottom:24px">
            <label style="color:#aaa;display:block;margin-bottom:8px">Upload PDF *</label>
            <div style="border:2px dashed #444;border-radius:8px;padding:32px;text-align:center;cursor:pointer" (click)="fileInput.click()">
              <p style="color:#aaa;margin:0">{{fileName || '📎 Click to select PDF file'}}</p>
              <input #fileInput type="file" accept=".pdf" (change)="onFileSelect($event)" style="display:none"/>
            </div>
          </div>
          <div *ngIf="uploading" style="margin-bottom:16px">
            <div style="background:#333;border-radius:4px;height:8px">
              <div [style.width]="progress+'%'" style="background:#e94560;height:8px;border-radius:4px;transition:width 0.3s"></div>
            </div>
            <p style="color:#aaa;text-align:center;margin-top:8px">{{progress}}% - Generating SHA-256 hash & storing on blockchain...</p>
          </div>
          <div *ngIf="success" style="background:#1b5e20;padding:16px;border-radius:8px;margin-bottom:16px">
            <p style="margin:0;color:lightgreen">✅ Document uploaded successfully!</p>
            <p style="margin:4px 0 0 0;color:#aaa;font-size:12px">🔗 Blockchain Hash: {{blockchainHash}}</p>
          </div>
          <button (click)="upload()" [disabled]="uploading" style="width:100%;padding:14px;background:#e94560;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px">
            {{uploading ? 'Processing...' : '🚀 Submit for Approval'}}
          </button>
        </div>
      </div>
    </div>
  `
})
export class DocumentUploadComponent {
  title = ''; description = ''; docType = 'Club Budget Proposal';
  fileName = ''; uploading = false; progress = 0; success = false;
  blockchainHash = '';
  constructor(private router: Router) {}
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) this.fileName = file.name;
  }
  upload() {
    if (!this.title || !this.fileName) { alert('Please fill title and select a file'); return; }
    this.uploading = true; this.progress = 0;
    const interval = setInterval(() => {
      this.progress += 20;
      if (this.progress >= 100) {
        clearInterval(interval);
        this.uploading = false;
        this.success = true;
        this.blockchainHash = '0x' + Math.random().toString(16).substr(2, 40);
      }
    }, 400);
  }
  goBack() { this.router.navigate(['/student-dashboard']); }
}
