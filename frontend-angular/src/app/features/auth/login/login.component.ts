import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a2e">
      <div style="background:#16213e;padding:40px;border-radius:12px;width:360px;box-shadow:0 8px 32px rgba(0,0,0,0.4)">
        <h2 style="color:#e94560;text-align:center;margin-bottom:24px">🔐 Apprit Login</h2>
        <div style="margin-bottom:16px">
          <input [(ngModel)]="username" placeholder="Username" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/>
        </div>
        <div style="margin-bottom:24px">
          <input [(ngModel)]="password" type="password" placeholder="Password" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/>
        </div>
        <button (click)="login()" [disabled]="loading" style="width:100%;padding:12px;background:#e94560;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px">{{loading ? 'Logging in...' : 'Login'}}</button>
        <p style="color:#aaa;text-align:center;margin-top:16px">No account? <a (click)="goRegister()" style="color:#e94560;cursor:pointer">Register</a></p>
        <p *ngIf="error" style="color:red;text-align:center">{{error}}</p>
      </div>
    </div>
  `
})
export class LoginComponent {
  username = ''; password = ''; error = ''; loading = false;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  login() {
    if (!this.username || !this.password) { this.error = 'Please enter username and password'; return; }
    this.loading = true; this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        const roles: string[] = res.roles || [];
        if (roles.includes('ROLE_STUDENT')) {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.router.navigate(['/authority-dashboard']);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Check credentials.';
        this.cdr.detectChanges();
      }
    });
  }
  goRegister() { this.router.navigate(['/register']); }
}
