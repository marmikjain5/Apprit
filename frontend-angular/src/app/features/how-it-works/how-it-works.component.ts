import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideFileText, LucideUploadCloud, LucidePin, LucideLink, LucideCheckCircle, LucideMonitor, LucideCoffee, LucideGraduationCap, LucideLandmark, LucideCrown, LucideLock, LucideSearch, LucideGlobe, LucideShield } from '@lucide/angular';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, LucideFileText, LucideUploadCloud, LucidePin, LucideLink, LucideCheckCircle, LucideMonitor, LucideCoffee, LucideGraduationCap, LucideLandmark, LucideCrown, LucideLock, LucideSearch, LucideGlobe, LucideShield],
  template: `
    <div class="hiw-page">
      <!-- Animated background -->
      <div class="auth-bg">
        <div class="mesh-blob blob-1"></div>
        <div class="mesh-blob blob-2"></div>
        <div class="mesh-blob blob-3"></div>
      </div>

      <!-- Navbar -->
      <nav class="hiw-nav">
        <div class="nav-brand" (click)="goHome()" id="nav-logo">
          <div class="logo-icon">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L28 8V16C28 22.627 22.627 28 16 30C9.373 28 4 22.627 4 16V8L16 2Z" fill="url(#ng1)"/>
              <path d="M11 16l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <defs><linearGradient id="ng1" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse"><stop stop-color="#6C63FF"/><stop offset="1" stop-color="#9B5DE5"/></linearGradient></defs>
            </svg>
          </div>
          <span class="nav-brand-name">Apprit</span>
        </div>
        <div class="nav-links" *ngIf="!isLoggedIn">
          <button class="nav-link" id="nav-login" (click)="goLogin()">Login</button>
          <button class="nav-cta" id="nav-register" (click)="goRegister()">Get Started →</button>
        </div>
        <div class="nav-links" *ngIf="isLoggedIn">
          <button class="nav-cta" id="nav-dashboard" (click)="goDashboard()">Go to Dashboard →</button>
        </div>
      </nav>

      <!-- Hero -->
      <section class="hiw-hero animate-fade-up">
        <div class="hero-tag">How It Works</div>
        <h1 class="hero-title">Document Approvals —<br><span class="gradient-text">Transparent & Tamper-proof</span></h1>
        <p class="hero-sub">
          Apprit is BMSIT's blockchain-secured document approval system. Every document you submit
          is cryptographically hashed, stored on IPFS, and its approval trail is permanently recorded
          on-chain — no paperwork, no lost signatures, no ambiguity.
        </p>
      </section>

      <!-- Flow Steps -->
      <section class="hiw-steps animate-fade-up">
        <div class="steps-connector"></div>
        <div class="step-card" *ngFor="let step of steps; let i = index" [id]="'step-' + (i+1)">
          <div class="step-number" [style.background]="step.color">{{ i + 1 }}</div>
          <div class="step-icon">
            <ng-container [ngSwitch]="step.iconName">
              <svg *ngSwitchCase="'file-text'" lucideFileText size="32"></svg>
              <svg *ngSwitchCase="'upload-cloud'" lucideUploadCloud size="32"></svg>
              <svg *ngSwitchCase="'pin'" lucidePin size="32"></svg>
              <svg *ngSwitchCase="'link'" lucideLink size="32"></svg>
              <svg *ngSwitchCase="'check-circle'" lucideCheckCircle size="32"></svg>
            </ng-container>
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
          <div class="step-tech" *ngIf="step.tech">
            <span class="tech-badge" *ngFor="let t of step.tech">{{ t }}</span>
          </div>
        </div>
      </section>

      <!-- Architecture Diagram -->
      <section class="hiw-arch animate-fade-up">
        <h2 class="section-heading">System Architecture</h2>
        <p class="section-sub-text">Three services working together to ensure integrity at every step</p>
        <div class="arch-grid">
          <div class="arch-box" id="arch-frontend">
            <div class="arch-icon"><svg lucideMonitor size="28"></svg></div>
            <h4>Angular Frontend</h4>
            <p>Port 4200</p>
            <ul>
              <li>Student & Authority portals</li>
              <li>Document upload UI</li>
              <li>Approval tracking</li>
            </ul>
          </div>
          <div class="arch-arrow">→</div>
          <div class="arch-box highlight" id="arch-backend">
            <div class="arch-icon"><svg lucideCoffee size="28"></svg></div>
            <h4>Spring Boot Backend</h4>
            <p>Port 8080</p>
            <ul>
              <li>JWT authentication</li>
              <li>Oracle DB (users)</li>
              <li>MongoDB (documents)</li>
              <li>Pinata IPFS upload</li>
            </ul>
          </div>
          <div class="arch-arrow">→</div>
          <div class="arch-box" id="arch-blockchain">
            <div class="arch-icon"><svg lucideLink size="28"></svg></div>
            <h4>Blockchain Service</h4>
            <p>Port 8000 (FastAPI)</p>
            <ul>
              <li>SHA-256 hashing</li>
              <li>Smart contract calls</li>
              <li>On-chain approval records</li>
              <li>Ethereum / Polygon</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Role Cards -->
      <section class="hiw-roles animate-fade-up">
        <h2 class="section-heading">Who Uses Apprit?</h2>
        <p class="section-sub-text">Different roles, different powers — all on the same transparent platform</p>
        <div class="roles-grid">
          <div class="role-card" *ngFor="let r of roles" [id]="'role-' + r.key">
            <div class="role-icon-lg">
              <ng-container [ngSwitch]="r.iconName">
                <svg *ngSwitchCase="'graduation-cap'" lucideGraduationCap size="36"></svg>
                <svg *ngSwitchCase="'landmark'" lucideLandmark size="36"></svg>
                <svg *ngSwitchCase="'crown'" lucideCrown size="36"></svg>
              </ng-container>
            </div>
            <h3>{{ r.title }}</h3>
            <p>{{ r.desc }}</p>
            <ul class="role-powers">
              <li *ngFor="let p of r.powers">{{ p }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Blockchain Deep Dive -->
      <section class="hiw-blockchain animate-fade-up">
        <div class="blockchain-explain-grid">
          <div class="blockchain-text">
            <h2 class="section-heading" style="text-align:left; margin-bottom: 16px;">Why Blockchain?</h2>
            <div class="explain-item" *ngFor="let item of blockchainPoints" [id]="'bc-point-' + item.key">
              <div class="explain-icon">
                <ng-container [ngSwitch]="item.iconName">
                  <svg *ngSwitchCase="'lock'" lucideLock size="24"></svg>
                  <svg *ngSwitchCase="'search'" lucideSearch size="24"></svg>
                  <svg *ngSwitchCase="'globe'" lucideGlobe size="24"></svg>
                  <svg *ngSwitchCase="'shield'" lucideShield size="24"></svg>
                </ng-container>
              </div>
              <div>
                <h4>{{ item.title }}</h4>
                <p>{{ item.desc }}</p>
              </div>
            </div>
          </div>
          <div class="blockchain-visual">
            <div class="chain-block" *ngFor="let b of chainBlocks; let i = index" [id]="'chain-block-' + i">
              <div class="chain-block-header">
                <span class="chain-block-num">Block #{{ b.num }}</span>
                <span class="chain-block-status" [class.approved]="b.action === 'APPROVED'" [class.rejected]="b.action === 'REJECTED'">{{ b.action }}</span>
              </div>
              <div class="chain-block-hash">{{ b.hash }}</div>
              <div class="chain-block-meta">{{ b.meta }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Pinata & IPFS Explainer -->
      <section class="hiw-ipfs animate-fade-up">
        <div class="ipfs-card" id="ipfs-explainer">
          <div class="ipfs-icon"><svg lucidePin size="48"></svg></div>
          <div class="ipfs-content">
            <h3>File Storage: Pinata + IPFS</h3>
            <p>
              Uploaded files are <strong>not stored on a server</strong>. They are pinned to the
              <strong>InterPlanetary File System (IPFS)</strong> via <strong>Pinata</strong> — a
              decentralized storage network. Each file gets a unique <code>CID</code>
              (Content Identifier). This CID is what gets recorded on the blockchain.
            </p>
            <div class="ipfs-flow">
              <span class="ipfs-step">You upload PDF</span>
              <span class="ipfs-arrow">→</span>
              <span class="ipfs-step">Pinata pins to IPFS</span>
              <span class="ipfs-arrow">→</span>
              <span class="ipfs-step">CID returned</span>
              <span class="ipfs-arrow">→</span>
              <span class="ipfs-step">CID stored on-chain</span>
            </div>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section class="hiw-faq animate-fade-up">
        <h2 class="section-heading">Frequently Asked Questions</h2>
        <div class="faq-list">
          <div class="faq-item" *ngFor="let faq of faqs; let i = index" [id]="'faq-' + (i+1)">
            <button class="faq-question" (click)="toggleFaq(i)" [class.open]="openFaq === i">
              <span>{{ faq.q }}</span>
              <span class="faq-chevron">{{ openFaq === i ? '▲' : '▼' }}</span>
            </button>
            <div class="faq-answer" [class.visible]="openFaq === i">{{ faq.a }}</div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="hiw-cta animate-fade-up">
        <h2>Ready to get started?</h2>
        <p>Create your BMSIT account and submit your first document today.</p>
        <div class="cta-btns" *ngIf="!isLoggedIn">
          <button class="btn btn-primary btn-lg" id="cta-register" (click)="goRegister()">Create Account →</button>
          <button class="btn btn-secondary btn-lg" id="cta-login" (click)="goLogin()">Sign In</button>
        </div>
        <div class="cta-btns" *ngIf="isLoggedIn">
          <button class="btn btn-primary btn-lg" (click)="goDashboard()">Go to Dashboard →</button>
        </div>
      </section>

      <!-- Footer -->
      <footer class="hiw-footer">
        <p>© 2026 Apprit — BMSIT&ET Document Approval System. Built with Angular, Spring Boot & Blockchain.</p>
      </footer>
    </div>
  `,
  styles: [`
    .hiw-page {
      min-height: 100vh;
      background: var(--bg-base);
      color: var(--text-primary);
      font-family: var(--font-body);
      position: relative;
      overflow-x: hidden;
    }

    .auth-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .mesh-blob { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; }
    .blob-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(108,99,255,0.2), transparent 70%); top: -200px; left: -200px; animation: float 10s ease-in-out infinite; }
    .blob-2 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(255,101,132,0.1), transparent 70%); bottom: 10%; right: -100px; animation: float 12s ease-in-out infinite reverse; }
    .blob-3 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(56,189,248,0.08), transparent 70%); top: 50%; left: 40%; animation: float 14s ease-in-out infinite 3s; }

    /* Nav */
    .hiw-nav {
      position: sticky; top: 0; z-index: 100;
      display: flex; justify-content: space-between; align-items: center;
      padding: 16px 48px;
      background: rgba(11, 13, 23, 0.85);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
    }
    .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .logo-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(108,99,255,0.15); border: 1px solid rgba(108,99,255,0.3); display: flex; align-items: center; justify-content: center; }
    .nav-brand-name { font-family: var(--font-display); font-size: 20px; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .nav-links { display: flex; align-items: center; gap: 12px; }
    .nav-link { background: none; border: 1px solid var(--border-normal); color: var(--text-secondary); padding: 8px 18px; border-radius: var(--radius-md); font-size: 14px; cursor: pointer; transition: all var(--transition-fast); }
    .nav-link:hover { color: var(--text-primary); border-color: var(--border-focus); }
    .nav-cta { background: var(--gradient-primary); color: white; border: none; padding: 9px 20px; border-radius: var(--radius-md); font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 16px rgba(108,99,255,0.35); transition: all var(--transition-base); }
    .nav-cta:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(108,99,255,0.5); }

    /* Sections */
    .hiw-hero, .hiw-steps, .hiw-arch, .hiw-roles, .hiw-blockchain, .hiw-ipfs, .hiw-faq, .hiw-cta {
      position: relative; z-index: 1;
      max-width: 1100px; margin: 0 auto;
      padding: 64px 48px;
    }

    /* Hero */
    .hero-tag { display: inline-block; background: rgba(108,99,255,0.12); border: 1px solid rgba(108,99,255,0.3); color: var(--primary-light); padding: 6px 16px; border-radius: var(--radius-full); font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 24px; }
    .hero-title { font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1.15; margin-bottom: 20px; font-family: var(--font-display); }
    .hero-sub { font-size: 17px; color: var(--text-secondary); max-width: 680px; line-height: 1.8; }
    .gradient-text { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* Steps */
    .hiw-steps { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; position: relative; padding: 48px; }
    .step-card { flex: 1 1 200px; max-width: 240px; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px 16px; text-align: center; transition: all var(--transition-base); position: relative; }
    .step-card:hover { border-color: var(--border-normal); transform: translateY(-4px); box-shadow: var(--shadow-md); }
    .step-number { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; color: white; margin: 0 auto 12px; }
    .step-icon { font-size: 32px; margin-bottom: 12px; }
    .step-title { font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 8px; }
    .step-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 12px; }
    .step-tech { display: flex; flex-wrap: wrap; gap: 4px; justify-content: center; }
    .tech-badge { font-size: 10px; padding: 2px 8px; background: rgba(108,99,255,0.12); color: var(--primary-light); border: 1px solid rgba(108,99,255,0.2); border-radius: var(--radius-full); }

    /* Section headings */
    .section-heading { font-size: 32px; font-weight: 800; text-align: center; margin-bottom: 8px; font-family: var(--font-display); }
    .section-sub-text { font-size: 15px; color: var(--text-secondary); text-align: center; margin-bottom: 40px; }

    /* Arch */
    .arch-grid { display: flex; align-items: center; gap: 16px; justify-content: center; flex-wrap: wrap; }
    .arch-box { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 24px; width: 240px; transition: all var(--transition-base); }
    .arch-box.highlight { border-color: rgba(108,99,255,0.4); background: rgba(108,99,255,0.06); box-shadow: 0 0 32px rgba(108,99,255,0.12); }
    .arch-box:hover { border-color: var(--border-normal); transform: translateY(-2px); }
    .arch-icon { font-size: 28px; margin-bottom: 10px; }
    .arch-box h4 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
    .arch-box p { font-size: 12px; color: var(--primary-light); margin-bottom: 12px; font-family: monospace; }
    .arch-box ul { list-style: none; display: flex; flex-direction: column; gap: 6px; }
    .arch-box ul li { font-size: 12px; color: var(--text-secondary); padding-left: 14px; position: relative; }
    .arch-box ul li::before { content: '✓'; position: absolute; left: 0; color: var(--success); font-size: 10px; }
    .arch-arrow { font-size: 24px; color: var(--primary-light); flex-shrink: 0; }

    /* Roles */
    .roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .role-card { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 28px 24px; transition: all var(--transition-base); }
    .role-card:hover { border-color: rgba(108,99,255,0.3); transform: translateY(-3px); box-shadow: var(--shadow-md); }
    .role-icon-lg { font-size: 36px; margin-bottom: 14px; }
    .role-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 8px; color: var(--text-primary); }
    .role-card p { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; line-height: 1.6; }
    .role-powers { list-style: none; display: flex; flex-direction: column; gap: 6px; }
    .role-powers li { font-size: 12px; color: var(--text-secondary); padding-left: 16px; position: relative; }
    .role-powers li::before { content: '→'; position: absolute; left: 0; color: var(--primary-light); }

    /* Blockchain */
    .blockchain-explain-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
    .explain-item { display: flex; gap: 16px; align-items: flex-start; margin-bottom: 24px; }
    .explain-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
    .explain-item h4 { font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px; }
    .explain-item p { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
    .blockchain-visual { display: flex; flex-direction: column; gap: 0; }
    .chain-block { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 16px; position: relative; }
    .chain-block:not(:last-child)::after { content: '↓'; position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%); font-size: 14px; color: var(--primary-light); z-index: 1; }
    .chain-block:not(:last-child) { margin-bottom: 20px; }
    .chain-block-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .chain-block-num { font-size: 11px; font-weight: 700; color: var(--primary-light); text-transform: uppercase; letter-spacing: 0.06em; }
    .chain-block-status { font-size: 10px; padding: 2px 10px; border-radius: var(--radius-full); font-weight: 700; }
    .chain-block-status.approved { background: rgba(34,197,94,0.15); color: var(--success); border: 1px solid rgba(34,197,94,0.3); }
    .chain-block-status.rejected { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.3); }
    .chain-block-hash { font-size: 11px; color: var(--success); font-family: monospace; margin-bottom: 6px; }
    .chain-block-meta { font-size: 11px; color: var(--text-muted); }

    /* IPFS */
    .ipfs-card { background: linear-gradient(135deg, rgba(108,99,255,0.08), rgba(155,93,229,0.05)); border: 1px solid rgba(108,99,255,0.2); border-radius: var(--radius-xl); padding: 36px; display: flex; gap: 28px; align-items: flex-start; }
    .ipfs-icon { font-size: 48px; flex-shrink: 0; }
    .ipfs-content h3 { font-size: 22px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px; }
    .ipfs-content p { font-size: 14px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 20px; }
    .ipfs-content code { background: rgba(108,99,255,0.15); color: var(--primary-light); padding: 2px 6px; border-radius: 4px; font-size: 13px; }
    .ipfs-flow { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .ipfs-step { background: var(--bg-card); border: 1px solid var(--border-normal); padding: 7px 14px; border-radius: var(--radius-md); font-size: 12px; font-weight: 600; color: var(--text-primary); }
    .ipfs-arrow { color: var(--primary-light); font-size: 16px; font-weight: 700; }

    /* FAQ */
    .faq-list { display: flex; flex-direction: column; gap: 8px; max-width: 800px; margin: 0 auto; }
    .faq-item { background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); overflow: hidden; transition: border-color var(--transition-fast); }
    .faq-item:hover { border-color: var(--border-normal); }
    .faq-question { width: 100%; background: none; border: none; padding: 18px 20px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-size: 14px; font-weight: 600; color: var(--text-primary); text-align: left; gap: 12px; transition: color var(--transition-fast); }
    .faq-question.open { color: var(--primary-light); }
    .faq-chevron { color: var(--text-muted); font-size: 10px; flex-shrink: 0; }
    .faq-answer { max-height: 0; overflow: hidden; font-size: 14px; color: var(--text-secondary); line-height: 1.7; padding: 0 20px; transition: max-height 0.3s ease, padding 0.3s ease; }
    .faq-answer.visible { max-height: 200px; padding: 0 20px 18px; }

    /* CTA */
    .hiw-cta { text-align: center; padding: 80px 48px; }
    .hiw-cta h2 { font-size: 36px; font-weight: 800; margin-bottom: 12px; font-family: var(--font-display); }
    .hiw-cta p { font-size: 16px; color: var(--text-secondary); margin-bottom: 32px; }
    .cta-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }

    /* Footer */
    .hiw-footer { text-align: center; padding: 24px 48px; border-top: 1px solid var(--border-subtle); font-size: 13px; color: var(--text-muted); position: relative; z-index: 1; }

    @media (max-width: 900px) {
      .hiw-steps { grid-template-columns: repeat(2, 1fr); }
      .roles-grid { grid-template-columns: 1fr 1fr; }
      .blockchain-explain-grid { grid-template-columns: 1fr; }
      .arch-grid { flex-direction: column; }
      .arch-arrow { transform: rotate(90deg); }
    }
    @media (max-width: 600px) {
      .hiw-hero, .hiw-steps, .hiw-arch, .hiw-roles, .hiw-blockchain, .hiw-ipfs, .hiw-faq, .hiw-cta { padding: 40px 20px; }
      .hiw-nav { padding: 14px 20px; }
      .hiw-steps { grid-template-columns: 1fr; }
      .roles-grid { grid-template-columns: 1fr; }
      .ipfs-card { flex-direction: column; }
    }
  `]
})
export class HowItWorksComponent implements OnInit {
  openFaq: number | null = null;
  isLoggedIn = false;

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  goDashboard() {
    const role = localStorage.getItem('role') || '';
    if (role === 'ROLE_STUDENT' || role === 'ROLE_CLUB') {
      this.router.navigate(['/student-dashboard']);
    } else {
      this.router.navigate(['/authority-dashboard']);
    }
  }

  steps = [
    { iconName: 'file-text', title: 'Register & Login', desc: 'Create your BMSIT account using your @bmsit.in email. Choose your role — student, faculty, HOD, or administration.', tech: ['Angular', 'JWT', 'Oracle DB'], color: 'linear-gradient(135deg,#6C63FF,#9B5DE5)' },
    { iconName: 'upload-cloud', title: 'Upload Document', desc: 'Submit your PDF or DOCX document and select the appropriate approval authority. The file is immediately hashed.', tech: ['Spring Boot', 'SHA-256'], color: 'linear-gradient(135deg,#38BDF8,#6C63FF)' },
    { iconName: 'pin', title: 'Stored on IPFS', desc: 'The file is pinned to IPFS via Pinata. A unique Content ID (CID) is returned — your document is now decentralized.', tech: ['Pinata', 'IPFS'], color: 'linear-gradient(135deg,#F59E0B,#EF4444)' },
    { iconName: 'link', title: 'Recorded On-Chain', desc: 'The document CID and hash are written to a smart contract on Ethereum/Polygon. This record is immutable forever.', tech: ['Solidity', 'Web3.py', 'Polygon'], color: 'linear-gradient(135deg,#22C55E,#38BDF8)' },
    { iconName: 'check-circle', title: 'Approved & Notified', desc: 'The authority reviews and approves or rejects. Their signature is recorded on-chain. You receive instant status updates.', tech: ['MongoDB', 'Smart Contract'], color: 'linear-gradient(135deg,#FF6584,#F59E0B)' },
  ];

  roles = [
    { key: 'student', iconName: 'graduation-cap', title: 'Student', desc: 'Submit documents for institutional approval — budget proposals, event permissions, reimbursement forms and more.', powers: ['Upload PDF / DOCX documents', 'Choose approval authority', 'Track real-time status', 'View blockchain hash of each document'] },
    { key: 'authority', iconName: 'landmark', title: 'HOD / Faculty', desc: 'Department-level authority who reviews documents submitted by students in their domain and can approve or reject them.', powers: ['View pending documents in queue', 'Add review comments', 'Approve or reject with on-chain signature', 'See full audit history'] },
    { key: 'admin', iconName: 'crown', title: 'Principal / Vice Principal', desc: 'Final-tier approval authority for escalated documents requiring top-level sign-off before processing.', powers: ['All HOD powers', 'Final approval authority', 'Institution-wide document view', 'Blockchain audit trail access'] },
  ];

  blockchainPoints = [
    { key: 'immutable', iconName: 'lock', title: 'Immutable Records', desc: 'Once an approval is recorded on-chain, it cannot be altered, deleted, or disputed by anyone.' },
    { key: 'transparent', iconName: 'search', title: 'Full Transparency', desc: 'Every approval, rejection, and timestamp is publicly verifiable on the blockchain — no black boxes.' },
    { key: 'decentralized', iconName: 'globe', title: 'Decentralized Storage', desc: 'Files live on IPFS, not a single server. Even if our servers go down, documents remain accessible forever.' },
    { key: 'tamperproof', iconName: 'shield', title: 'Tamper-proof Audit Trail', desc: 'The SHA-256 hash ensures the document you submitted is identical to what was approved — byte for byte.' },
  ];

  chainBlocks = [
    { num: '1042', action: 'APPROVED', hash: 'ipfs://QmX7...a3f', meta: 'HOD CSE · 2026-05-20 14:32' },
    { num: '1041', action: 'APPROVED', hash: 'ipfs://QmB2...c9d', meta: 'Faculty · 2026-05-19 10:15' },
    { num: '1040', action: 'REJECTED', hash: 'ipfs://QmK9...e7b', meta: 'Principal · 2026-05-18 09:04' },
  ];

  faqs = [
    { q: 'Who can register on Apprit?', a: 'Only BMSIT students and staff with a valid @bmsit.in email address can register. This ensures all users belong to the institution.' },
    { q: 'What file types can I upload?', a: 'Currently only PDF and DOCX files are accepted, with a maximum size of 10MB per file.' },
    { q: 'What happens after I submit a document?', a: 'Your document is hashed, stored on IPFS via Pinata, and the hash is recorded on-chain. The assigned authority is notified and can review, comment, and approve or reject it.' },
    { q: 'Can an approval be reversed?', a: 'No. Once an approval or rejection is recorded on the blockchain, it is immutable. This is the core guarantee of the system. Only a new submission can override a rejection.' },
    { q: 'Is my document content publicly visible?', a: 'The document hash and approval status are public on-chain. The actual file on IPFS is accessible via its CID — however, without the CID, the file cannot be discovered.' },
    { q: 'Do I need a crypto wallet to use Apprit?', a: 'No. As an end user, all blockchain interactions happen transparently in the backend. You just upload, track, and get notified — no Web3 knowledge needed.' },
  ];

  constructor(private router: Router) {}

  toggleFaq(i: number) { this.openFaq = this.openFaq === i ? null : i; }
  goHome()     { this.router.navigate(['/']); }
  goLogin()    { this.router.navigate(['/login']); }
  goRegister() { this.router.navigate(['/register']); }
}
