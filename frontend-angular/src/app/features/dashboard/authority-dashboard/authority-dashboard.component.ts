import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DocumentService } from '../../../core/services/document.service';

@Component({
  selector: 'app-authority-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height:100vh;background:#1a1a2e;color:white;font-family:'Segoe UI',Roboto,sans-serif">
      <nav style="background:#16213e;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #e94560;box-shadow:0 4px 20px rgba(0,0,0,0.3)">
        <h1 style="color:#e94560;margin:0;font-weight:700;letter-spacing:1px">🏛️ Apprit - Authority Portal</h1>
        <div style="display:flex;align-items:center;gap:16px">
          <span style="background:#0f3460;padding:6px 14px;border-radius:20px;font-size:13px;border:1px solid #e94560">
            👤 {{getUserRole()}}
          </span>
          <button (click)="logout()" style="background:#444;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;font-weight:600">Logout</button>
        </div>
      </nav>

      <div style="padding:32px">
        <!-- Stats Cards -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px">
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #f5a623;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
            <h3 style="margin:0;color:#aaa;font-size:14px;text-transform:uppercase;letter-spacing:0.5px">Pending Review</h3>
            <p style="font-size:36px;margin:8px 0;font-weight:700">{{pending.length}}</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #4caf50;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
            <h3 style="margin:0;color:#aaa;font-size:14px;text-transform:uppercase;letter-spacing:0.5px">Action Level Mapped</h3>
            <p style="font-size:36px;margin:8px 0;font-weight:700">{{getUserLevel()}}</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #e94560;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
            <h3 style="margin:0;color:#aaa;font-size:14px;text-transform:uppercase;letter-spacing:0.5px">Total Registered Roles</h3>
            <p style="font-size:36px;margin:8px 0;font-weight:700">{{getUserRolesCount()}}</p>
          </div>
        </div>

        <!-- Pending Documents List -->
        <div style="background:#16213e;border-radius:12px;padding:24px;box-shadow:0 4px 15px rgba(0,0,0,0.2)">
          <h2 style="color:#e94560;margin-top:0;font-weight:600">📋 Pending Approvals</h2>
          
          <div *ngFor="let doc of pending" style="background:#0f3460;padding:24px;border-radius:10px;margin-bottom:20px;border:1px solid #222;box-shadow:0 4px 10px rgba(0,0,0,0.15)">
            <div style="display:flex;justify-content:space-between;align-items:start;flex-wrap:wrap;gap:12px">
              <div>
                <h3 style="margin:0 0 8px 0;font-size:20px;font-weight:600;color:white">{{doc.title}}</h3>
                <p style="color:#ccc;margin:0 0 12px 0;font-size:14px">{{doc.description}}</p>
                <div style="display:flex;gap:6px;margin-bottom:12px;font-size:10px;align-items:center;flex-wrap:wrap">
                  <span style="color:#aaa;margin-right:4px;font-size:11px;font-weight:600;text-transform:uppercase">Approval Flow:</span>
                  <span [style.background]="getLevelStatusColor(doc, 1)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">Club Coord</span>
                  <span style="color:#666">➔</span>
                  <span [style.background]="getLevelStatusColor(doc, 2)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">HOD</span>
                  <span style="color:#666">➔</span>
                  <span [style.background]="getLevelStatusColor(doc, 3)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">Dean</span>
                  <span style="color:#666">➔</span>
                  <span [style.background]="getLevelStatusColor(doc, 4)" style="padding:2px 8px;border-radius:4px;color:white;font-weight:600">Principal</span>
                </div>
                <p style="color:#aaa;margin:0 0 6px 0;font-size:13px">
                  Submitted by User ID: <strong style="color:white">{{doc.uploadedBy}}</strong> | Department ID: <strong style="color:white">{{doc.deptId}}</strong>
                </p>
                <p style="color:#4caf50;margin:0;font-size:12px;font-family:monospace;word-break:break-all">
                  🔗 Document Hash (SHA-256): {{doc.fileHashSha256}}
                </p>
              </div>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px">
                <span style="background:#e65100;color:white;padding:6px 14px;border-radius:20px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px">
                  Level {{doc.currentLevel}} / 4
                </span>
                <span style="font-size:11px;color:#aaa">Created: {{doc.createdAt | date:'short'}}</span>
              </div>
            </div>

            <!-- Action buttons: View Document / View History -->
            <div style="margin-top:16px;display:flex;gap:12px">
              <button (click)="viewPdf(doc)" style="background:#1a5f7a;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px">
                👁️ View PDF Document
              </button>
              <button (click)="toggleHistory(doc)" style="background:#0f3460;color:#ccc;border:1px solid #444;padding:8px 16px;border-radius:6px;cursor:pointer;font-weight:600;font-size:13px;display:flex;align-items:center;gap:6px">
                📜 {{expandedHistoryId === doc.id ? 'Hide Logs' : 'View Approval History'}}
              </button>
            </div>

            <!-- History log collapsible panel -->
            <div *ngIf="expandedHistoryId === doc.id" style="margin-top:16px;background:#16213e;padding:16px;border-radius:8px">
              <h4 style="color:#e94560;margin-top:0;margin-bottom:12px">📋 Approval History Log</h4>
              <div *ngIf="loadingHistory" style="color:#aaa">Loading history...</div>
              <div *ngIf="!loadingHistory && docHistory.length === 0" style="color:#aaa;font-size:13px">
                No approval logs recorded yet. (This is the initial level).
              </div>
              <div *ngIf="!loadingHistory && docHistory.length > 0" style="display:flex;flex-direction:column;gap:12px">
                <div *ngFor="let log of docHistory" 
                     style="background:#0f3460;padding:12px;border-radius:6px;border-left:4px solid"
                     [style.border-left-color]="getStatusColor(log.action)">
                  <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
                    <span style="font-weight:600;color:lightgreen">
                      {{log.approverName}} ({{getRoleDisplay(log.approverRole)}} - ID: {{log.approverId}})
                    </span>
                    <span style="font-size:11px;color:#aaa">
                      {{log.timestamp | date:'medium'}}
                    </span>
                  </div>
                  <div style="margin-bottom:4px;font-size:13px">
                    Action: 
                    <span [style.color]="getStatusColor(log.action)" style="font-weight:600;text-transform:uppercase">
                      {{log.action}}
                    </span>
                  </div>
                  <div *ngIf="log.comments" style="color:#ccc;font-style:italic;font-size:12px">
                    "{{log.comments}}"
                  </div>
                </div>
              </div>
            </div>

            <!-- Approval Action Controls -->
            <div style="margin-top:20px;background:#16213e;padding:16px;border-radius:8px">
              <label style="display:block;margin-bottom:6px;font-size:12px;color:#aaa;font-weight:600;text-transform:uppercase">Review Comments</label>
              <textarea [(ngModel)]="doc.comment" placeholder="Provide approval, rejection, or change-request feedback..." style="width:100%;padding:10px;border-radius:6px;border:1px solid #444;background:#1a1a2e;color:white;box-sizing:border-box;margin-bottom:12px;font-size:14px" rows="2"></textarea>
              
              <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
                <button (click)="processApproval(doc, 'APPROVED')" 
                        [style.opacity]="doc.viewed ? '1' : '0.5'"
                        [style.cursor]="doc.viewed ? 'pointer' : 'not-allowed'"
                        style="background:#4caf50;color:white;border:none;padding:10px 24px;border-radius:6px;font-weight:600;display:flex;align-items:center;gap:6px;box-shadow:0 4px 10px rgba(76,175,80,0.2)">
                  ✅ Approve
                </button>
                <button (click)="processApproval(doc, 'CHANGES_REQUESTED')" 
                        [style.opacity]="doc.viewed ? '1' : '0.5'"
                        [style.cursor]="doc.viewed ? 'pointer' : 'not-allowed'"
                        style="background:#f5a623;color:black;border:none;padding:10px 24px;border-radius:6px;font-weight:600;display:flex;align-items:center;gap:6px;box-shadow:0 4px 10px rgba(245,166,35,0.2)">
                  ✏️ Request Changes
                </button>
                <button (click)="processApproval(doc, 'REJECTED')" 
                        [style.opacity]="doc.viewed ? '1' : '0.5'"
                        [style.cursor]="doc.viewed ? 'pointer' : 'not-allowed'"
                        style="background:#e94560;color:white;border:none;padding:10px 24px;border-radius:6px;font-weight:600;display:flex;align-items:center;gap:6px;box-shadow:0 4px 10px rgba(233,69,96,0.2)">
                  ❌ Reject
                </button>
                <span *ngIf="!doc.viewed" style="color:#ff8f00;font-size:13px;font-weight:500;display:flex;align-items:center;gap:4px">
                  ⚠️ Please click "View PDF Document" above to inspect and unlock these controls.
                </span>
              </div>
            </div>
          </div>

          <div *ngIf="pending.length === 0" style="padding:48px;text-align:center">
            <p style="color:#aaa;font-size:16px;margin:0">No pending approvals for your role & department 🎉</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AuthorityDashboardComponent implements OnInit {
  pending: any[] = [];
  currentUser: any = null;

  expandedHistoryId: string | null = null;
  docHistory: any[] = [];
  loadingHistory = false;

  constructor(private router: Router, private documentService: DocumentService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    this.loadPendingDocuments();
  }

  loadPendingDocuments() {
    this.documentService.getPendingDocuments().subscribe({
      next: (data) => {
        // Initialize comments and viewed status field for UI inputs
        this.pending = (data || []).map((doc: any) => ({ ...doc, comment: '', viewed: false }));
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching pending documents', err);
      }
    });
  }

  getUserRole() {
    if (!this.currentUser || !this.currentUser.roles) return 'N/A';
    // Clean up role display
    return this.currentUser.roles.map((r: string) => r.replace('ROLE_', '')).join(', ');
  }

  getUserRolesCount() {
    return this.currentUser?.roles?.length || 0;
  }

  getUserLevel() {
    if (!this.currentUser || !this.currentUser.roles) return 'N/A';
    const roles = this.currentUser.roles;
    if (roles.includes('ROLE_PRINCIPAL')) return 'Level 4 (Principal)';
    if (roles.includes('ROLE_DEAN')) return 'Level 3 (Dean)';
    if (roles.includes('ROLE_HOD')) return 'Level 2 (HOD)';
    if (roles.includes('ROLE_CLUB_COORDINATOR')) return 'Level 1 (Club Coordinator)';
    return 'Level Mapped';
  }

  processApproval(doc: any, action: string) {
    if (!doc.viewed) {
      alert('Security Protection: You must click "View PDF Document" to review the document first before submitting a decision!');
      return;
    }
    if (action !== 'APPROVED' && !doc.comment) {
      alert('You must provide a comment when requesting changes or rejecting a document.');
      return;
    }

    this.documentService.approveDocument(doc.id, action, doc.comment || 'Approved').subscribe({
      next: (res) => {
        alert(`Document successfully processed: ${action} and recorded on blockchain!`);
        this.loadPendingDocuments();
        this.cdr.detectChanges();
      },
      error: (err) => {
        alert('Action failed: ' + (err.error || err.message));
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

  getStatusColor(status: string) {
    switch (status) {
      case 'APPROVED': return '#4caf50';
      case 'REJECTED': return '#e94560';
      case 'CHANGES_REQUESTED': return '#f5a623';
      case 'PARTIALLY_APPROVED': return '#006064';
      default: return '#e65100';
    }
  }

  viewPdf(doc: any) {
    doc.viewed = true;
    let token = '';
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      const user = JSON.parse(stored);
      token = user.token || '';
    }
    const url = `http://localhost:8080/api/documents/download/${doc.fileName}?token=${token}`;
    window.open(url, '_blank');
    this.cdr.detectChanges();
  }

  getLevelStatusColor(doc: any, level: number): string {
    if (doc.status === 'APPROVED') {
      return '#4caf50';
    }
    if (doc.status === 'REJECTED') {
      if (doc.currentLevel === level) return '#e94560';
      if (doc.currentLevel > level) return '#4caf50';
      return '#444444';
    }
    if (doc.status === 'CHANGES_REQUESTED') {
      if (doc.currentLevel === level) return '#f5a623';
      if (doc.currentLevel > level) return '#4caf50';
      return '#444444';
    }
    if (doc.currentLevel === level) {
      return '#2196f3';
    }
    if (doc.currentLevel > level) {
      return '#4caf50';
    }
    return '#444444';
  }

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}
