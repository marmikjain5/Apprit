import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LucideClipboardList, LucideHistory, LucideLightbulb, LucideLogOut, LucideRefreshCw, LucideHourglass, LucideCheckCircle, LucideXCircle, LucideLink, LucideAlertTriangle, LucideFileText, LucideUser, LucideCalendar, LucideEye, LucideCheck, LucideX, LucidePartyPopper } from '@lucide/angular';
@Component({
  selector: 'app-authority-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideClipboardList, LucideHistory, LucideLightbulb, LucideLogOut, LucideRefreshCw, LucideHourglass, LucideCheckCircle, LucideXCircle, LucideLink, LucideAlertTriangle, LucideFileText, LucideUser, LucideCalendar, LucideEye, LucideCheck, LucideX, LucidePartyPopper],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 8V16C28 22.627 22.627 28 16 30C9.373 28 4 22.627 4 16V8L16 2Z" fill="url(#ag1)"/>
              <path d="M11 16l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs><linearGradient id="ag1" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#6C63FF"/><stop offset="1" stop-color="#9B5DE5"/></linearGradient></defs>
            </svg>
          </div>
          <span class="sidebar-brand-name">Apprit</span>
        </div>

        <div class="sidebar-user">
          <div class="user-avatar">{{ roleInitial }}</div>
          <div class="user-info">
            <span class="user-name">{{ roleName }}</span>
            <span class="user-role">Authority</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a class="nav-item" [class.active]="activeTab === 'pending'" id="nav-approvals" (click)="activeTab = 'pending'">
            <span class="nav-icon"><svg lucideClipboardList size="18"></svg></span> Pending Approvals
            <span class="nav-badge" *ngIf="pending.length > 0">{{ pending.length }}</span>
          </a>
          <a class="nav-item" [class.active]="activeTab === 'history'" id="nav-history" (click)="activeTab = 'history'">
            <span class="nav-icon"><svg lucideHistory size="18"></svg></span> Approval History
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

      <!-- Main -->
      <main class="dashboard-main">
        <header class="topbar">
          <div>
            <h1 class="page-title">Authority Portal</h1>
            <p class="page-sub">Review and action pending document approvals</p>
          </div>
          <button class="btn btn-secondary btn-sm" (click)="loadPending()" id="refresh-btn" style="display:flex; align-items:center; gap:6px;">
            <svg lucideRefreshCw size="14"></svg> Refresh
          </button>
        </header>

        <!-- Stats Row -->
        <div class="stats-grid animate-fade-up">
          <div class="stat-card warning">
            <div class="stat-top"><span class="stat-label">Awaiting Review</span><span class="stat-icon-bg"><svg lucideHourglass size="24"></svg></span></div>
            <div class="stat-value">{{ pending.length }}</div>
            <div class="stat-change">Needs your attention</div>
          </div>
          <div class="stat-card success">
            <div class="stat-top"><span class="stat-label">Approved</span><span class="stat-icon-bg"><svg lucideCheckCircle size="24"></svg></span></div>
            <div class="stat-value">{{ approvedCount }}</div>
            <div class="stat-change positive">Documents signed</div>
          </div>
          <div class="stat-card danger">
            <div class="stat-top"><span class="stat-label">Rejected</span><span class="stat-icon-bg"><svg lucideXCircle size="24"></svg></span></div>
            <div class="stat-value">{{ rejectedCount }}</div>
            <div class="stat-change">Returned to sender</div>
          </div>
          <div class="stat-card info">
            <div class="stat-top"><span class="stat-label">Total Processed</span><span class="stat-icon-bg"><svg lucideLink size="24"></svg></span></div>
            <div class="stat-value">{{ approvedCount + rejectedCount }}</div>
            <div class="stat-change positive">On-chain records</div>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading" class="loading-state">
          <div class="loading-ring"></div>
          <p>Loading pending approvals...</p>
        </div>

        <!-- Error -->
        <div *ngIf="loadError && !loading" class="alert alert-error animate-fade-in" style="display:flex; align-items:center; gap:8px;">
          <svg lucideAlertTriangle size="20"></svg> {{ loadError }}
          <button class="btn btn-secondary btn-sm" (click)="loadPending()" id="retry-btn" style="margin-left: auto;">Retry</button>
        </div>

        <!-- Pending Cards -->
        <div class="section-card animate-fade-up" *ngIf="!loading && activeTab === 'pending'">
          <div class="section-header">
            <div>
              <h2 class="section-title" style="display:flex; align-items:center; gap:8px;"><svg lucideClipboardList size="20"></svg> Pending Approvals</h2>
              <p class="section-sub">Review document details before approving or rejecting</p>
            </div>
          </div>

          <div class="pending-list" *ngIf="pending.length > 0">
            <div class="pending-card" *ngFor="let doc of pending; let i = index" [id]="'doc-card-' + doc.id">
              <div class="pending-card-header">
                <div class="pending-doc-info">
                  <div class="pending-doc-icon" style="display:flex; align-items:center; justify-content:center;"><svg lucideFileText size="32"></svg></div>
                  <div>
                    <h3 class="pending-doc-title">{{ doc.title }}</h3>
                    <div class="pending-meta">
                      <span style="display:flex; align-items:center; gap:4px;"><svg lucideUser size="14"></svg> {{ doc.uploaderUsername || doc.studentName || 'Unknown' }}</span>
                      <span class="meta-sep">·</span>
                      <span style="display:flex; align-items:center; gap:4px;"><svg lucideCalendar size="14"></svg> {{ formatDate(doc.uploadedAt || doc.createdAt) }}</span>
                    </div>
                    <div class="hash-cell" style="margin-top: 6px;" *ngIf="doc.fileHashSha256 || doc.ipfsCid">
                      <span class="hash-dot"></span>
                      <span>{{ (doc.fileHashSha256 || doc.ipfsCid || '').substring(0, 20) }}...</span>
                    </div>
                    <p class="doc-description" *ngIf="doc.description">{{ doc.description }}</p>
                  </div>
                </div>
                <span class="badge badge-warning">PENDING</span>
              </div>

              <div class="pending-card-body">
                <label class="form-label" style="font-size: 11px;">Comments (optional)</label>
                <textarea
                  [(ngModel)]="doc.comment"
                  placeholder="Add your review remarks..."
                  class="form-input"
                  [id]="'comment-' + doc.id"
                  rows="2"
                  style="resize: vertical; min-height: 60px;"
                ></textarea>
              </div>

              <div class="pending-card-actions">
                <a
                  *ngIf="doc.ipfsUrl"
                  [href]="doc.ipfsUrl"
                  target="_blank"
                  class="btn btn-secondary"
                  [id]="'view-' + doc.id"
                  style="display:flex; align-items:center; gap:6px;"
                >
                  <svg lucideEye size="16"></svg> View Document
                </a>
                <button
                  class="btn btn-success"
                  (click)="approve(doc)"
                  [disabled]="doc.processing"
                  [id]="'approve-' + doc.id"
                  style="display:flex; align-items:center; gap:6px;"
                >
                  <span *ngIf="!doc.processing" style="display:flex; align-items:center; gap:6px;"><svg lucideCheck size="16"></svg> Approve</span>
                  <span *ngIf="doc.processing">Processing...</span>
                </button>
                <button
                  class="btn btn-warning"
                  (click)="requestChanges(doc)"
                  [disabled]="doc.processing"
                  [id]="'request-changes-' + doc.id"
                  style="color: #1a1a1a; display:flex; align-items:center; gap:6px;"
                >
                  <svg lucideRefreshCw size="16"></svg> Needs Revision
                </button>
                <button
                  class="btn btn-danger"
                  (click)="reject(doc)"
                  [disabled]="doc.processing"
                  [id]="'reject-' + doc.id"
                  style="display:flex; align-items:center; gap:6px;"
                >
                  <svg lucideX size="16"></svg> Reject
                </button>
              </div>

              <div *ngIf="doc.actionError" class="alert alert-error animate-fade-in" style="margin-top: 12px; margin-bottom: 0; display:flex; align-items:center; gap:8px;">
                <svg lucideAlertTriangle size="20"></svg> {{ doc.actionError }}
              </div>
            </div>
          </div>

          <div class="empty-state" *ngIf="pending.length === 0 && !loading">
            <span class="empty-icon" style="display:flex; justify-content:center; align-items:center;"><svg lucidePartyPopper size="48"></svg></span>
            <h3>All caught up!</h3>
            <p>No documents pending your review at this time</p>
          </div>
        </div>

        <!-- Recent History -->
        <div class="section-card animate-fade-up" *ngIf="!loading && activeTab === 'history'">
          <div class="section-header">
            <div>
              <h2 class="section-title" style="display:flex; align-items:center; gap:8px;"><svg lucideHistory size="20"></svg> Recent Actions</h2>
              <p class="section-sub">Your latest approval decisions</p>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Submitted By</th>
                  <th>Action</th>
                  <th>Date</th>
                  <th>Hash</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let h of history">
                  <td><span class="doc-name">{{ h.title }}</span></td>
                  <td class="text-muted">{{ h.uploaderUsername || h.studentName }}</td>
                  <td>
                    <span class="badge" 
                          [class.badge-success]="(h.lastAction || h.status) === 'APPROVED'" 
                          [class.badge-danger]="(h.lastAction || h.status) === 'REJECTED'"
                          [class.badge-warning]="(h.lastAction || h.status) === 'CHANGES_REQUESTED'">
                      {{ h.lastAction || h.status }}
                    </span>
                  </td>
                  <td class="text-muted">{{ formatDate(h.updatedAt) }}</td>
                  <td>
                    <span class="hash-cell" *ngIf="h.fileHashSha256">
                      <span class="hash-dot"></span>{{ h.fileHashSha256.substring(0, 12) }}...
                    </span>
                    <span class="text-muted" *ngIf="!h.fileHashSha256">—</span>
                  </td>
                  <td style="text-align: center;">
                    <a *ngIf="h.ipfsUrl" [href]="h.ipfsUrl" target="_blank" style="text-decoration: none; display:flex; justify-content:center;" title="View Document"><svg lucideEye size="16"></svg></a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
    .user-avatar { width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg,#FF6584,#FF8C42); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: white; flex-shrink: 0; }
    .user-name { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .user-role { display: block; font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 12px; flex: 1; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-md); color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); text-decoration: none; }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text-primary); }
    .nav-item.active { background: rgba(108,99,255,0.12); color: var(--primary-light); border: 1px solid rgba(108,99,255,0.2); }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .nav-badge { margin-left: auto; background: var(--warning); color: white; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: var(--radius-full); }
    .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid var(--border-subtle); }
    .nav-logout { color: var(--danger); }
    .nav-logout:hover { background: rgba(239,68,68,0.08); color: var(--danger); }

    .dashboard-main { flex: 1; display: flex; flex-direction: column; gap: 24px; padding: 32px; overflow-y: auto; min-width: 0; }
    .topbar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .page-sub { font-size: 14px; color: var(--text-secondary); margin: 4px 0 0; }

    .loading-state { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px; color: var(--text-muted); font-size: 14px; }
    .loading-ring { width: 40px; height: 40px; border: 3px solid var(--border-normal); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .stat-card { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); padding: 20px; position: relative; overflow: hidden; transition: all var(--transition-base); }
    .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; }
    .stat-card.warning::before { background: linear-gradient(90deg,#F59E0B,#FF8C42); }
    .stat-card.success::before { background: linear-gradient(90deg,#22C55E,#10B981); }
    .stat-card.danger::before  { background: linear-gradient(90deg,#EF4444,#F97316); }
    .stat-card.info::before    { background: linear-gradient(90deg,#38BDF8,#818CF8); }
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

    .pending-list { display: flex; flex-direction: column; }
    .pending-card { padding: 24px; border-bottom: 1px solid var(--border-subtle); transition: background var(--transition-fast); }
    .pending-card:last-child { border-bottom: none; }
    .pending-card:hover { background: rgba(255,255,255,0.01); }
    .pending-card-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
    .pending-doc-info { display: flex; gap: 16px; align-items: flex-start; flex: 1; }
    .pending-doc-icon { font-size: 32px; flex-shrink: 0; }
    .pending-doc-title { font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0 0 6px; }
    .pending-meta { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-secondary); flex-wrap: wrap; }
    .meta-sep { color: var(--border-normal); }
    .doc-description { font-size: 13px; color: var(--text-muted); margin: 6px 0 0; font-style: italic; }
    .hash-cell { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--success); font-family: monospace; }
    .hash-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); box-shadow: 0 0 6px rgba(34,197,94,0.6); flex-shrink: 0; }
    .pending-card-body { margin-bottom: 16px; }
    .pending-card-actions { display: flex; gap: 12px; flex-wrap: wrap; }

    .table-wrapper { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table thead tr { border-bottom: 1px solid var(--border-subtle); }
    .data-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); }
    .data-table tbody tr { border-bottom: 1px solid var(--border-subtle); transition: background var(--transition-fast); }
    .data-table tbody tr:last-child { border-bottom: none; }
    .data-table tbody tr:hover { background: rgba(255,255,255,0.02); }
    .data-table td { padding: 14px 16px; font-size: 14px; color: var(--text-primary); }
    .doc-name { font-weight: 500; }
    .text-muted { color: var(--text-secondary) !important; font-size: 13px; }

    .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; padding: 60px 24px; text-align: center; }
    .empty-icon { font-size: 48px; }
    .empty-state h3 { font-size: 18px; font-weight: 600; color: var(--text-primary); }
    .empty-state p { font-size: 14px; color: var(--text-muted); }

    @media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) { .sidebar { display: none; } .dashboard-main { padding: 16px; } .stats-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class AuthorityDashboardComponent implements OnInit {
  roleName = 'Authority';
  roleInitial = 'A';
  pending: any[] = [];
  history: any[] = [];
  loading = false;
  loadError = '';
  approvedCount = 0;
  rejectedCount = 0;
  activeTab: 'pending' | 'history' = 'pending';

  constructor(private router: Router, private http: HttpClient, private zone: NgZone, private cdr: ChangeDetectorRef) {
    const role = localStorage.getItem('role') || JSON.parse(localStorage.getItem('currentUser') || '{}')?.roles?.[0] || '';
    if (role.includes('PRINCIPAL') && !role.includes('VICE')) { this.roleName = 'Principal'; this.roleInitial = 'P'; }
    else if (role.includes('VICE')) { this.roleName = 'Vice Principal'; this.roleInitial = 'V'; }
    else if (role.includes('HOD')) { this.roleName = 'HOD'; this.roleInitial = 'H'; }
    else if (role.includes('DEAN')) { this.roleName = 'Dean'; this.roleInitial = 'D'; }
    else if (role.includes('FACULTY')) { this.roleName = 'Faculty'; this.roleInitial = 'F'; }
  }

  ngOnInit() { this.loadPending(); this.loadHistory(); }

  private getHeaders() {
    const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('currentUser') || '{}').token;
    return new HttpHeaders({ 'Authorization': 'Bearer ' + token });
  }

  loadPending() {
    this.loading = true;
    this.loadError = '';
    this.cdr.detectChanges();
    
    const safetyTimer = setTimeout(() => {
      if (this.loading) {
        console.warn('Authority Dashboard - Safety timeout reached (10s). Forcing loading=false.');
        this.zone.run(() => {
          this.loading = false;
          this.loadError = 'Request timed out. Please click Retry.';
          this.cdr.detectChanges();
        });
      }
    }, 10000);

    this.http.get<any[]>('http://localhost:8080/api/documents/pending', { headers: this.getHeaders() }).subscribe({
      next: (docs) => {
        clearTimeout(safetyTimer);
        this.zone.run(() => {
          this.pending = (docs || []).map(d => ({ ...d, comment: '', processing: false, actionError: '' }));
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        clearTimeout(safetyTimer);
        this.zone.run(() => {
          this.loading = false;
          if (err.status === 401) { this.loadError = 'Session expired.'; setTimeout(() => this.logout(), 2000); }
          else if (err.status === 0) { this.loadError = 'Cannot reach the server. Make sure Spring Boot is running on port 8080.'; }
          else { this.loadError = err?.error?.message || 'Failed to load pending documents.'; }
          this.cdr.detectChanges();
        });
      }
    });
  }

  loadHistory() {
    this.http.get<any[]>('http://localhost:8080/api/documents/reviewed', { headers: this.getHeaders() }).subscribe({
      next: (docs) => {
        this.zone.run(() => {
          this.history = docs || [];
          this.approvedCount = this.history.filter(d => (d.lastAction || d.status) === 'APPROVED').length;
          this.rejectedCount = this.history.filter(d => (d.lastAction || d.status) === 'REJECTED').length;
          this.cdr.detectChanges();
        });
      },
      error: () => {}
    });
  }

  approve(doc: any) {
    doc.processing = true;
    doc.actionError = '';
    this.cdr.detectChanges();
    this.http.post(`http://localhost:8080/api/documents/${doc.id}/approve`,
      { comment: doc.comment }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.zone.run(() => {
          this.approvedCount++;
          this.pending = this.pending.filter(d => d.id !== doc.id);
          this.history.unshift({ ...doc, lastAction: 'APPROVED', updatedAt: new Date().toISOString() });
          this.cdr.detectChanges();
        });
      },
      error: (err) => { 
        this.zone.run(() => {
          doc.processing = false;
          doc.actionError = err?.error?.message || 'Failed to approve. Please try again.'; 
          this.cdr.detectChanges();
        });
      }
    });
  }

  reject(doc: any) {
    if (!doc.comment?.trim()) { doc.actionError = 'Please add a comment explaining the rejection reason.'; return; }
    doc.processing = true;
    doc.actionError = '';
    this.cdr.detectChanges();
    this.http.post(`http://localhost:8080/api/documents/${doc.id}/reject`,
      { comment: doc.comment }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.zone.run(() => {
          this.rejectedCount++;
          this.pending = this.pending.filter(d => d.id !== doc.id);
          this.history.unshift({ ...doc, lastAction: 'REJECTED', updatedAt: new Date().toISOString() });
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          doc.processing = false; 
          doc.actionError = err?.error?.message || 'Failed to reject. Please try again.'; 
          this.cdr.detectChanges();
        });
      }
    });
  }

  requestChanges(doc: any) {
    if (!doc.comment?.trim()) { doc.actionError = 'Please add a comment explaining what changes are required.'; return; }
    doc.processing = true;
    doc.actionError = '';
    this.cdr.detectChanges();
    this.http.post(`http://localhost:8080/api/documents/${doc.id}/request-changes`,
      { comment: doc.comment }, { headers: this.getHeaders() }).subscribe({
      next: () => {
        this.zone.run(() => {
          this.pending = this.pending.filter(d => d.id !== doc.id);
          this.history.unshift({ ...doc, lastAction: 'CHANGES_REQUESTED', updatedAt: new Date().toISOString() });
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.zone.run(() => {
          doc.processing = false; 
          doc.actionError = err?.error?.message || 'Failed to request changes. Please try again.'; 
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

  goHiw()  { this.router.navigate(['/how-it-works']); }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}
