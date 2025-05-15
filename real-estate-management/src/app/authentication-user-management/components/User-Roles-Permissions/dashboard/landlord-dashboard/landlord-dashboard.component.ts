import { Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // ✅ Import RouterModule and Routes
import { PropertyManagerComponent } from '../../../property-manager/property-manager.component';
import { AccessPermissionComponent } from '../../../access-permission/access-permission.component';
import { TenantDirectoryComponent } from '../../../../../Tenant-Management/tenant-directory/tenant-directory.component';
import { LeaseManagementComponent } from '../../../../../Tenant-Management/lease-management/lease-management.component';
import { TenantInviteComponent } from '../../../../../tenant-invite/tenant-invite.component';
import { EmailSmsNotificationComponent } from '../../../../../Communication-Notifications/email-sms-notification/email-sms-notification.component';
import { MessageCenterComponent } from '../../../../../Communication-Notifications/message-center/message-center.component';
import { TenantManagementComponent } from '../../../../../Tenant-Management/tenant-management/tenant-management.component';
import { LeaseAgreementsComponent } from '../../tenant-portal/lease-agreements/lease-agreements.component';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [RouterModule],  // ✅ Add this line
  templateUrl: './landlord-dashboard.component.html',
  styleUrls: ['./landlord-dashboard.component.css']
})
export class LandlordDashboardComponent {}

// Make sure to add the 'Routes' import here
export const routes: Routes = [
  {
    path: 'property-managers',
    component: PropertyManagerComponent,
  },
  {
    path: 'access-permissions',
    component: AccessPermissionComponent,
  },
  {
    path: 'tenant-management',
    component: TenantManagementComponent, // Main component for tenant management
    children: [
      {
        path: 'tenant-directory',
        component: TenantDirectoryComponent, // Child route for tenant directory
      },
      {
        path: 'lease-management',
        component: LeaseAgreementsComponent, // Child route for lease agreements
      },
    ],
  },
  {
    path: 'tenant-invite',
    component: TenantInviteComponent,
  },
  {
    path: 'notifications',
    component: EmailSmsNotificationComponent, // Assuming this should be for email/sms notifications
  },
  {
    path: 'message-center',
    component: MessageCenterComponent, // Assuming this is for message center
  },
  // other existing routes...
];
