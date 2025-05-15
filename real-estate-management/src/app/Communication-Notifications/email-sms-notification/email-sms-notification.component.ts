// src/app/communication/email-sms-notification/email-sms-notification.component.ts

import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Import FormsModule here
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-sms-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],  // Add FormsModule here for ngModel support
  templateUrl: './email-sms-notification.component.html',
  styleUrls: ['./email-sms-notification.component.css']
})
export class EmailSmsNotificationComponent implements OnInit {

  // Define the notificationData object with 'message', 'phone', and 'email' properties
  notificationData = {
    message: '',  // Initialize with an empty string or a default message
    phone: '',    // Add the 'phone' property
    email: ''     // Add the 'email' property
  };

  notificationForm: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) { 
    this.notificationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  // Method to send email notification
  sendEmail(): void {
    if (this.notificationForm.valid) {
      this.notificationService.sendEmailNotification(this.notificationForm.value).subscribe(
        (response) => {
          alert('Email sent successfully');
        },
        (error) => {
          alert('Error sending email');
        }
      );
    } else {
      alert('Please fill in all fields correctly.');
    }
  }

  // Method to send SMS notification
  sendSms(): void {
    if (this.notificationForm.valid) {
      this.notificationService.sendSmsNotification(this.notificationForm.value).subscribe(
        (response) => {
          alert('SMS sent successfully');
        },
        (error) => {
          alert('Error sending SMS');
        }
      );
    } else {
      alert('Please fill in all fields correctly.');
    }
  }
}
