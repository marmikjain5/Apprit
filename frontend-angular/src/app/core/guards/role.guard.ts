import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoleGuard {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles: string[] = route.data['roles'] || [];
    const userRole = localStorage.getItem('role') || '';
    if (requiredRoles.includes(userRole)) return true;
    this.router.navigate(['/login']);
    return false;
  }
}
