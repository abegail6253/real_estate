import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { CurrencyPipe } from '@angular/common';  // Import CurrencyPipe
import { ReactiveFormsModule } from '@angular/forms';  // Import ReactiveFormsModule if needed
import { RouterLink } from '@angular/router';  // Import RouterLink for navigation

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,  // Marking this as a standalone component
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, RouterLink],  // Add RouterLink to imports for routing
  templateUrl: './tenant-dashboard.component.html',
  styleUrls: ['./tenant-dashboard.component.css']
})
export class TenantDashboardComponent implements OnInit {

  // Sample data
  leaseStart: string = '2023-01-01';
  leaseEnd: string = '2024-01-01';
  leaseStatus: string = 'Active';

  paymentHistory = [
    { date: '2023-01-01', amount: 1500 },
    { date: '2023-02-01', amount: 1500 },
    { date: '2023-03-01', amount: 1500 },
    // Add more payment history as needed
  ];

  maintenanceRequests = [
    { date: '2023-02-10', status: 'Completed' },
    { date: '2023-03-05', status: 'Pending' },
    { date: '2023-03-15', status: 'Completed' },
    // Add more requests as needed
  ];

  // Check if rent is due (for illustration purposes, can be customized based on actual dates)
  isRentDue: boolean = false;

  ngOnInit(): void {
    // Logic for checking if rent is due based on today's date and lease end
    const currentDate = new Date();
    const leaseEndDate = new Date(this.leaseEnd);
    if (currentDate >= leaseEndDate) {
      this.isRentDue = true; // Rent is due after lease ends
    }
  }
}
