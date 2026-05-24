import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#1a1a2e">
      <div style="background:#16213e;padding:40px;border-radius:12px;width:400px;box-shadow:0 8px 32px rgba(0,0,0,0.4)">
        <h2 style="color:#e94560;text-align:center;margin-bottom:24px">📝 Register</h2>
        <div style="margin-bottom:12px">
          <input [(ngModel)]="username" placeholder="Username" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/>
        </div>
        <div style="margin-bottom:12px">
          <input [(ngModel)]="email" placeholder="Email" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/>
        </div>
        <div style="margin-bottom:12px">
          <input [(ngModel)]="password" type="password" placeholder="Password" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box"/>
        </div>
        <div style="margin-bottom:24px">
          <select [(ngModel)]="role" style="width:100%;padding:12px;border-radius:6px;border:1px solid #444;background:#0f3460;color:white;box-sizing:border-box">
            <option value="ROLE_STUDENT">Student</option>
            <option value="ROLE_FACULTY">Faculty</option>
            <option value="ROLE_HOD">HOD</option>
            <option value="ROLE_DEAN">Dean</option>
          </select>
        </div>
        <button (click)="register()" style="width:100%;padding:12px;background:#e94560;color:white;border:none;border-radius:6px;cursor:pointer;font-size:16px">Register</button>
        <p style="color:#aaa;text-align:center;margin-top:16px">Have account? <a (click)="goLogin()" style="color:#e94560;cursor:pointer">Login</a></p>
        <p *ngIf="success" style="color:lightgreen;text-align:center">{{success}}</p>
      </div>
    </div>
  `
})
export class RegisterComponent {
  username = ''; email = ''; password = ''; role = 'ROLE_STUDENT'; success = '';
  constructor(private router: Router) {}
  register() {
    this.success = 'Registered successfully! Redirecting...';
    setTimeout(() => this.router.navigate(['/login']), 1500);
  }
  goLogin() { this.router.navigate(['/login']); }
}
