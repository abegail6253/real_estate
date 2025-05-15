import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RentDuePaymentHistoryService {

  private apiUrl = 'https://your-api-endpoint.com';  // Replace with your backend API URL

  constructor(private http: HttpClient) { }

  // Fetch rent due
  getRentDue(userId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/rent-due/${userId}`);
  }

  // Fetch payment history
  getPaymentHistory(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payment-history/${userId}`);
  }

  // Fetch overdue amounts
  getOverdueAmount(userId: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/overdue-amount/${userId}`);
  }
}
