import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';
import { Message } from '../services/message.model';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel

@Component({
  selector: 'app-message-center',
  standalone: true,  // Marking this as a standalone component
  imports: [CommonModule, ReactiveFormsModule, FormsModule],  // Import FormsModule here
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  currentUserId: string = 'tenant123';  // Dynamic user ID based on the logged-in user
  currentUserRole: 'tenant' | 'landlord' = 'tenant'; // Track the role of the user
  messageForm: FormGroup;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    // Initialize the form for new message input
    this.messageForm = this.fb.group({
      newMessage: ['']
    });
  }

  ngOnInit(): void {
    // Sample message data (this could also come from a service)
    this.messages = [
      {
        id: 1,
        sender: 'property-manager123',
        recipient: 'tenant123',
        content: 'Reminder: Your rent is due in 3 days. Please ensure the payment is made on time.',
        timestamp: new Date('2025-04-03T10:30:00'),
        status: 'sent'  // Status updated
      },
      {
        id: 2,
        sender: 'tenant123',
        recipient: 'property-manager123',
        content: 'Hi, I have a question regarding the parking space availability.',
        timestamp: new Date('2025-04-02T14:15:00'),
        status: 'read'
      },
      {
        id: 3,
        sender: 'property-manager123',
        recipient: 'tenant123',
        content: 'Your maintenance request has been approved. A technician will visit tomorrow.',
        timestamp: new Date('2025-04-01T09:00:00'),
        status: 'read'
      }
    ];
  }

  sendMessage(): void {
    if (this.messageForm.valid && this.newMessage.trim()) {
      const recipient = this.currentUserRole === 'tenant' ? 'property-manager123' : 'tenant123'; // Determine recipient dynamically
      const message: Message = {
        id: Date.now(),  // For simplicity, using timestamp as message ID
        sender: this.currentUserId,
        recipient: recipient,  // Dynamic recipient
        content: this.newMessage.trim(),
        timestamp: new Date(),
        status: 'sent'  // Status set to 'sent'
      };

      this.messages.push(message);  // Append the new message to the list
      this.newMessage = '';  // Clear the input field after sending
    }
  }

  markAsRead(messageId: number): void {
    const messageIndex = this.messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      this.messages[messageIndex].status = 'read';  // Mark as read
    }
  }
}
