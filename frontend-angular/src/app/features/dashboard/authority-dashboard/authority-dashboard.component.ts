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

            <!-- Approval Action Controls -->
            <div style="margin-top:20px;background:#16213e;padding:16px;border-radius:8px">
              <label style="display:block;margin-bottom:6px;font-size:12px;color:#aaa;font-weight:600;text-transform:uppercase">Review Comments</label>
              <textarea [(ngModel)]="doc.comment" placeholder="Provide approval, rejection, or change-request feedback..." style="width:100%;padding:10px;border-radius:6px;border:1px solid #444;background:#1a1a2e;color:white;box-sizing:border-box;margin-bottom:12px;font-size:14px" rows="2"></textarea>
              
              <div style="display:flex;gap:12px;flex-wrap:wrap">
                <button (click)="processApproval(doc, 'APPROVED')" style="background:#4caf50;color:white;border:none;padding:10px 24px;border-radius:6px;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:6px;box-shadow:0 4px 10px rgba(76,175,80,0.2)">
                  ✅ Approve
                </button>
                <button (click)="processApproval(doc, 'CHANGES_REQUESTED')" style="background:#f5a623;color:black;border:none;padding:10px 24px;border-radius:6px;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:6px;box-shadow:0 4px 10px rgba(245,166,35,0.2)">
                  ✏️ Request Changes
                </button>
                <button (click)="processApproval(doc, 'REJECTED')" style="background:#e94560;color:white;border:none;padding:10px 24px;border-radius:6px;cursor:pointer;font-weight:600;display:flex;align-items:center;gap:6px;box-shadow:0 4px 10px rgba(233,69,96,0.2)">
                  ❌ Reject
                </button>
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
        // Initialize comments field for UI inputs
        this.pending = (data || []).map((doc: any) => ({ ...doc, comment: '' }));
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

  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}
