import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-page">
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
                <path d="M16 2L28 8V16C28 22.627 22.627 28 16 30C9.373 28 4 22.627 4 16V8L16 2Z" fill="url(#shield-grad2)"/>
                <path d="M11 16l3 3 7-7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <defs>
                  <linearGradient id="shield-grad2" x1="4" y1="2" x2="28" y2="30" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6C63FF"/>
                    <stop offset="1" stop-color="#9B5DE5"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="logo-text">Apprit</span>
          </div>

          <h1 class="brand-title">Join the<br><span class="brand-highlight">BMSIT Portal</span></h1>
          <p class="brand-sub">Create your account to submit, track, and manage documents through our blockchain-secured approval pipeline.</p>

          <div class="roles-info">
            <p class="roles-title">Available Roles</p>
            <div class="role-list">
              <div class="role-item" *ngFor="let r of roleDescriptions">
                <span class="role-icon">{{r.icon}}</span>
                <div>
                  <span class="role-name">{{r.name}}</span>
                  <span class="role-desc">{{r.desc}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Form Panel -->
        <div class="auth-form-panel">
          <div class="form-header">
            <h2 class="form-title">Create Account</h2>
            <p class="form-subtitle">All fields are required</p>
          </div>

          <form (ngSubmit)="register()" #regForm="ngForm">
            <div class="form-group">
              <label class="form-label">Username</label>
              <div class="form-input-wrapper">
                <span class="form-input-icon">👤</span>
                <input
                  id="reg-username"
                  [(ngModel)]="username"
                  name="username"
                  placeholder="Choose a username"
                  class="form-input with-icon"
                  autocomplete="username"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">College Email</label>
              <div class="form-input-wrapper">
                <span class="form-input-icon">📧</span>
                <input
                  id="reg-email"
                  [(ngModel)]="email"
                  name="email"
                  type="email"
                  placeholder="yourname@bmsit.in"
                  class="form-input with-icon"
                  [class.input-error]="emailInvalid"
                  autocomplete="email"
                />
              </div>
              <p class="input-hint" [class.hint-error]="emailInvalid">
                {{ emailInvalid ? '⚠ Must be a @bmsit.in email address' : 'Only @bmsit.in domain is permitted' }}
              </p>
            </div>

            <div class="form-group">
              <label class="form-label">Password</label>
              <div class="form-input-wrapper">
                <span class="form-input-icon">🔒</span>
                <input
                  id="reg-password"
                  [(ngModel)]="password"
                  name="password"
                  [type]="showPassword ? 'text' : 'password'"
                  placeholder="Create a strong password"
                  class="form-input with-icon"
                  style="padding-right: 48px;"
                  autocomplete="new-password"
                />
                <button type="button" class="input-action-btn" (click)="togglePassword()" id="toggle-reg-password">
                  {{ showPassword ? '🙈' : '👁️' }}
                </button>
              </div>
            </div>

            <div class="form-group" style="margin-bottom: 24px;">
              <label class="form-label">Role</label>
              <div class="role-select-grid">
                <label
                  *ngFor="let opt of roleOptions"
                  class="role-option"
                  [class.selected]="role === opt.value"
                  [attr.for]="'role-' + opt.value"
                >
                  <input
                    type="radio"
                    [id]="'role-' + opt.value"
                    name="role"
                    [value]="opt.value"
                    [(ngModel)]="role"
                    style="display:none"
                  />
                  <span class="role-opt-icon">{{opt.icon}}</span>
                  <span class="role-opt-label">{{opt.label}}</span>
                </label>
              </div>
            </div>

            <div *ngIf="success" class="alert alert-success animate-fade-in">
              <span>✅</span> {{success}}
            </div>
            <div *ngIf="error" class="alert alert-error animate-fade-in">
              <span>⚠️</span> {{error}}
            </div>

            <button id="reg-submit" type="submit" class="btn btn-primary btn-full btn-lg" [disabled]="loading">
              <span *ngIf="!loading">Create Account →</span>
              <span *ngIf="loading" class="loading-spinner"></span>
              <span *ngIf="loading">Registering...</span>
            </button>
          </form>

          <div class="form-footer">
            <p>Already have an account?
              <a id="go-login" (click)="goLogin()" class="link-action">Sign in here</a>
            </p>
          </div>

          <div class="bmsit-badge">
            <span class="bmsit-dot"></span>
            BMSIT&ET – Blockchain-Secured Approval System
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
    .auth-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
    .mesh-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.4; }
    .blob-1 { width: 500px; height: 500px; background: radial-gradient(circle, rgba(155, 93, 229, 0.2), transparent 70%); top: -100px; left: -100px; animation: float 8s ease-in-out infinite; }
    .blob-2 { width: 400px; height: 400px; background: radial-gradient(circle, rgba(108, 99, 255, 0.15), transparent 70%); bottom: -100px; right: -50px; animation: float 10s ease-in-out infinite reverse; }
    .blob-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(56, 189, 248, 0.08), transparent 70%); top: 50%; right: 30%; animation: float 12s ease-in-out infinite 2s; }

    .auth-container {
      position: relative; z-index: 1;
      display: flex;
      width: 100%;
      max-width: 1000px;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-lg), var(--shadow-glow);
      border: 1px solid var(--border-subtle);
    }

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
      background: radial-gradient(circle, rgba(108, 99, 255, 0.12), transparent 70%);
      pointer-events: none;
    }

    .brand-logo { display: flex; align-items: center; gap: 12px; }
    .logo-icon { width: 48px; height: 48px; border-radius: var(--radius-md); background: rgba(108, 99, 255, 0.12); border: 1px solid rgba(108, 99, 255, 0.25); display: flex; align-items: center; justify-content: center; }
    .logo-text { font-family: var(--font-display); font-size: 24px; font-weight: 800; background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .brand-title { font-size: 32px; font-weight: 800; color: var(--text-primary); line-height: 1.25; }
    .brand-highlight { background: var(--gradient-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .brand-sub { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

    .roles-info { margin-top: auto; }
    .roles-title { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 12px; }
    .role-list { display: flex; flex-direction: column; gap: 10px; }
    .role-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); }
    .role-icon { font-size: 18px; }
    .role-name { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); }
    .role-desc { display: block; font-size: 11px; color: var(--text-muted); }

    .auth-form-panel {
      width: 440px;
      background: var(--bg-surface);
      padding: 52px 44px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
    }

    .form-header { display: flex; flex-direction: column; gap: 6px; }
    .form-title { font-size: 28px; font-weight: 700; color: var(--text-primary); }
    .form-subtitle { font-size: 14px; color: var(--text-secondary); }

    form { display: flex; flex-direction: column; }

    .input-hint { font-size: 11px; color: var(--text-muted); margin-top: 6px; transition: color var(--transition-fast); }
    .hint-error { color: var(--danger) !important; }
    .input-error { border-color: rgba(239, 68, 68, 0.5) !important; }
    .input-error:focus { box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important; }

    /* Role grid */
    .role-select-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .role-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 10px 8px;
      border: 1px solid var(--border-normal);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: center;
      background: var(--bg-input);
    }

    .role-option:hover {
      border-color: var(--border-focus);
      background: rgba(108, 99, 255, 0.06);
    }

    .role-option.selected {
      border-color: rgba(108, 99, 255, 0.6);
      background: rgba(108, 99, 255, 0.12);
      box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.15);
    }

    .role-opt-icon { font-size: 20px; }
    .role-opt-label { font-size: 11px; font-weight: 500; color: var(--text-secondary); line-height: 1.2; }
    .role-option.selected .role-opt-label { color: var(--primary-light); }

    .form-footer { text-align: center; font-size: 14px; color: var(--text-secondary); }
    .link-action { color: var(--primary-light); cursor: pointer; font-weight: 500; transition: color var(--transition-fast); }
    .link-action:hover { color: var(--primary); }

    .bmsit-badge { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); padding: 10px 14px; background: rgba(108, 99, 255, 0.05); border: 1px solid rgba(108, 99, 255, 0.15); border-radius: var(--radius-md); }
    .bmsit-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--success); box-shadow: 0 0 6px rgba(34, 197, 94, 0.6); flex-shrink: 0; animation: pulse-glow 2s ease-in-out infinite; }

    .loading-spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.2); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }

    @media (max-width: 768px) {
      .auth-brand { display: none; }
      .auth-container { max-width: 480px; }
      .auth-form-panel { width: 100%; padding: 36px 28px; }
      .role-select-grid { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  role = 'ROLE_STUDENT';
  success = '';
  error = '';
  showPassword = false;
  loading = false;
  emailInvalid = false;

  roleOptions = [
    { value: 'ROLE_STUDENT',        label: 'Student',        icon: '🎓' },
    { value: 'ROLE_CLUB',           label: 'Club',           icon: '🎭' },
    { value: 'ROLE_FACULTY',        label: 'Faculty',        icon: '📚' },
    { value: 'ROLE_HOD',            label: 'HOD',            icon: '🏛️' },
    { value: 'ROLE_VICE_PRINCIPAL', label: 'Vice Principal', icon: '⚖️' },
    { value: 'ROLE_PRINCIPAL',      label: 'Principal',      icon: '👑' },
    { value: 'ROLE_DEAN',           label: 'Dean',           icon: '🎩' },
  ];

  roleDescriptions = [
    { icon: '🎓', name: 'Student / Club', desc: 'Submit documents for approval' },
    { icon: '📚', name: 'Faculty / HOD', desc: 'Review and approve requests' },
    { icon: '👑', name: 'Principal / VP', desc: 'Final sign-off authority' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  register() {
    this.success = '';
    this.error = '';
    this.emailInvalid = false;

    if (!this.username.trim() || !this.email.trim() || !this.password.trim()) {
      this.error = 'All fields are required.';
      return;
    }

    if (!this.email.toLowerCase().endsWith('@bmsit.in')) {
      this.emailInvalid = true;
      this.error = 'Registration is restricted to @bmsit.in email addresses only.';
      return;
    }

    this.loading = true;
    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.username,
      lastName: '',
      roles: [this.role]
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Account created successfully! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/login']), 1800);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Registration failed. Try a different username or email.';
      }
    });
  }

  goLogin() { this.router.navigate(['/login']); }
}
