// src/app/services/user.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000'; // Base backend URL

  constructor(private http: HttpClient) {}

  // Helper method to set auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // GET Admin Panel data
  getAdminPanel(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin-panel`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET Landlord Dashboard data
  getLandlordDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/landlord-dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET Property Manager Dashboard data
  getPropertyManagerDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/property-manager-dashboard`, {
      headers: this.getAuthHeaders()
    });
  }

  // GET Tenant Dashboard data
  getTenantDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tenant-dashboard`, {
      headers: this.getAuthHeaders()
    });
  }
}
