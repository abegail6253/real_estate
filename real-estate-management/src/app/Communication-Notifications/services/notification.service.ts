// src/app/services/notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private apiUrl = 'https://your-api-endpoint.com/api/notifications';  // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  // Send email notification
  sendEmailNotification(notificationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-email`, notificationData);
  }

  // Send SMS notification
  sendSmsNotification(notificationData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send-sms`, notificationData);
  }
}
