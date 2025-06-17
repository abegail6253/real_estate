import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:5000/api/properties'; // 🔗 Backend API endpoint

  constructor(private http: HttpClient) {}

  /**
   * Adds a new property to the backend.
   * @param propertyData The data of the property to add
   * @param token The JWT token for authentication
   * @returns Observable with the backend response
   */
  addProperty(propertyData: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // ✅ Set JWT token in the header
    });

    return this.http.post<any>(this.apiUrl, propertyData, { headers });
  }
}
