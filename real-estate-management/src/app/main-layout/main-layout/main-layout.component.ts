import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication-user-management/services/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import for ngFor and titlecase pipe
import { MatSidenavModule } from '@angular/material/sidenav'; // Import for mat-sidenav
import { MatToolbarModule } from '@angular/material/toolbar'; // Import for mat-toolbar
import { MatIconModule } from '@angular/material/icon'; // Import for mat-icon
import { MatButtonModule } from '@angular/material/button'; // Import for mat-button

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,  // Ensure CommonModule is imported for ngFor and titlecase pipe
    MatSidenavModule, 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent implements OnInit {

  // Define sidebarLinks with explicit typing for each role
  sidebarLinks: {
    admin: { name: string; route: string }[];
    tenant: { name: string; route: string }[];
    landlord: { name: string; route: string }[];
    manager: { name: string; route: string }[];
  } = {
    admin: [
      { name: 'Admin Panel', route: '/admin-panel' },
      { name: 'Access Permissions', route: '/access-permission' },
      { name: 'Audit Log', route: '/audit-activity-log' },
      { name: 'Property Manager', route: '/property-manager' },
      { name: 'Tenant Management', route: '/tenant-management' },
      { name: 'Financial Reporting', route: '/financial-reporting' },
      { name: 'Document Storage', route: '/document-storage' },
      { name: 'Payment Receipts', route: '/payment-receipts' },
      { name: 'Maintenance Tracking', route: '/maintenance-tracking' }
    ],
    tenant: [
      { name: 'Tenant Dashboard', route: '/tenant-dashboard' },
      { name: 'Lease Agreements', route: '/lease-agreements' },
      { name: 'Payment', route: '/payment' },
      { name: 'Maintenance Requests', route: '/maintenance-request' },
      { name: 'Maintenance Tracking', route: '/maintenance-tracking' }  // Added this line
    ],
    landlord: [
      { name: 'Landlord Dashboard', route: '/landlord-dashboard' },
      { name: 'Property Listing', route: '/property-listing' },
      { name: 'Tenant Directory', route: '/tenant-directory' },
      { name: 'Lease Management', route: '/lease-management' },
      { name: 'Tenant Invite', route: '/tenant-invite' },
      { name: 'Maintenance Tracking', route: '/maintenance-tracking' }
      
    ],
    manager: [
      { name: 'Property Manager Dashboard', route: '/property-manager-dashboard' },
      { name: 'Tenant Management', route: '/tenant-management' },
      { name: 'Maintenance Request Tracking', route: '/maintenance-request-tracking' },
      { name: 'Message Center', route: '/message-center' },
      { name: 'Maintenance Tracking', route: '/maintenance-tracking' }
    ]
  };

  // Use definite assignment assertion to fix the error
  role!: 'admin' | 'tenant' | 'landlord' | 'manager';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Get the user role and cast it to one of the predefined roles
    const userRole = this.authService.getUserRole() as 'admin' | 'tenant' | 'landlord' | 'manager'; 
    if (['admin', 'tenant', 'landlord', 'manager'].includes(userRole)) {
      this.role = userRole; // Valid role
    } else {
      this.role = 'admin'; // Fallback to a default role
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
