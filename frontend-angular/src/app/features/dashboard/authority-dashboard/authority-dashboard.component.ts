import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authority-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="min-height:100vh;background:#1a1a2e;color:white;font-family:sans-serif">
      <nav style="background:#16213e;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #e94560">
        <h1 style="color:#e94560;margin:0">🏛️ Apprit - Authority Portal</h1>
        <button (click)="logout()" style="background:#444;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer">Logout</button>
      </nav>
      <div style="padding:32px">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px">
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #f5a623">
            <h3 style="margin:0;color:#aaa">Pending Review</h3>
            <p style="font-size:36px;margin:8px 0">2</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #4caf50">
            <h3 style="margin:0;color:#aaa">Approved Today</h3>
            <p style="font-size:36px;margin:8px 0">1</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #e94560">
            <h3 style="margin:0;color:#aaa">Rejected</h3>
            <p style="font-size:36px;margin:8px 0">0</p>
          </div>
        </div>
        <div style="background:#16213e;border-radius:12px;padding:24px">
          <h2 style="color:#e94560;margin-top:0">📋 Pending Approvals</h2>
          <div *ngFor="let doc of pending" style="background:#0f3460;padding:20px;border-radius:8px;margin-bottom:16px">
            <div style="display:flex;justify-content:space-between;align-items:start">
              <div>
                <h3 style="margin:0 0 8px 0">{{doc.title}}</h3>
                <p style="color:#aaa;margin:0 0 4px 0">Submitted by: {{doc.student}} | Dept: {{doc.dept}}</p>
                <p style="color:#4caf50;margin:0;font-size:12px">🔗 Hash: {{doc.hash}}</p>
              </div>
              <span style="background:#e65100;padding:4px 12px;border-radius:20px;font-size:12px">Level {{doc.level}}</span>
            </div>
            <div style="margin-top:16px">
              <textarea [(ngModel)]="doc.comment" placeholder="Add comments..." style="width:100%;padding:8px;border-radius:6px;border:1px solid #444;background:#1a1a2e;color:white;box-sizing:border-box;margin-bottom:8px" rows="2"></textarea>
              <button (click)="approve(doc)" style="background:#4caf50;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer;margin-right:8px">✅ Approve</button>
              <button (click)="reject(doc)" style="background:#e94560;color:white;border:none;padding:8px 20px;border-radius:6px;cursor:pointer">❌ Reject</button>
            </div>
          </div>
          <p *ngIf="pending.length===0" style="color:#aaa;text-align:center">No pending approvals 🎉</p>
        </div>
      </div>
    </div>
  `
})
export class AuthorityDashboardComponent {
  pending = [
    { id:1, title:'Event Permission Letter', student:'John Doe', dept:'Computer Science', level:2, hash:'0xd7e...91a', comment:'' },
    { id:2, title:'Lab Equipment Request', student:'Jane Smith', dept:'Electronics', level:1, hash:'0xb3c...77f', comment:'' },
  ];
  constructor(private router: Router) {}
  approve(doc: any) {
    alert('✅ Document "' + doc.title + '" APPROVED and recorded on blockchain!');
    this.pending = this.pending.filter(d => d.id !== doc.id);
  }
  reject(doc: any) {
    alert('❌ Document "' + doc.title + '" REJECTED.');
    this.pending = this.pending.filter(d => d.id !== doc.id);
  }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}
