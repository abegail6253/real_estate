import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tenant-management',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tenant-management.component.html',
  styleUrls: ['./tenant-management.component.css']
})
export class TenantManagementComponent {
  constructor(private router: Router) {}

  navigateToTenantDirectory() {
    this.router.navigate(['/tenant-management/tenant-directory']);
  }

  navigateToLeaseManagement() {
    this.router.navigate(['/tenant-management/lease-management']);
  }
}
