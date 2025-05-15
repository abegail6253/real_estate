import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

// Enum for User Roles (Optional but helps to ensure consistency)
export enum UserRole {
  Admin = 'admin',
  Landlord = 'landlord',
  Tenant = 'tenant',
  PropertyManager = 'property-manager'
}

// The CanActivateFn approach for route guarding based on roles
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const jwtHelper = inject(JwtHelperService);

  // Log the route data to debug
  console.log('Route data:', route.data);

  // Get the expected role from route data with fallback to empty string if undefined
  const expectedRole = route.data['role'] as UserRole || '';
  console.log('Expected role from route:', expectedRole);

  // ✅ Get the token from the correct key in localStorage
  const token = localStorage.getItem('jwt_token');

  // Check if token exists and is not expired
  if (token && !jwtHelper.isTokenExpired(token)) {
    const decodedToken = jwtHelper.decodeToken(token);

    // Log the decoded token to verify its structure
    console.log('Decoded Token:', decodedToken);

    const userRole = decodedToken.role;

    // Debugging role information
    console.log('Token role:', userRole);
    console.log('Expected role:', expectedRole);

    if (expectedRole && userRole === expectedRole) {
      // Role matches, allow access
      return true;
    } else if (!expectedRole) {
      // No role required, allow access
      return true;
    } else {
      // Role mismatch or missing expected role, redirect to login
      console.warn('Role mismatch or missing expected role. Redirecting to login.');
      router.navigate(['/login']);
      return false;
    }
  }

  // No valid token
  console.warn('No valid token. Redirecting to login.');
  router.navigate(['/login']);
  return false;
};
