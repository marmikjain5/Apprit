import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LucideLayoutDashboard, LucideUploadCloud, LucideLightbulb, LucideLogOut, LucideFileText, LucideHourglass, LucideCheckCircle, LucideXCircle, LucideAlertTriangle, LucideRefreshCw, LucideEye, LucideFolderOpen, LucideLink } from '@lucide/angular';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, LucideLayoutDashboard, LucideUploadCloud, LucideLightbulb, LucideLogOut, LucideFileText, LucideHourglass, LucideCheckCircle, LucideXCircle, LucideAlertTriangle, LucideRefreshCw, LucideEye, LucideFolderOpen, LucideLink],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 8V16C28 22.627 22.627 28 16 30C9.373 28 4 22.627 4 16V8L16 2Z" fill="url(#sg1)"/>
              <path d="M11 16l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs><linearGradient id="sg1" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#6C63FF"/><stop offset="1" stop-color="#9B5DE5"/></linearGradient></defs>
            </svg>
          </div>
          <span class="sidebar-brand-name">Apprit</span>
        </div>

        <div class="sidebar-user">
          <div class="user-avatar">{{ usernameInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ username }}</span>
            <span class="user-role">Student</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a class="nav-item active" id="nav-dashboard">
            <span class="nav-icon"><svg lucideLayoutDashboard size="18"></svg></span> Dashboard
          </a>
          <a class="nav-item" id="nav-upload" (click)="goUpload()">
            <span class="nav-icon"><svg lucideUploadCloud size="18"></svg></span> Upload Document
          </a>
          <a class="nav-item" id="nav-hiw" (click)="goHiw()">
            <span class="nav-icon"><svg lucideLightbulb size="18"></svg></span> How It Works
          </a>
        </nav>

        <div class="sidebar-footer">
          <a class="nav-item nav-logout" id="nav-logout" (click)="logout()">
            <span class="nav-icon"><svg lucideLogOut size="18"></svg></span> Logout
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="dashboard-main">
        <header class="topbar">
          <div class="topbar-left">
            <h1 class="page-title">Student Portal</h1>
            <p class="page-sub">Track your submitted documents and approvals</p>
          </div>
          <div class="topbar-right">
            <button id="upload-btn" class="btn btn-primary" (click)="goUpload()" style="display:flex; align-items:center; gap:6px;">
              <svg lucideUploadCloud size="16"></svg> Upload Document
            </button>
          </div>
        </header>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-state">
          <div class="loading-ring"></div>
          <p>Loading your documents...</p>
        </div>

        <!-- Error -->
        <div *ngIf="loadError && !loading" class="alert alert-error animate-fade-in" style="display:flex; align-items:center; gap:8px;">
          <svg lucideAlertTriangle size="20"></svg> {{ loadError }}
          <button class="btn btn-secondary btn-sm" (click)="loadDocuments()" id="retry-btn" style="margin-left: auto;">Retry</button>
        </div>

        <!-- Content -->
        <ng-container *ngIf="!loading">
          <!-- Stats Row -->
          <div class="stats-grid animate-fade-up">
            <div class="stat-card primary">
              <div class="stat-top"><span class="stat-label">Total Documents</span><span class="stat-icon-bg"><svg lucideFileText size="24"></svg></span></div>
              <div class="stat-value">{{ documents.length }}</div>
              <div class="stat-change">All time submissions</div>
            </div>
            <div class="stat-card warning">
              <div class="stat-top"><span class="stat-label">Pending Approval</span><span class="stat-icon-bg"><svg lucideHourglass size="24"></svg></span></div>
              <div class="stat-value">{{ pendingCount }}</div>
              <div class="stat-change">Awaiting review</div>
            </div>
            <div class="stat-card success">
              <div class="stat-top"><span class="stat-label">Approved</span><span class="stat-icon-bg"><svg lucideCheckCircle size="24"></svg></span></div>
              <div class="stat-value">{{ approvedCount }}</div>
              <div class="stat-change positive">Completed</div>
            </div>
            <div class="stat-card danger">
              <div class="stat-top"><span class="stat-label">Rejected</span><span class="stat-icon-bg"><svg lucideXCircle size="24"></svg></span></div>
              <div class="stat-value">{{ rejectedCount }}</div>
              <div class="stat-change">Needs revision</div>
            </div>
          </div>

          <!-- Documents Table -->
          <div class="section-card animate-fade-up">
            <div class="section-header">
              <div>
                <h2 class="section-title">My Documents</h2>
                <p class="section-sub">All submitted documents and their blockchain records</p>
              </div>
              <button class="btn btn-secondary btn-sm" (click)="loadDocuments()" id="refresh-btn" style="display:flex; align-items:center; gap:6px;"><svg lucideRefreshCw size="14"></svg> Refresh</button>
            </div>

            <div class="table-wrapper" *ngIf="documents.length > 0">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Document Title</th>
                    <th>Submitted To</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Blockchain Hash</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let doc of documents" class="animate-fade-in">
                    <td>
                      <div class="doc-title-cell">
                        <span class="doc-file-icon" style="display:flex; align-items:center;"><svg lucideFileText size="20"></svg></span>
                        <div>
                          <span class="doc-name">{{ doc.title }}</span>
                          <span class="doc-type">{{ doc.fileType || 'PDF' }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="text-muted">{{ doc.targetDeptLabel || '—' }}</td>
                    <td class="text-muted">{{ formatDate(doc.uploadedAt || doc.createdAt) }}</td>
                    <td>
                      <span
                        class="badge"
                        [class.badge-success]="doc.status === 'APPROVED'"
                        [class.badge-warning]="doc.status === 'PENDING' || doc.status === 'CHANGES_REQUESTED'"
                        [class.badge-danger]="doc.status === 'REJECTED'"
                        [class.badge-info]="doc.status === 'IN_REVIEW'"
                      >{{ doc.status || 'PENDING' }}</span>
                      
                      <div *ngIf="doc.status === 'CHANGES_REQUESTED'" style="margin-top: 8px;">
                        <p class="text-muted" style="font-size: 11px; margin-bottom: 4px; line-height: 1.2;"><strong>Feedback:</strong> {{ doc.reviewComment }}</p>
                        <button class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px; display:flex; align-items:center; gap:4px;" (click)="fileInput.click()" [disabled]="doc.reuploading">
                           <span *ngIf="!doc.reuploading" style="display:flex; align-items:center; gap:4px;"><svg lucideRefreshCw size="12"></svg> Re-Upload</span>
                           <span *ngIf="doc.reuploading">Uploading...</span>
                        </button>
                        <input type="file" #fileInput (change)="onFileSelected($event, doc, fileInput)" accept=".pdf,.docx" style="display: none;">
                      </div>
                    </td>
                    <td>
                      <span class="hash-cell" *ngIf="doc.fileHashSha256 || doc.ipfsCid">
                        <span class="hash-dot"></span>
                        {{ (doc.fileHashSha256 || doc.ipfsCid || '').substring(0, 16) }}...
                      </span>
                      <span class="text-muted" *ngIf="!doc.fileHashSha256 && !doc.ipfsCid">—</span>
                    </td>
                    <td style="text-align: center;">
                      <a *ngIf="doc.ipfsUrl" [href]="doc.ipfsUrl" target="_blank" style="text-decoration: none; display:flex; justify-content:center;" title="View Document"><svg lucideEye size="16"></svg></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div *ngIf="documents.length === 0 && !loading" class="empty-state">
              <span class="empty-icon" style="display:flex; justify-content:center; align-items:center;"><svg lucideFolderOpen size="48"></svg></span>
              <h3>No documents yet</h3>
              <p>Upload your first document to get started with blockchain-secured approvals</p>
              <button class="btn btn-primary" (click)="goUpload()" id="empty-upload-btn">Upload Document</button>
            </div>
          </div>

          <!-- Blockchain Info Banner -->
          <div class="blockchain-banner animate-fade-up">
            <div class="blockchain-icon" style="display:flex; justify-content:center; align-items:center;"><svg lucideLink size="32"></svg></div>
            <div>
              <h4>Blockchain-Secured Records</h4>
              <p>Every document you submit is hashed using SHA-256, pinned to IPFS via Pinata, and permanently recorded on the blockchain.</p>
            </div>
            <button class="chain-pill" id="learn-more-btn" (click)="goHiw()">Learn More →</button>
          </div>
        </ng-container>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-layout { display: flex; min-height: 100vh; background: var(--bg-base); font-family: var(--font-body); }

    .sidebar { width: 240px; background: var(--bg-surface); border-right: 1px solid var(--border-subtle); display: flex; flex-direction: column; padding: 24px 0; flex-shrink: 0; position: sticky; top: 0; height: 100vh; }
    .sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 20px 24px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 20px; }
    .logo-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.25); display: flex; align-items: center; justify-content: center; }
    .sidebar-brand-name { font-family: var(--font-display); font-size: 20px; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .sidebar-user { display: flex; align-items: center; gap: 12px; padding: 0 20px 20px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 8px; }
    .user-avatar { width: 38px; height: 38px; border-radius: 50%; background: var(--gradient-primary); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: white; flex-shrink: 0; }
    .user-name { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .user-role { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 12px; flex: 1; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-md); color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); text-decoration: none; }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text-primary); }
    .nav-item.active { background: rgba(108,99,255,0.12); color: var(--primary-light); border: 1px solid rgba(108,99,255,0.2); }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid var(--border-subtle); }
    .nav-logout { color: var(--danger); }
    .nav-logout:hover { background: rgba(239,68,68,0.08); color: var(--danger); }

    .dashboard-main { flex: 1; display: flex; flex-direction: column; gap: 24px; padding: 32px; overflow-y: auto; min-width: 0; }
    .topbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .page-sub { font-size: 14px; color: var(--text-secondary); margin: 4px 0 0; }

    /* Loading */
    .loading-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px; color: var(--text-muted); font-size: 14px; }
    .loading-ring { width: 40px; height: 40px; border: 3px solid var(--border-normal); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .stat-card { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); padding: 20px; position: relative; overflow: hidden; transition: all var(--transition-base); }
    .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .stat-card.primary::before { background: var(--gradient-primary); }
    .stat-card.warning::before { background: linear-gradient(90deg,#F59E0B,#FF8C42); }
    .stat-card.success::before { background: linear-gradient(90deg,#22C55E,#10B981); }
    .stat-card.danger::before  { background: linear-gradient(90deg,#EF4444,#F97316); }
    .stat-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); border-color: var(--border-normal); }
    .stat-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .stat-label { font-size: 12px; font-weight: 500; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .stat-icon-bg { font-size: 20px; opacity: 0.7; }
    .stat-value { font-size: 36px; font-weight: 800; color: var(--text-primary); font-family: var(--font-display); line-height: 1; margin-bottom: 8px; }
    .stat-change { font-size: 11px; color: var(--text-muted); }
    .stat-change.positive { color: var(--success); }

    .section-card { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden; }
    .section-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); gap: 16px; flex-wrap: wrap; }
    .section-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .section-sub { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
    .table-wrapper { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table thead tr { border-bottom: 1px solid var(--border-subtle); }
    .data-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); white-space: nowrap; }
    .data-table tbody tr { border-bottom: 1px solid var(--border-subtle); transition: background var(--transition-fast); }
    .data-table tbody tr:last-child { border-bottom: none; }
    .data-table tbody tr:hover { background: rgba(255,255,255,0.02); }
    .data-table td { padding: 14px 16px; font-size: 14px; color: var(--text-primary); }
    .doc-title-cell { display: flex; align-items: center; gap: 12px; }
    .doc-file-icon { font-size: 20px; opacity: 0.7; }
    .doc-name { display: block; font-weight: 500; color: var(--text-primary); }
    .doc-type { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; }
    .text-muted { color: var(--text-secondary) !important; font-size: 13px; }
    .hash-cell { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--success); font-family: monospace; }
    .hash-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 6px rgba(34,197,94,0.6); flex-shrink: 0; }
    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 60px 24px; text-align: center; }
    .empty-icon { font-size: 48px; opacity: 0.5; }
    .empty-state h3 { font-size: 18px; font-weight: 600; color: var(--text-primary); }
    .empty-state p { font-size: 14px; color: var(--text-muted); max-width: 340px; line-height: 1.6; }

    .blockchain-banner { display: flex; align-items: center; gap: 16px; background: linear-gradient(135deg,rgba(108,99,255,0.08),rgba(155,93,229,0.05)); border: 1px solid rgba(108,99,255,0.2); border-radius: var(--radius-lg); padding: 20px 24px; flex-wrap: wrap; }
    .blockchain-icon { font-size: 32px; flex-shrink: 0; }
    .blockchain-banner h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; }
    .blockchain-banner p { font-size: 13px; color: var(--text-secondary); margin: 0; line-height: 1.5; }
    .chain-pill { margin-left: auto; flex-shrink: 0; background: rgba(108,99,255,0.15); color: var(--primary-light); border: 1px solid rgba(108,99,255,0.3); padding: 8px 18px; border-radius: var(--radius-full); font-size: 12px; font-weight: 600; white-space: nowrap; cursor: pointer; transition: all var(--transition-fast); }
    .chain-pill:hover { background: rgba(108,99,255,0.25); }

    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .sidebar { display: none; } .dashboard-main { padding: 16px; } .stats-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class StudentDashboardComponent implements OnInit {
  username = '';
  usernameInitial = '';
  documents: any[] = [];
  loading = false;
  loadError = '';

  get pendingCount()  { return this.documents.filter(d => d.status === 'PENDING' || d.status === 'IN_REVIEW').length; }
  get approvedCount() { return this.documents.filter(d => d.status === 'APPROVED').length; }
  get rejectedCount() { return this.documents.filter(d => d.status === 'REJECTED').length; }

  constructor(private router: Router, private http: HttpClient, private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    let user: any = {};
    try {
      user = JSON.parse(localStorage.getItem('currentUser') || '{}') || {};
    } catch (e) {
      console.warn('Failed to parse currentUser from localStorage:', e);
    }
    this.username = user.username || user.firstName || 'Student';
    this.usernameInitial = this.username.charAt(0).toUpperCase();
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    this.loadError = '';
    this.cdr.detectChanges();
    
    let token = localStorage.getItem('token');
    if (!token) {
      try {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}') || {};
        token = user.token;
      } catch (e) {
        console.warn('Failed to parse token from currentUser:', e);
      }
    }
    
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + (token || '') });

    // Safety timeout: if the request hangs for more than 10 seconds, force dismiss loading
    const safetyTimer = setTimeout(() => {
      if (this.loading) {
        console.warn('Apprit Dashboard - Safety timeout reached (10s). Forcing loading=false.');
        this.zone.run(() => {
          this.loading = false;
          this.loadError = 'Request timed out. Please click Retry.';
          this.cdr.detectChanges();
        });
      }
    }, 10000);

    this.http.get<any[]>('http://localhost:8080/api/documents/my', { headers }).subscribe({
      next: (docs) => {
        clearTimeout(safetyTimer);
        console.log('Apprit Dashboard - Received docs:', JSON.stringify(docs));
        this.zone.run(() => {
          try {
            this.documents = docs || [];
          } catch (e) {
            console.error('Apprit Dashboard - Render error:', e);
            this.loadError = 'An error occurred while loading dashboard items.';
          } finally {
            this.loading = false;
            console.log('Apprit Dashboard - Set loading to false. Total docs:', this.documents.length);
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        clearTimeout(safetyTimer);
        console.error('Apprit Dashboard - API error:', err);
        this.zone.run(() => {
          this.loading = false;
          if (err.status === 401) {
            this.loadError = 'Session expired. Please login again.';
            setTimeout(() => this.logout(), 2000);
          } else if (err.status === 0) {
            this.loadError = 'Cannot reach the server. Make sure the Spring Boot backend is running on port 8080.';
          } else {
            this.loadError = err?.error?.message || 'Failed to load documents.';
          }
          this.cdr.detectChanges();
        });
      }
    });
  }

  formatDate(dateStr: any): string {
    if (!dateStr) return '—';
    try {
      // If dateStr is a numeric array from Jackson (e.g. [2026, 5, 27, 0, 8])
      if (Array.isArray(dateStr)) {
        const year = dateStr[0];
        const month = dateStr[1] - 1; // JS months are 0-indexed
        const day = dateStr[2];
        const hour = dateStr[3] || 0;
        const minute = dateStr[4] || 0;
        return new Date(year, month, day, hour, minute).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
      }
      // If dateStr is a serialized LocalDateTime object
      if (typeof dateStr === 'object') {
        const year = dateStr.year || dateStr.yearOfEra;
        const month = dateStr.monthValue !== undefined ? dateStr.monthValue - 1 : 0;
        const day = dateStr.dayOfMonth || dateStr.dayOfValue;
        const hour = dateStr.hour || 0;
        const minute = dateStr.minute || 0;
        if (year && day) {
          return new Date(year, month, day, hour, minute).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        }
        return JSON.stringify(dateStr);
      }
      return new Date(dateStr).toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      console.warn('Failed to parse date:', dateStr, e);
      return String(dateStr);
    }
  }

  goUpload() { this.router.navigate(['/upload']); }

  onFileSelected(event: any, doc: any, inputEl: HTMLInputElement) {
    const file: File = event.target.files[0];
    if (file) {
      this.reuploadDocument(file, doc);
    }
    inputEl.value = '';
  }

  reuploadDocument(file: File, doc: any) {
    if (file.size > 10 * 1024 * 1024) {
      alert("File exceeds 10MB limit.");
      return;
    }
    doc.reuploading = true;
    this.cdr.detectChanges();

    const formData = new FormData();
    formData.append('file', file);

    let token = localStorage.getItem('token');
    if (!token) {
       const user = JSON.parse(localStorage.getItem('currentUser') || '{}') || {};
       token = user.token;
    }
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + (token || '') });

    this.http.post<any>(`http://localhost:8080/api/documents/${doc.id}/reupload`, formData, { headers }).subscribe({
      next: (res) => {
        this.zone.run(() => {
          doc.reuploading = false;
          this.loadDocuments();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          doc.reuploading = false;
          this.cdr.detectChanges();
          alert(err?.error?.message || 'Re-upload failed. Please try again.');
        });
      }
    });
  }

  goHiw()    { this.router.navigate(['/how-it-works']); }
  logout()   { localStorage.clear(); this.router.navigate(['/login']); }
}
