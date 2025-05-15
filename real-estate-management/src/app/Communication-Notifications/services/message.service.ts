import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://your-api-url.com/messages';  // Backend URL for messages

  constructor(private http: HttpClient) {}

  // Fetch messages for a specific user (can be tenant, landlord, or property manager)
  getMessages(userId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Send a new message
  sendMessage(message: Message): Observable<Message> {
    return this.http.post<Message>(this.apiUrl, message);
  }

  // Update the status of a message (e.g., read or delivered)
  updateMessageStatus(messageId: number, status: string): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/${messageId}`, { status });
  }
}
