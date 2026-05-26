import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../../core/services/document.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height:100vh;background:#1a1a2e;color:white;font-family:'Segoe UI',Roboto,sans-serif">
      <nav style="background:#16213e;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #e94560;box-shadow: 0 4px 20px rgba(0,0,0,0.3)">
        <h1 style="color:#e94560;margin:0;font-weight:700;letter-spacing:1px">🎓 Apprit - Student Portal</h1>
        <div>
          <button (click)="goUpload()" style="background:linear-gradient(135deg, #e94560, #ff6b6b);color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;margin-right:12px;font-weight:600;box-shadow:0 4px 10px rgba(233,69,96,0.3);transition:all 0.3s ease">+ Upload Document</button>
          <button (click)="logout()" style="background:#444;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:600">Logout</button>
        </div>
      </nav>

      <div style="padding:32px">
        <!-- Stats Cards -->
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-bottom:32px">
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #e94560;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
            <h3 style="margin:0;color:#aaa;font-size:14px;text-transform:uppercase;letter-spacing:0.5px">Total Documents</h3>
            <p style="font-size:36px;margin:8px 0;font-weight:700;color:white">{{documents.length}}</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #f5a623;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
            <h3 style="margin:0;color:#aaa;font-size:14px;text-transform:uppercase;letter-spacing:0.5px">Pending Review</h3>
            <p style="font-size:36px;margin:8px 0;font-weight:700;color:white">{{getPendingCount()}}</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #4caf50;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
            <h3 style="margin:0;color:#aaa;font-size:14px;text-transform:uppercase;letter-spacing:0.5px">Approved</h3>
            <p style="font-size:36px;margin:8px 0;font-weight:700;color:white">{{getApprovedCount()}}</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #ff4a4a;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
            <h3 style="margin:0;color:#aaa;font-size:14px;text-transform:uppercase;letter-spacing:0.5px">Action Required</h3>
            <p style="font-size:36px;margin:8px 0;font-weight:700;color:white">{{getActionRequiredCount()}}</p>
          </div>
        </div>

        <!-- Document List -->
        <div style="background:#16213e;border-radius:12px;padding:24px;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
          <h2 style="color:#e94560;margin-top:0;font-weight:600">My Documents</h2>
          
          <div style="overflow-x:auto">
            <table style="width:100%;border-collapse:collapse">
              <thead>
                <tr style="border-bottom:2px solid #333">
                  <th style="padding:16px 12px;text-align:left;color:#aaa;font-weight:600">Title</th>
                  <th style="padding:16px 12px;text-align:left;color:#aaa;font-weight:600">Description</th>
                  <th style="padding:16px 12px;text-align:left;color:#aaa;font-weight:600">Uploaded</th>
                  <th style="padding:16px 12px;text-align:left;color:#aaa;font-weight:600">Status</th>
                  <th style="padding:16px 12px;text-align:left;color:#aaa;font-weight:600">Blockchain Hash (SHA-256)</th>
                  <th style="padding:16px 12px;text-align:center;color:#aaa;font-weight:600">Actions</th>
                </tr>
              </thead>
              <tbody>
                <ng-container *ngFor="let doc of documents">
                  <tr style="border-bottom:1px solid #222;vertical-align:middle">
                    <td style="padding:16px 12px;font-weight:500">{{doc.title}}</td>
                    <td style="padding:16px 12px;color:#ccc;font-size:14px">
                      <div>{{doc.description}}</div>
                      <div style="display:flex;gap:6px;margin-top:8px;font-size:10px;align-items:center;flex-wrap:wrap">
                        <span [style.background]="getLevelStatusColor(doc, 1)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">Coordinator</span>
                        <span style="color:#666">➔</span>
                        <span [style.background]="getLevelStatusColor(doc, 2)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">HOD</span>
                        <span style="color:#666">➔</span>
                        <span [style.background]="getLevelStatusColor(doc, 3)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">Dean</span>
                        <span style="color:#666">➔</span>
                        <span [style.background]="getLevelStatusColor(doc, 4)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">Principal</span>
                      </div>
                    </td>
                    <td style="padding:16px 12px;color:#aaa;font-size:14px">{{doc.createdAt | date:'short'}}</td>
                    <td style="padding:16px 12px">
                      <span [style.background]="getStatusColor(doc.status)"
                            style="padding:6px 14px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">{{doc.status}}</span>
                    </td>
                    <td style="padding:16px 12px;color:#4caf50;font-size:12px;font-family:monospace;word-break:break-all">
                      {{doc.fileHashSha256}}
                    </td>
                    <td style="padding:16px 12px;text-align:center;white-space:nowrap">
                      <button (click)="viewPdf(doc)"
                              style="background:#1a5f7a;color:white;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;margin-right:6px">
                        👁️ View PDF
                      </button>
                      <button (click)="toggleHistory(doc)"
                              style="background:#0f3460;color:#ccc;border:1px solid #444;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px;margin-right:6px">
                        📜 {{expandedHistoryId === doc.id ? 'Hide Logs' : 'History'}}
                      </button>
                      <button *ngIf="doc.status === 'CHANGES_REQUESTED' || doc.status === 'REJECTED'"
                              (click)="toggleResubmit(doc)"
                              style="background:#f5a623;color:black;border:none;padding:6px 12px;border-radius:4px;cursor:pointer;font-weight:600;font-size:12px">
                        ✏️ {{resubmitDocId === doc.id ? 'Cancel' : 'Resubmit'}}
                      </button>
                    </td>
                  </tr>

                  <!-- History log row -->
                  <tr *ngIf="expandedHistoryId === doc.id" style="background:#0f3460">
                    <td colspan="6" style="padding:20px">
                      <div style="max-width:800px;margin:0 auto">
                        <h4 style="color:#e94560;margin-top:0">📋 Approval History Log</h4>
                        
                        <div *ngIf="loadingHistory" style="color:#aaa">Loading history...</div>
                        
                        <div *ngIf="!loadingHistory && docHistory.length === 0" style="color:#aaa">
                          No approval logs recorded yet. (Pending initial level review).
                        </div>
                        
                        <div *ngIf="!loadingHistory && docHistory.length > 0" style="display:flex;flex-direction:column;gap:12px">
                          <div *ngFor="let log of docHistory" 
                               style="background:#16213e;padding:12px 16px;border-radius:6px;border-left:4px solid"
                               [style.border-left-color]="getStatusColor(log.action)">
                            <div style="display:flex;justify-content:space-between;margin-bottom:6px">
                              <span style="font-weight:600;color:lightgreen">
                                {{log.approverName}} ({{getRoleDisplay(log.approverRole)}} - ID: {{log.approverId}})
                              </span>
                              <span style="font-size:12px;color:#aaa">
                                {{log.timestamp | date:'medium'}}
                              </span>
                            </div>
                            <div style="margin-bottom:4px">
                              Action: 
                              <span [style.color]="getStatusColor(log.action)" style="font-weight:600;text-transform:uppercase">
                                {{log.action}}
                              </span>
                            </div>
                            <div *ngIf="log.comments" style="color:#ccc;font-style:italic;font-size:13px">
                              "{{log.comments}}"
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>

                  <!-- Resubmission Form row -->
                  <tr *ngIf="resubmitDocId === doc.id" style="background:#0f3460">
                    <td colspan="6" style="padding:20px">
                      <div style="max-width:600px;margin:0 auto">
                        <h4 style="color:#f5a623;margin-top:0">Resubmit updated document for "{{doc.title}}"</h4>
                        
                        <div style="margin-bottom:12px">
                          <label style="display:block;margin-bottom:4px;font-size:12px;color:#ccc">Updated Title</label>
                          <input type="text" [(ngModel)]="resubmitTitle" style="width:100%;padding:8px;border-radius:4px;border:1px solid #444;background:#1a1a2e;color:white" placeholder="Updated title"/>
                        </div>

                        <div style="margin-bottom:12px">
                          <label style="display:block;margin-bottom:4px;font-size:12px;color:#ccc">Updated Description</label>
                          <textarea [(ngModel)]="resubmitDescription" style="width:100%;padding:8px;border-radius:4px;border:1px solid #444;background:#1a1a2e;color:white" placeholder="Updated description" rows="2"></textarea>
                        </div>

                        <div style="margin-bottom:16px">
                          <label style="display:block;margin-bottom:4px;font-size:12px;color:#ccc">New PDF File</label>
                          <input type="file" (change)="onFileSelected($event)" accept="application/pdf" style="color:white;font-size:14px"/>
                        </div>

                        <button (click)="submitResubmission()" 
                                [disabled]="!selectedFile"
                                style="background:#4caf50;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;font-weight:600;font-size:13px">
                          Upload & Resubmit
                        </button>
                      </div>
                    </td>
                  </tr>
                </ng-container>
                <tr *ngIf="documents.length === 0">
                  <td colspan="6" style="padding:32px;text-align:center;color:#aaa">No documents found. Click "+ Upload Document" to submit a new proposal.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  documents: any[] = [];
  
  resubmitDocId: string | null = null;
  resubmitTitle = '';
  resubmitDescription = '';
  selectedFile: File | null = null;

  expandedHistoryId: string | null = null;
  docHistory: any[] = [];
  loadingHistory = false;

  constructor(private router: Router, private documentService: DocumentService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService.getMyDocuments().subscribe({
      next: (data) => {
        this.documents = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching documents', err);
      }
    });
  }

  getPendingCount() {
    return this.documents.filter(d => d.status === 'PENDING' || d.status === 'PARTIALLY_APPROVED').length;
  }

  getApprovedCount() {
    return this.documents.filter(d => d.status === 'APPROVED').length;
  }

  getActionRequiredCount() {
    return this.documents.filter(d => d.status === 'CHANGES_REQUESTED' || d.status === 'REJECTED').length;
  }

  getStatusColor(status: string) {
    switch (status) {
      case 'APPROVED': return '#1b5e20';
      case 'REJECTED': return '#b71c1c';
      case 'CHANGES_REQUESTED': return '#ff8f00';
      case 'PARTIALLY_APPROVED': return '#006064';
      default: return '#e65100';
    }
  }

  getLevelStatusColor(doc: any, level: number): string {
    if (doc.status === 'APPROVED') {
      return '#1b5e20';
    }
    if (doc.status === 'REJECTED') {
      if (doc.currentLevel === level) return '#b71c1c';
      if (doc.currentLevel > level) return '#1b5e20';
      return '#444444';
    }
    if (doc.status === 'CHANGES_REQUESTED') {
      if (doc.currentLevel === level) return '#ff8f00';
      if (doc.currentLevel > level) return '#1b5e20';
      return '#444444';
    }
    if (doc.currentLevel === level) {
      return '#0288d1';
    }
    if (doc.currentLevel > level) {
      return '#1b5e20';
    }
    return '#444444';
  }

  toggleResubmit(doc: any) {
    if (this.resubmitDocId === doc.id) {
      this.resubmitDocId = null;
      this.selectedFile = null;
    } else {
      this.resubmitDocId = doc.id;
      this.resubmitTitle = doc.title;
      this.resubmitDescription = doc.description;
      this.selectedFile = null;
    }
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  submitResubmission() {
    if (!this.resubmitDocId || !this.selectedFile) return;

    this.documentService.resubmitDocument(
      this.resubmitDocId,
      this.selectedFile,
      this.resubmitTitle,
      this.resubmitDescription
    ).subscribe({
      next: (res) => {
        alert('Document resubmitted successfully! The approval chain has been reset.');
        this.resubmitDocId = null;
        this.selectedFile = null;
        this.loadDocuments();
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Resubmission failed: ' + (err.error || err.message));
        this.cdr.detectChanges();
      }
    });
  }

  toggleHistory(doc: any) {
    if (this.expandedHistoryId === doc.id) {
      this.expandedHistoryId = null;
      this.docHistory = [];
    } else {
      this.expandedHistoryId = doc.id;
      this.loadingHistory = true;
      this.docHistory = [];
      this.documentService.getDocumentHistory(doc.id).subscribe({
        next: (data) => {
          this.docHistory = data || [];
          this.loadingHistory = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching history', err);
          this.loadingHistory = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  getRoleDisplay(role: string) {
    return role.replace('ROLE_', '').replace('_', ' ');
  }

  viewPdf(doc: any) {
    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }
    const url = `http://localhost:8080/api/documents/download/${doc.fileName}?token=${token}`;
    window.open(url, '_blank');
  }

  goUpload() { this.router.navigate(['/upload']); }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}
