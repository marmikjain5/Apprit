import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="min-height:100vh;background:#1a1a2e;color:white;font-family:sans-serif">
      <nav style="background:#16213e;padding:16px 32px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #e94560">
        <h1 style="color:#e94560;margin:0">🎓 Apprit - Student Portal</h1>
        <div>
          <button (click)="goUpload()" style="background:#e94560;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer;margin-right:12px">+ Upload Document</button>
          <button (click)="logout()" style="background:#444;color:white;border:none;padding:10px 20px;border-radius:6px;cursor:pointer">Logout</button>
        </div>
      </nav>
      <div style="padding:32px">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-bottom:32px">
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #e94560">
            <h3 style="margin:0;color:#aaa">Total Documents</h3>
            <p style="font-size:36px;margin:8px 0;color:white">3</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #f5a623">
            <h3 style="margin:0;color:#aaa">Pending Approval</h3>
            <p style="font-size:36px;margin:8px 0;color:white">1</p>
          </div>
          <div style="background:#16213e;padding:24px;border-radius:12px;border-left:4px solid #4caf50">
            <h3 style="margin:0;color:#aaa">Approved</h3>
            <p style="font-size:36px;margin:8px 0;color:white">2</p>
          </div>
        </div>
        <div style="background:#16213e;border-radius:12px;padding:24px">
          <h2 style="color:#e94560;margin-top:0">My Documents</h2>
          <table style="width:100%;border-collapse:collapse">
            <thead>
              <tr style="border-bottom:1px solid #333">
                <th style="padding:12px;text-align:left;color:#aaa">Title</th>
                <th style="padding:12px;text-align:left;color:#aaa">Uploaded</th>
                <th style="padding:12px;text-align:left;color:#aaa">Status</th>
                <th style="padding:12px;text-align:left;color:#aaa">Blockchain</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let doc of documents" style="border-bottom:1px solid #222">
                <td style="padding:12px">{{doc.title}}</td>
                <td style="padding:12px;color:#aaa">{{doc.date}}</td>
                <td style="padding:12px">
                  <span [style.background]="doc.status==='APPROVED'?'#1b5e20':doc.status==='REJECTED'?'#b71c1c':'#e65100'"
                        style="padding:4px 12px;border-radius:20px;font-size:12px">{{doc.status}}</span>
                </td>
                <td style="padding:12px;color:#4caf50;font-size:12px">{{doc.hash}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  documents = [
    { title: 'Club Budget Proposal 2025', date: '2026-05-20', status: 'APPROVED', hash: '0xa3f...b2c' },
    { title: 'Event Permission Letter', date: '2026-05-22', status: 'PENDING', hash: '0xd7e...91a' },
    { title: 'Reimbursement Form', date: '2026-05-23', status: 'APPROVED', hash: '0xf1c...44d' },
  ];
  constructor(private router: Router) {}
  ngOnInit() {}
  goUpload() { this.router.navigate(['/upload']); }
  logout() { localStorage.clear(); this.router.navigate(['/login']); }
}
