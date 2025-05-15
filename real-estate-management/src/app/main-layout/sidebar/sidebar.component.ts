import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../authentication-user-management/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  links: { name: string, route: string }[] = [];
  role: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.role = this.authService.getUserRole();

    const allLinks: Record<string, { name: string, route: string }[]> = {
      admin: [
        { name: 'Admin Panel', route: '/admin-panel' },
        { name: 'Access Permissions', route: '/access-permission' },
        { name: 'Audit Log', route: '/audit-activity-log' }
      ],
      landlord: [
        { name: 'Landlord Dashboard', route: '/landlord-dashboard' },
        { name: 'Property Listing', route: '/property-listing' }
      ],
      tenant: [
        { name: 'Tenant Dashboard', route: '/tenant-dashboard' },
        { name: 'Lease Agreements', route: '/lease-agreements' }
      ],
      manager: [
        { name: 'Manager Dashboard', route: '/property-manager-dashboard' }
      ]
    };

    if (this.role && allLinks[this.role]) {
      this.links = allLinks[this.role];
    }
  }
}
