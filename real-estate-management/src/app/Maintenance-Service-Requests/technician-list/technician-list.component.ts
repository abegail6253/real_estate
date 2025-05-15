import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-technician-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './technician-list.component.html',
  styleUrls: ['./technician-list.component.css']
})
export class TechnicianListComponent implements OnInit {
  technicians = [
    {
      name: 'John Doe',
      status: 'Working',
      currentAction: 'Fixing Broken window in the living room',
      workHistory: [
        { task: 'Fixed leaky faucet', date: '2025-03-20', tenant: 'Tenant A' },
        { task: 'Repaired door hinge', date: '2025-02-15', tenant: 'Tenant B' }
      ]
    },
    {
      name: 'Jane Smith',
      status: 'Free',
      currentAction: 'No Current Task',
      workHistory: [
        { task: 'Installed new light fixtures', date: '2025-03-10', tenant: 'Tenant C' },
        { task: 'Repaired power outlet', date: '2025-02-28', tenant: 'Tenant D' }
      ]
    },
    {
      name: 'Mike Johnson',
      status: 'Free',
      currentAction: 'No Current Task',
      workHistory: [
        { task: 'Fixed water heater', date: '2025-03-12', tenant: 'Tenant E' },
        { task: 'Replaced window', date: '2025-02-20', tenant: 'Tenant F' }
      ]
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {}

  // Method to navigate to the Maintenance Request Tracking page
  navigateToTracking(): void {
    this.router.navigate(['/maintenance-request-tracking']);
  }
}
