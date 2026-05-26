import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LucideUser, LucideLock, LucideEye, LucideEyeOff, LucideAlertTriangle, LucideLightbulb } from '@lucide/angular';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideUser, LucideLock, LucideEye, LucideEyeOff, LucideAlertTriangle, LucideLightbulb],
  template: `
    <div class="auth-page">
      <!-- Animated background mesh -->
      <div class="auth-bg">
        <div class="mesh-blob blob-1"></div>
        <div class="mesh-blob blob-2"></div>
        <div class="mesh-blob blob-3"></div>
      </div>

      <div class="auth-container animate-fade-up">
        <!-- Left Brand Panel -->
        <div class="auth-brand">
          <div class="brand-logo">
            <div class="logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 2L28 8V16C28 22.627 22.627 28 16 30C9.373 28 4 22.627 4 16V8L16 2Z" fill="url(#shield-grad)"/>
                <path d="M11 16l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="shield-grad" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6C63FF"/>
                    <stop offset="1" stop-color="#9B5DE5"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="logo-text">Apprit</span>
          </div>
          <h1 class="brand-title">Document Approval<br><span class="brand-highlight">Made Transparent</span></h1>
          <p class="brand-sub">Blockchain-secured approvals for BMSIT's academic community. Every document, every signature — immutable and auditable.</p>
          <div class="brand-stats">
            <div class="brand-stat">
              <span class="brand-stat-num">256-bit</span>
              <span class="brand-stat-label">SHA Encryption</span>
            </div>
            <div class="brand-divider"></div>
            <div class="brand-stat">
              <span class="brand-stat-num">100%</span>
              <span class="brand-stat-label">Tamper-proof</span>
            </div>
            <div class="brand-divider"></div>
            <div class="brand-stat">
              <span class="brand-stat-num">On-chain</span>
              <span class="brand-stat-label">Audit Trail</span>
            </div>
          </div>
        </div>

        <!-- Right Form Panel -->
        <div class="auth-form-panel">
          <div class="form-header">
            <h2 class="form-title">Welcome back</h2>
            <p class="form-subtitle">Sign in to your BMSIT portal</p>
          </div>

          <form (ngSubmit)="login()" #loginForm="ngForm">
            <div class="form-group">
              <label class="form-label">Username</label>
              <div class="form-input-wrapper">
                <span class="form-input-icon" style="display: flex; align-items: center;"><svg lucideUser size="20"></svg></span>
                <input
                  id="login-username"
                  [(ngModel)]="username"
                  name="username"
                  placeholder="Enter your username"
                  class="form-input with-icon"
                  autocomplete="username"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="form-input-wrapper">
                <span class="form-input-icon" style="display: flex; align-items: center;"><svg lucideLock size="20"></svg></span>
                <input
                  id="login-password"
                  [(ngModel)]="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Enter your password"
                  class="form-input with-icon"
                  style="padding-right: 48px;"
                  autocomplete="current-password"
                />
                <button type="button" class="input-action-btn" (click)="togglePassword()" id="toggle-password" style="display: flex; align-items: center;">
                  <svg *ngIf="showPassword" lucideEyeOff size="20"></svg>
                  <svg *ngIf="!showPassword" lucideEye size="20"></svg>
                </button>
              </div>
            </div>

            <div *ngIf="error" class="alert alert-error animate-fade-in" style="display: flex; gap: 8px; align-items: center;">
              <svg lucideAlertTriangle size="20"></svg> {{error}}
            </div>

            <button id="login-submit" type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
              <span *ngIf="!loading">Sign In →</span>
              <span *ngIf="loading" class="loading-spinner"></span>
              <span *ngIf="loading">Authenticating...</span>
            </button>
          </form>

          <div class="form-footer">
            <p>Don't have an account?
              <a id="go-register" (click)="goRegister()" class="link-action">Create one here</a>
            </p>
            <p style="margin-top: 8px; display: flex; justify-content: center; align-items: center; gap: 6px;">
              <svg lucideLightbulb size="16"></svg>
              <a id="go-hiw" (click)="goHiw()" class="link-action" style="font-size:13px; opacity:0.7;">How does Apprit work?</a>
            </p>
          </div>

          <div class="bmsit-badge">
            <span class="bmsit-dot"></span>
            BMSIT&ET — @bmsit.in accounts only
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-base);
      position: relative;
      overflow: hidden;
      padding: 24px;
    }

    /* Mesh blobs */
    .auth-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .mesh-blob {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.4;
    }
    .blob-1 {
      width: 500px; height: 500px;
      background: radial-gradient(circle, rgba(108, 99, 255, 0.25), transparent 70%);
      top: -150px; left: -100px;
      animation: float 8s ease-in-out infinite;
    }
    .blob-2 {
      width: 400px; height: 400px;
      background: radial-gradient(circle, rgba(255, 101, 132, 0.15), transparent 70%);
      bottom: -100px; right: -50px;
      animation: float 10s ease-in-out infinite reverse;
    }
    .blob-3 {
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.1), transparent 70%);
      top: 50%; right: 30%;
      animation: float 12s ease-in-out infinite 2s;
    }

    /* Auth Container */
    .auth-container {
      position: relative; z-index: 1;
      display: flex;
      width: 100%;
      max-width: 960px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg), var(--shadow-glow);
      border: 1px solid var(--border-subtle);
    }

    /* Brand Panel */
    .auth-brand {
      flex: 1;
      background: linear-gradient(145deg, #1A2035 0%, #0D1526 100%);
      padding: 52px 44px;
      display: flex;
      flex-direction: column;
      gap: 28px;
      border-right: 1px solid var(--border-subtle);
      position: relative;
      overflow: hidden;
    }

    .auth-brand::before {
      content: '';
      position: absolute;
      top: -80px; right: -80px;
      width: 300px; height: 300px;
      background: radial-gradient(circle, rgba(108, 99, 255, 0.15), transparent 70%);
      pointer-events: none;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-icon {
      width: 48px; height: 48px;
      border-radius: var(--radius-md);
      background: rgba(108, 99, 255, 0.12);
      border: 1px solid rgba(108, 99, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 800;
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-title {
      font-size: 32px;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1.25;
    }

    .brand-highlight {
      background: var(--gradient-primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-sub {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.7;
      max-width: 340px;
    }

    .brand-stats {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: auto;
      padding-top: 24px;
      border-top: 1px solid var(--border-subtle);
    }

    .brand-stat { display: flex; flex-direction: column; gap: 2px; }
    .brand-stat-num { font-size: 15px; font-weight: 700; color: var(--text-primary); }
    .brand-stat-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
    .brand-divider { width: 1px; height: 32px; background: var(--border-subtle); }

    /* Form Panel */
    .auth-form-panel {
      width: 420px;
      background: var(--bg-surface);
      padding: 52px 44px;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-header { display: flex; flex-direction: column; gap: 6px; }
    .form-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .form-subtitle { font-size: 14px; color: var(--text-secondary); }

    form { display: flex; flex-direction: column; gap: 0; }

    .form-footer {
      text-align: center;
      font-size: 14px;
      color: var(--text-secondary);
    }

    .link-action {
      color: var(--primary-light);
      cursor: pointer;
      font-weight: 500;
      transition: color var(--transition-fast);
    }
    .link-action:hover { color: var(--primary); }

    .bmsit-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--text-muted);
      padding: 10px 14px;
      background: rgba(108, 99, 255, 0.05);
      border: 1px solid rgba(108, 99, 255, 0.15);
      border-radius: var(--radius-md);
    }

    .bmsit-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 6px rgba(34, 197, 94, 0.6);
      flex-shrink: 0;
      animation: pulse-glow 2s ease-in-out infinite;
    }

    .loading-spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.2);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    @media (max-width: 768px) {
      .auth-brand { display: none; }
      .auth-container { max-width: 440px; }
      .auth-form-panel { width: 100%; padding: 36px 28px; }
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  showPassword = false;
  loading = false;

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login() {
    this.error = '';
    if (!this.username.trim() || !this.password.trim()) {
      this.error = 'Please enter your username and password.';
      return;
    }
    this.loading = true;
    this.authService.login(this.username, this.password).subscribe({
      next: (user) => {
        this.loading = false;
        localStorage.setItem('token', user.token);
        localStorage.setItem('role', user.roles && user.roles[0] || 'ROLE_STUDENT');
        const role = user.roles && user.roles[0];
        if (role === 'ROLE_STUDENT' || role === 'ROLE_CLUB') {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/authority-dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }

  goRegister() { this.router.navigate(['/register']); }
  goHiw()      { this.router.navigate(['/how-it-works']); }
}
