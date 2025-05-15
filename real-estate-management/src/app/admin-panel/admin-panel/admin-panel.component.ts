import { Component } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CommonModule } from '@angular/common'; // Import CommonModule to use *ngFor
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,  // Marking this as a standalone component
  imports: [CommonModule, CurrencyPipe],  // Add CommonModule here to enable *ngFor
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  users = [
    { id: 1, name: 'John Doe', role: 'Tenant' },
    { id: 2, name: 'Jane Smith', role: 'Landlord' },
    { id: 3, name: 'Robert Brown', role: 'Property Manager' }
  ];

  properties = [
    { id: 1, address: '1234 Elm St', status: 'Available' },
    { id: 2, address: '5678 Oak Ave', status: 'Occupied' }
  ];

  financialData = [
    { month: 'January', totalRevenue: 5000, expenses: 1000 },
    { month: 'February', totalRevenue: 4500, expenses: 800 }
  ];

  constructor(private router: Router) {}

  // Method to delete a user
  deleteUser(userId: number): void {
    this.users = this.users.filter(user => user.id !== userId);
  }

  // Method to delete a property
  deleteProperty(propertyId: number): void {
    this.properties = this.properties.filter(property => property.id !== propertyId);
  }

  // Method to edit financial data
  editFinancialData(month: string): void {
    const data = this.financialData.find(f => f.month === month);
    if (data) {
      data.totalRevenue += 1000; // Example modification
      data.expenses += 200;
    }
  }

  // Logout method to redirect to login page
  logout(): void {
    // Clear any authentication tokens if necessary
    this.router.navigate(['/login']);
  }
}
