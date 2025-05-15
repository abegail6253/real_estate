import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router'; // Import Router for redirection
import { jwtDecode } from 'jwt-decode';  // Corrected to named import

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; // Base API URL
  private currentUserRole: string | null = null;
  private currentUserEmail: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(email: string, password: string): Observable<any> {
    const loginPayload = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, loginPayload).pipe(
      tap((response) => {
        // Save token and user role in localStorage
        localStorage.setItem('jwt_token', response.token);  // Save the token
        localStorage.setItem('role', response.role);        // Save the role
        localStorage.setItem('email', response.email);      // Save email

        // Log the user role to ensure it's correctly saved
        console.log('User role after login:', response.role); // Log user role after successful login
        console.log('Role saved to localStorage:', response.role);  // Check this log

        // Handle redirection based on role
        this.redirectUser(response.role);
      })
    );
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
      this.router.navigate(['/login']); // Fallback to login if role is unknown
    }
  }

  // Handle successful login response
  handleLoginResponse(response: any): void {
    const { token, role, email } = response;

    this.currentUserRole = role;
    this.currentUserEmail = email;

    // Save to localStorage using consistent key names
    localStorage.setItem('role', role);  // Consistent key for role
    localStorage.setItem('email', email);
    localStorage.setItem('jwt_token', token);

    // Log to verify the role and token consistency
    console.log('Role saved in localStorage:', role);
    console.log('JWT Token saved in localStorage:', token);
  }

  // Logout
  logout(): void {
    this.currentUserRole = null;
    this.currentUserEmail = null;
    localStorage.removeItem('role');  // Remove using the consistent key
    localStorage.removeItem('email');
    localStorage.removeItem('jwt_token');
  }

  // Getter methods
  getRole(): string | null {
    return this.currentUserRole || localStorage.getItem('role');  // Get using consistent key
  }

  getEmail(): string | null {
    return this.currentUserEmail || localStorage.getItem('email');  // Get using consistent key
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Authentication check
  isAuthenticated(): boolean {
    return !!this.getToken(); // Check if token exists
  }

  // User role fallback
  getUserRole(): string {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token); // Decode the token using jwtDecode function
      console.log('Decoded Token:', decodedToken);  // Log decoded token to check its structure
      return decodedToken.role || 'tenant'; // Assuming 'role' field exists in the decoded token
    }
    return 'tenant'; // Return 'tenant' if no token or role is not present
  }

  // Set headers with token
  getHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '', // Corrected the backticks here
    });
  }

  // Update profile (requires authentication)
  updateProfile(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/update`, user, {
      headers: this.getHeaders(),
    });
  }
}
