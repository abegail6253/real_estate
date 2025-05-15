import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MaintenanceRequest } from './maintenance-request.model'; // Assuming you have a model for MaintenanceRequest

@Injectable({
  providedIn: 'root'
})
export class MaintenanceRequestService {

  private apiUrl = 'http://localhost:5000';  // Base URL for your backend

  constructor(private http: HttpClient) { }

  // Get all maintenance requests
  getRequests(): Observable<MaintenanceRequest[]> {
    return this.http.get<MaintenanceRequest[]>(`${this.apiUrl}/maintenance-requests`); // Correct endpoint for fetching all requests
  }

  // Update a maintenance request
  updateRequest(request: MaintenanceRequest): Observable<MaintenanceRequest> {
    return this.http.put<MaintenanceRequest>(`${this.apiUrl}/maintenance-requests/${request.id}`, request); // Correct endpoint for updating request
  }

  // Create a new maintenance request
  createRequest(request: MaintenanceRequest): Observable<MaintenanceRequest> {
    return this.http.post<MaintenanceRequest>(`${this.apiUrl}/maintenance-requests`, request); // Correct endpoint for creating request
  }

  // Submit a maintenance request (for form submission, potentially different from creation)
  submitRequest(requestData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/maintenance-request`, requestData); // Ensure correct endpoint for form submission
  }
}
