import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { FormsModule } from '@angular/forms';  // Import FormsModule for ngModel

// Define an interface for Lease
interface Lease {
  id: number;
  property: string;
  tenant: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
}

@Component({
  selector: 'app-lease-management',
  standalone: true,
  templateUrl: './lease-management.component.html',
  styleUrls: ['./lease-management.component.css'],
  imports: [CommonModule, FormsModule]  // Add FormsModule to the imports array
})
export class LeaseManagementComponent implements OnInit {
  leases: Lease[] = [
    {
      id: 1,
      property: '123 Oak Street',
      tenant: 'John Doe',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
      rentAmount: 1200
    },
    {
      id: 2,
      property: '456 Maple Avenue',
      tenant: 'Jane Smith',
      startDate: '2024-03-01',
      endDate: '2025-03-01',
      rentAmount: 1500
    }
  ];

  currentLease: Lease = {
    id: null as any,  // Temporarily set to 'any' to handle null value
    property: '',
    tenant: '',
    startDate: '',
    endDate: '',
    rentAmount: 0
  };

  constructor() { }

  ngOnInit(): void {
    // Optionally, you can fetch lease data from a service or API here
  }

  addLease(): void {
    const newLease: Lease = { ...this.currentLease, id: this.leases.length + 1 };  // Assign a new ID
    this.leases.push(newLease);
    this.resetForm();
  }

  editLease(id: number): void {
    const lease = this.leases.find(l => l.id === id);
    if (lease) {
      this.currentLease = { ...lease };  // Copy the lease data to currentLease
    }
  }

  saveLease(): void {
    const leaseIndex = this.leases.findIndex(l => l.id === this.currentLease.id);
    if (leaseIndex !== -1) {
      this.leases[leaseIndex] = { ...this.currentLease };
      this.resetForm();
    }
  }

  resetForm(): void {
    this.currentLease = {
      id: null as any,  // Reset to 'null' or 'any' for new lease
      property: '',
      tenant: '',
      startDate: '',
      endDate: '',
      rentAmount: 0
    };
  }
}
