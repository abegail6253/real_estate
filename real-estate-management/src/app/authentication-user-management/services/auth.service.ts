import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private currentUserRole: string | null = null;
  private currentUserEmail: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    const loginPayload = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginPayload).pipe(
      tap((response) => {
        // Save token and user role in localStorage
        localStorage.setItem('jwt_token', response.token);
        localStorage.setItem('role', response.role);
        localStorage.setItem('email', response.email);

        // Decode token and store landlord ID if applicable
        const decoded: any = this.decodeToken(response.token);
        console.log('✅ Decoded JWT:', decoded);
        if (decoded && decoded.role === 'landlord') {
          localStorage.setItem('landlord_id', decoded.id.toString());
          console.log('✅ Landlord ID saved:', decoded.id);
        }

        // Log role
        console.log('User role after login:', response.role);
        console.log('Role saved to localStorage:', response.role);

        // Handle redirection
        this.redirectUser(response.role);
      })
    );
  }

  // Decode JWT token
  private decodeToken(token: string): any {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('❌ Failed to decode JWT:', error);
      return null;
    }
  }

  // Role-based redirection
  private redirectUser(role: string) {
    if (role === 'admin') {
      this.router.navigate(['/admin-panel']);
    } else if (role === 'landlord') {
      this.router.navigate(['/landlord-dashboard']);
    } else if (role === 'property-manager') {
      this.router.navigate(['/property-manager-dashboard']);
    } else if (role === 'tenant') {
      this.router.navigate(['/tenant-dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Handle successful login response (can be used externally if needed)
  handleLoginResponse(response: any): void {
    const { token, role, email } = response;

    this.currentUserRole = role;
    this.currentUserEmail = email;

    localStorage.setItem('role', role);
    localStorage.setItem('email', email);
    localStorage.setItem('jwt_token', token);

    console.log('Role saved in localStorage:', role);
    console.log('JWT Token saved in localStorage:', token);
  }

  // Logout
  logout(): void {
    this.currentUserRole = null;
    this.currentUserEmail = null;
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('landlord_id'); // Remove landlord ID if logging out
  }

  // Getter methods
  getRole(): string | null {
    return this.currentUserRole || localStorage.getItem('role');
  }

  getEmail(): string | null {
    return this.currentUserEmail || localStorage.getItem('email');
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getLandlordId(): string | null {
    return localStorage.getItem('landlord_id');
  }

  // Authentication check
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get role from decoded token
  getUserRole(): string {
    const token = this.getToken();
    if (token) {
      const decoded: any = this.decodeToken(token);
      return decoded?.role || 'tenant';
    }
    return 'tenant';
  }

  // Set headers with token
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  // Update profile
  updateProfile(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/update`, user, {
      headers: this.getHeaders(),
    });
  }
}
