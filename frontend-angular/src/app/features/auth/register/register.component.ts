import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a2e">
      <div style="background:#16213e;padding:40px;border-radius:12px;width:400px;box-shadow:0 8px 32px rgba(0,0,0,0.4)">
        <h2 style="color:#e94560;text-align:center;margin-bottom:24px">📝 Register</h2>
        <div style="margin-bottom:12px"><input [(ngModel)]="firstName" placeholder="First Name" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/></div>
        <div style="margin-bottom:12px"><input [(ngModel)]="lastName" placeholder="Last Name" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/></div>
        <div style="margin-bottom:12px"><input [(ngModel)]="username" placeholder="Username" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/></div>
        <div style="margin-bottom:12px"><input [(ngModel)]="email" placeholder="Email" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/></div>
        <div style="margin-bottom:12px"><input [(ngModel)]="password" type="password" placeholder="Password" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/></div>
        <div style="margin-bottom:12px"><select [(ngModel)]="role" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"><option value="ROLE_STUDENT">Student</option><option value="ROLE_FACULTY">Faculty</option><option value="ROLE_CLUB_COORDINATOR">Club Coordinator</option><option value="ROLE_HOD">HOD</option><option value="ROLE_DEAN">Dean</option><option value="ROLE_PRINCIPAL">Principal</option></select></div>
        <div style="margin-bottom:24px"><select [(ngModel)]="deptId" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"><option value="1">Computer Science</option><option value="2">Electronics</option><option value="3">Mechanical</option><option value="4">Civil</option></select></div>
        <button (click)="register()" [disabled]="loading" style="width:100%;padding:12px;background:#e94560;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px">{{loading ? 'Registering...' : 'Register'}}</button>
        <p style="color:#aaa;text-align:center;margin-top:16px">Have account? <a (click)="goLogin()" style="color:#e94560;cursor:pointer">Login</a></p>
        <p *ngIf="success" style="color:lightgreen;text-align:center">{{success}}</p>
        <p *ngIf="error" style="color:red;text-align:center">{{error}}</p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  firstName=''; lastName=''; username=''; email=''; password=''; role='ROLE_STUDENT'; deptId='1'; success=''; error=''; loading=false;

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  register() {
    if (!this.username || !this.email || !this.password) { this.error = 'Please fill all required fields'; return; }
    this.loading = true; this.error = ''; this.success = '';
    const payload = { username: this.username, email: this.email, password: this.password,
      firstName: this.firstName, lastName: this.lastName, roles: [this.role], deptId: Number(this.deptId) };
    this.authService.register(payload).subscribe({
      next: () => { 
        this.loading = false; 
        this.success = 'Registered! Redirecting to login...'; 
        this.cdr.detectChanges();
        setTimeout(() => {
          this.router.navigate(['/login']);
          this.cdr.detectChanges();
        }, 1500); 
      },
      error: (err) => { 
        this.loading = false; 
        this.error = err.error?.message || 'Registration failed.'; 
        this.cdr.detectChanges();
      }
    });
  }
  goLogin() { this.router.navigate(['/login']); }
}
