import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { StudentDashboardComponent } from './features/dashboard/student-dashboard/student-dashboard.component';
import { AuthorityDashboardComponent } from './features/dashboard/authority-dashboard/authority-dashboard.component';
import { DocumentUploadComponent } from './features/documents/document-upload/document-upload.component';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  // Student Routes
  { 
    path: 'student-dashboard', 
    component: StudentDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_STUDENT'] }
  },
  { 
    path: 'upload', 
    component: DocumentUploadComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_STUDENT'] }
  },

  // Authority Routes (HOD, Dean, etc.)
  { 
    path: 'authority-dashboard', 
    component: AuthorityDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ROLE_HOD', 'ROLE_DEAN', 'ROLE_PRINCIPAL', 'ROLE_FACULTY', 'ROLE_CLUB_COORDINATOR'] }
  },

  { path: '**', redirectTo: 'login' }
];
