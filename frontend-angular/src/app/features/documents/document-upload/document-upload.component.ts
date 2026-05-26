import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { LucideLayoutDashboard, LucideUploadCloud, LucideLogOut, LucideFileText, LucideMonitor, LucideCpu, LucideRadio, LucideSettings, LucideBuilding, LucideScale, LucideCrown, LucideCloud, LucideCheckCircle, LucideAlertTriangle, LucideSend, LucideLink, LucideLightbulb, LucideShieldCheck } from '@lucide/angular';

@Component({
  selector: 'app-document-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideLayoutDashboard, LucideUploadCloud, LucideLogOut, LucideFileText, LucideMonitor, LucideCpu, LucideRadio, LucideSettings, LucideBuilding, LucideScale, LucideCrown, LucideCloud, LucideCheckCircle, LucideAlertTriangle, LucideSend, LucideLink, LucideLightbulb, LucideShieldCheck],
  template: `
    <div class="upload-page">
      <!-- Sidebar (mini) -->
      <aside class="mini-sidebar">
        <div class="sidebar-brand">
          <div class="logo-icon">
            <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 8V16C28 22.627 22.627 28 16 30C9.373 28 4 22.627 4 16V8L16 2Z" fill="url(#ug1)"/>
              <path d="M11 16l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs><linearGradient id="ug1" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#6C63FF"/><stop offset="1" stop-color="#9B5DE5"/></linearGradient></defs>
            </svg>
          </div>
          <span class="sidebar-brand-name">Apprit</span>
        </div>
        <nav class="sidebar-nav">
          <a class="nav-item" id="nav-back-dashboard" (click)="goBack()">
            <span class="nav-icon"><svg lucideLayoutDashboard size="18"></svg></span> Dashboard
          </a>
          <a class="nav-item active" id="nav-upload">
            <span class="nav-icon"><svg lucideUploadCloud size="18"></svg></span> Upload Document
          </a>
        </nav>
        <div class="sidebar-footer">
          <a class="nav-item nav-logout" (click)="logout()">
            <span class="nav-icon"><svg lucideLogOut size="18"></svg></span> Logout
          </a>
        </div>
      </aside>

      <!-- Upload Area -->
      <main class="upload-main">
        <header class="topbar">
          <div>
            <button class="back-btn" (click)="goBack()" id="back-btn">
              ← Back to Dashboard
            </button>
            <h1 class="page-title">Upload Document</h1>
            <p class="page-sub">Submit documents for review through the blockchain-secured approval pipeline</p>
          </div>
        </header>

        <div class="upload-content animate-fade-up">
          <!-- Left: Form -->
          <div class="upload-form-card">
            <div class="card-header-styled">
              <h2 class="card-title" style="display:flex; align-items:center; gap:8px;"><svg lucideFileText size="20"></svg> Document Details</h2>
              <p class="card-sub">All required fields must be filled</p>
            </div>

            <div class="form-body">
              <!-- Title -->
              <div class="form-group">
                <label class="form-label" for="doc-title">Document Title *</label>
                <div class="form-input-wrapper">
                  <span class="form-input-icon" style="display:flex; align-items:center;"><svg lucideFileText size="18"></svg></span>
                  <input
                    id="doc-title"
                    [(ngModel)]="title"
                    placeholder="e.g. Club Budget Proposal 2026"
                    class="form-input with-icon"
                  />
                </div>
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="form-label" for="doc-desc">Description</label>
                <textarea
                  id="doc-desc"
                  [(ngModel)]="description"
                  rows="3"
                  placeholder="Briefly describe the purpose of this document..."
                  class="form-input"
                  style="resize: vertical; min-height: 80px;"
                ></textarea>
              </div>

              <!-- Approval Target -->
              <div class="form-group">
                <label class="form-label">Send for Approval to *</label>
                <p class="field-hint">Choose the appropriate authority based on your request type</p>
                <div class="approval-target-grid">
                  <label
                    *ngFor="let opt of approvalTargets"
                    class="target-option"
                    [class.selected]="selectedDeptId === opt.id"
                  >
                    <input
                      type="radio"
                      [name]="'target'"
                      [value]="opt.id"
                      [(ngModel)]="selectedDeptId"
                      style="display:none"
                      [id]="'target-' + opt.id"
                    />
                    <span class="target-icon">
                      <ng-container [ngSwitch]="opt.iconName">
                        <svg *ngSwitchCase="'monitor'" lucideMonitor size="22"></svg>
                        <svg *ngSwitchCase="'cpu'" lucideCpu size="22"></svg>
                        <svg *ngSwitchCase="'radio'" lucideRadio size="22"></svg>
                        <svg *ngSwitchCase="'settings'" lucideSettings size="22"></svg>
                        <svg *ngSwitchCase="'building'" lucideBuilding size="22"></svg>
                        <svg *ngSwitchCase="'scale'" lucideScale size="22"></svg>
                        <svg *ngSwitchCase="'crown'" lucideCrown size="22"></svg>
                      </ng-container>
                    </span>
                    <span class="target-label">{{ opt.label }}</span>
                    <span class="target-sublabel">{{ opt.sub }}</span>
                  </label>
                </div>
              </div>

              <!-- File Upload Zone -->
              <div class="form-group">
                <label class="form-label">Upload File *</label>
                <div
                  class="drop-zone"
                  [class.has-file]="selectedFile"
                  [class.drag-over]="isDragging"
                  (click)="fileInput.click()"
                  (dragover)="onDragOver($event)"
                  (dragleave)="isDragging = false"
                  (drop)="onDrop($event)"
                  id="drop-zone"
                >
                  <input
                    #fileInput
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    (change)="onFileSelect($event)"
                    style="display:none"
                    id="file-input"
                  />

                  <div *ngIf="!selectedFile" class="drop-placeholder">
                    <div class="drop-icon" style="display:flex; justify-content:center;"><svg lucideCloud size="40"></svg></div>
                    <p class="drop-title">Click to browse or drag & drop</p>
                    <p class="drop-sub">Supports <strong>PDF</strong> and <strong>DOCX</strong> files only</p>
                  </div>

                  <div *ngIf="selectedFile" class="file-preview">
                    <span class="file-type-badge">{{ fileExtension.toUpperCase() }}</span>
                    <div class="file-details">
                      <span class="file-name">{{ fileName }}</span>
                      <span class="file-size">{{ fileSizeLabel }}</span>
                    </div>
                    <button class="remove-file" (click)="removeFile($event)" id="remove-file">✕</button>
                  </div>
                </div>
                <p *ngIf="fileError" class="field-error">⚠ {{ fileError }}</p>
              </div>

              <!-- Progress Bar -->
              <div *ngIf="uploading" class="progress-section">
                <div class="progress-header">
                  <span class="progress-label">{{ progressLabel }}</span>
                  <span class="progress-pct">{{ progress }}%</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width]="progress + '%'"></div>
                </div>
              </div>

              <!-- Feedback -->
              <div *ngIf="success" class="alert alert-success animate-fade-in" style="display:flex; gap:12px; align-items:flex-start;">
                <svg lucideCheckCircle size="24"></svg>
                <div>
                  <strong>Document submitted successfully!</strong>
                  <p *ngIf="blockchainHash" style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">
                    🔗 Blockchain Hash: <code>{{blockchainHash}}</code>
                  </p>
                </div>
              </div>
              <div *ngIf="error" class="alert alert-error animate-fade-in" style="display:flex; gap:8px; align-items:center;">
                <svg lucideAlertTriangle size="20"></svg> {{error}}
              </div>

              <!-- Submit -->
              <button
                id="submit-upload"
                class="btn btn-primary btn-full btn-lg"
                (click)="upload()"
                [disabled]="uploading"
                style="margin-top: 8px;"
              >
                <span *ngIf="!uploading" style="display:flex; align-items:center; gap:8px; justify-content:center;"><svg lucideSend size="18"></svg> Submit for Approval</span>
                <span *ngIf="uploading" class="loading-spinner"></span>
                <span *ngIf="uploading">Processing...</span>
              </button>
            </div>
          </div>

          <!-- Right: Info Panel -->
          <div class="upload-info-panel">
            <!-- Pipeline Steps -->
            <div class="info-card">
              <h3 class="info-title" style="display:flex; align-items:center; gap:8px;"><svg lucideLink size="18"></svg> Approval Pipeline</h3>
              <div class="pipeline-steps">
                <div class="pipeline-step done">
                  <div class="step-dot done"></div>
                  <div class="step-content">
                    <span class="step-label">You upload</span>
                    <span class="step-desc">Document is SHA-256 hashed</span>
                  </div>
                </div>
                <div class="step-line"></div>
                <div class="pipeline-step">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <span class="step-label">Authority reviews</span>
                    <span class="step-desc">HOD / VP / Principal</span>
                  </div>
                </div>
                <div class="step-line"></div>
                <div class="pipeline-step">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <span class="step-label">Signed on-chain</span>
                    <span class="step-desc">Immutable blockchain record</span>
                  </div>
                </div>
                <div class="step-line"></div>
                <div class="pipeline-step">
                  <div class="step-dot"></div>
                  <div class="step-content">
                    <span class="step-label">You're notified</span>
                    <span class="step-desc">Full audit trail available</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tips Card -->
            <div class="info-card">
              <h3 class="info-title" style="display:flex; align-items:center; gap:8px;"><svg lucideLightbulb size="18"></svg> Tips</h3>
              <ul class="tips-list">
                <li>Upload only <strong>PDF</strong> or <strong>DOCX</strong> files</li>
                <li>Ensure the document is <strong>complete and signed</strong> by relevant staff before uploading</li>
                <li>Choose the <strong>most relevant authority</strong> — unnecessary escalation causes delays</li>
                <li>Once submitted, the hash is <strong>permanently recorded</strong> on the blockchain</li>
              </ul>
            </div>

            <!-- Security Badge -->
            <div class="security-card">
              <div class="security-icon"><svg lucideShieldCheck size="28"></svg></div>
              <div>
                <h4>End-to-end Secured</h4>
                <p>Files are encrypted in transit and hash-verified on-chain</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .upload-page { display: flex; min-height: 100vh; background: var(--bg-base); font-family: var(--font-body); }

    .mini-sidebar { width: 220px; background: var(--bg-surface); border-right: 1px solid var(--border-subtle); display: flex; flex-direction: column; padding: 24px 0; flex-shrink: 0; position: sticky; top: 0; height: 100vh; }
    .sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 0 20px 24px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 20px; }
    .logo-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.25); display: flex; align-items: center; justify-content: center; }
    .sidebar-brand-name { font-family: var(--font-display); font-size: 18px; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 12px; flex: 1; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-md); color: var(--text-secondary); font-size: 14px; font-weight: 500; cursor: pointer; transition: all var(--transition-fast); }
    .nav-item:hover { background: rgba(255,255,255,0.04); color: var(--text-primary); }
    .nav-item.active { background: rgba(108,99,255,0.12); color: var(--primary-light); border: 1px solid rgba(108,99,255,0.2); }
    .nav-icon { font-size: 16px; width: 20px; text-align: center; }
    .sidebar-footer { padding: 16px 12px 0; border-top: 1px solid var(--border-subtle); }
    .nav-logout { color: var(--danger); }
    .nav-logout:hover { background: rgba(239,68,68,0.08); color: var(--danger); }

    .upload-main { flex: 1; padding: 32px; display: flex; flex-direction: column; gap: 24px; overflow-y: auto; min-width: 0; }

    .back-btn { background: none; border: 1px solid var(--border-normal); color: var(--text-secondary); padding: 7px 14px; border-radius: var(--radius-md); font-size: 13px; cursor: pointer; margin-bottom: 12px; transition: all var(--transition-fast); }
    .back-btn:hover { border-color: var(--border-focus); color: var(--text-primary); }

    .page-title { font-size: 28px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .page-sub { font-size: 14px; color: var(--text-secondary); margin: 4px 0 0; }

    .upload-content { display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }

    /* Form Card */
    .upload-form-card { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); overflow: hidden; }
    .card-header-styled { padding: 20px 24px; border-bottom: 1px solid var(--border-subtle); }
    .card-title { font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0; }
    .card-sub { font-size: 13px; color: var(--text-muted); margin: 4px 0 0; }
    .form-body { padding: 24px; display: flex; flex-direction: column; gap: 0; }

    .field-hint { font-size: 12px; color: var(--text-muted); margin: 0 0 10px; }
    .field-error { font-size: 12px; color: var(--danger); margin-top: 6px; }

    /* Approval target grid */
    .approval-target-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }

    .target-option {
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      padding: 12px 8px; border: 1px solid var(--border-normal);
      border-radius: var(--radius-md); cursor: pointer; text-align: center;
      background: var(--bg-input); transition: all var(--transition-base);
    }
    .target-option:hover { border-color: var(--border-focus); background: rgba(108,99,255,0.06); }
    .target-option.selected { border-color: rgba(108,99,255,0.6); background: rgba(108,99,255,0.12); box-shadow: 0 0 0 2px rgba(108,99,255,0.15); }
    .target-icon { font-size: 22px; }
    .target-label { font-size: 12px; font-weight: 600; color: var(--text-primary); line-height: 1.2; }
    .target-sublabel { font-size: 10px; color: var(--text-muted); }
    .target-option.selected .target-label { color: var(--primary-light); }

    /* Drop Zone */
    .drop-zone {
      border: 2px dashed var(--border-normal);
      border-radius: var(--radius-lg);
      padding: 40px 24px;
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-base);
      background: var(--bg-input);
      position: relative;
    }
    .drop-zone:hover, .drop-zone.drag-over { border-color: var(--primary); background: rgba(108,99,255,0.06); }
    .drop-zone.has-file { border-color: var(--success); background: rgba(34,197,94,0.04); border-style: solid; }

    .drop-placeholder { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .drop-icon { font-size: 40px; opacity: 0.5; }
    .drop-title { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0; }
    .drop-sub { font-size: 12px; color: var(--text-muted); margin: 0; }

    .file-preview { display: flex; align-items: center; gap: 14px; text-align: left; }
    .file-type-badge { background: var(--gradient-primary); color: white; padding: 6px 10px; border-radius: var(--radius-sm); font-size: 11px; font-weight: 700; letter-spacing: 0.05em; flex-shrink: 0; }
    .file-details { flex: 1; min-width: 0; }
    .file-name { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .file-size { display: block; font-size: 12px; color: var(--text-muted); }
    .remove-file { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: var(--danger); width: 28px; height: 28px; border-radius: 50%; cursor: pointer; font-size: 12px; flex-shrink: 0; transition: all var(--transition-fast); }
    .remove-file:hover { background: rgba(239,68,68,0.2); }

    /* Progress */
    .progress-section { margin-bottom: 16px; }
    .progress-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .progress-label { font-size: 13px; color: var(--text-secondary); }
    .progress-pct { font-size: 13px; font-weight: 600; color: var(--primary-light); }
    .progress-track { background: var(--bg-input); border-radius: var(--radius-full); height: 6px; overflow: hidden; }
    .progress-fill { height: 100%; border-radius: var(--radius-full); background: var(--gradient-primary); transition: width 0.4s ease; }

    .loading-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

    /* Info Panel */
    .upload-info-panel { display: flex; flex-direction: column; gap: 16px; }
    .info-card { background: var(--bg-card); border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); padding: 20px; }
    .info-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 0 0 16px; }

    .pipeline-steps { display: flex; flex-direction: column; }
    .pipeline-step { display: flex; gap: 12px; align-items: flex-start; }
    .step-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--border-normal); background: var(--bg-base); flex-shrink: 0; margin-top: 4px; transition: all var(--transition-base); }
    .step-dot.done { background: var(--primary); border-color: var(--primary); box-shadow: 0 0 8px rgba(108,99,255,0.5); }
    .step-line { width: 2px; height: 20px; background: var(--border-subtle); margin-left: 4px; }
    .step-content { display: flex; flex-direction: column; gap: 2px; padding-bottom: 8px; }
    .step-label { font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .step-desc { font-size: 11px; color: var(--text-muted); }

    .tips-list { list-style: none; display: flex; flex-direction: column; gap: 10px; }
    .tips-list li { font-size: 13px; color: var(--text-secondary); padding-left: 16px; position: relative; line-height: 1.5; }
    .tips-list li::before { content: '→'; position: absolute; left: 0; color: var(--primary-light); }

    .security-card { display: flex; align-items: center; gap: 14px; background: linear-gradient(135deg, rgba(108,99,255,0.08), rgba(155,93,229,0.05)); border: 1px solid rgba(108,99,255,0.2); border-radius: var(--radius-lg); padding: 16px; }
    .security-icon { font-size: 28px; flex-shrink: 0; }
    .security-card h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; }
    .security-card p { font-size: 12px; color: var(--text-secondary); margin: 0; line-height: 1.4; }

    @media (max-width: 1024px) { .upload-content { grid-template-columns: 1fr; } .upload-info-panel { display: none; } }
    @media (max-width: 768px) { .mini-sidebar { display: none; } .upload-main { padding: 16px; } .approval-target-grid { grid-template-columns: 1fr 1fr; } }
  `]
})
export class DocumentUploadComponent {
  title = '';
  description = '';
  selectedDeptId = 1;
  fileName = '';
  fileExtension = '';
  fileSizeLabel = '';
  selectedFile: File | null = null;
  isDragging = false;
  fileError = '';

  uploading = false;
  progress = 0;
  progressLabel = 'Uploading...';
  success = false;
  error = '';
  blockchainHash = '';

  approvalTargets = [
    { id: 1, iconName: 'monitor', label: 'CSE HOD', sub: 'Computer Science' },
    { id: 2, iconName: 'cpu', label: 'ISE HOD', sub: 'Info. Science' },
    { id: 3, iconName: 'radio', label: 'ECE HOD', sub: 'Electronics' },
    { id: 4, iconName: 'settings', label: 'ME HOD', sub: 'Mechanical' },
    { id: 5, iconName: 'building', label: 'Civil HOD', sub: 'Civil Engg.' },
    { id: 6, iconName: 'scale', label: 'Vice Principal', sub: 'Administration' },
    { id: 7, iconName: 'crown', label: 'Principal', sub: 'Final Authority' },
  ];

  constructor(private router: Router, private http: HttpClient, private cdr: ChangeDetectorRef) {}

  onFileSelect(event: any) {
    this.fileError = '';
    const file = event.target.files[0];
    if (file) { this.processFile(file); }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) { this.processFile(file); }
  }

  processFile(file: File) {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (ext !== 'pdf' && ext !== 'docx') {
      this.fileError = 'Invalid format. Only PDF and DOCX files are allowed.';
      this.selectedFile = null;
      this.fileName = '';
      return;
    }
    this.fileError = '';
    this.selectedFile = file;
    this.fileName = file.name;
    this.fileExtension = ext;
    const kb = file.size / 1024;
    this.fileSizeLabel = kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb.toFixed(0) + ' KB';
  }

  removeFile(event: Event) {
    event.stopPropagation();
    this.selectedFile = null;
    this.fileName = '';
    this.fileExtension = '';
    this.fileSizeLabel = '';
    this.fileError = '';
  }

  upload() {
    this.success = false;
    this.error = '';
    this.fileError = '';

    if (!this.title.trim()) { this.error = 'Please fill in the Document Title.'; return; }
    if (!this.selectedFile) { this.fileError = 'Please select a PDF or DOCX file.'; return; }

    this.uploading = true;
    this.progress = 0;
    this.progressLabel = 'Uploading file...';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('deptId', this.selectedDeptId.toString());

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + token });

    this.http.post<any>('http://localhost:8080/api/documents/upload', formData, {
      headers,
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((100 * event.loaded) / event.total);
          if (this.progress >= 80) { this.progressLabel = 'Hashing & recording to blockchain...'; }
          this.cdr.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          this.progress = 100;
          this.uploading = false;
          this.success = true;
          this.blockchainHash = event.body?.fileHashSha256 || '';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.uploading = false;
        this.error = err?.error?.message || err?.message || 'Failed to submit document. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  goBack() { this.router.navigate(['/student-dashboard']); }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}
