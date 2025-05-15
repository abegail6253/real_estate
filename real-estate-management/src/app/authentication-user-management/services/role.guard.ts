import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import * as jwt_decode from 'jwt-decode';  // Correct import syntax

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Get the required role for the route
    const requiredRole = next.data['role'];
    
    // Log the required role for debugging
    console.log('Required Role:', requiredRole);
    
    if (!requiredRole) {
      // No role required for this route, just allow access
      return true;
    }

    // Get the user's role from the AuthService (decode token if necessary)
    const userRole = this.authService.getUserRole();

    // Log the user's role for debugging
    console.log('User Role:', userRole);

    if (userRole && userRole === requiredRole) {
      // The user's role matches the required role, allow access
      return true;
    } else {
      // Role mismatch or missing role, redirect to login
      console.warn('Role mismatch or missing expected role. Redirecting to login.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
