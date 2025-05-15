import { Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout/main-layout.component';
import { LoginComponent } from './authentication-user-management/components/login/login.component';
import { LandlordDashboardComponent } from './authentication-user-management/components/User-Roles-Permissions/dashboard/landlord-dashboard/landlord-dashboard.component';
import { PropertyManagerDashboardComponent } from './authentication-user-management/components/User-Roles-Permissions/dashboard/property-manager-dashboard/property-manager-dashboard.component';
import { TenantDashboardComponent } from './authentication-user-management/components/User-Roles-Permissions/tenant-portal/tenant-dashboard/tenant-dashboard.component';
import { ProfileManagementComponent } from './authentication-user-management/components/User-Roles-Permissions/profile-management/profile-management.component';
import { PropertyListingComponent } from './Property-Management/property-listing/property-listing.component';
import { PropertyDetailsComponent } from './Property-Management/property-details/property-details.component';
import { TenantDirectoryComponent } from './Tenant-Management/tenant-directory/tenant-directory.component';
import { LeaseManagementComponent } from './Tenant-Management/lease-management/lease-management.component';
import { PaymentComponent } from './Rent-Collection-Payment-Tracking/payment/payment.component';
import { PaymentSuccessComponent } from './Rent-Collection-Payment-Tracking/payment-success/payment-success.component';
import { PaymentFailureComponent } from './Rent-Collection-Payment-Tracking/payment-failure/payment-failure.component';
import { MaintenanceRequestComponent } from './Maintenance-Service-Requests/maintenance-request/maintenance-request.component';
import { MaintenanceRequestTrackingComponent } from './Maintenance-Service-Requests/maintenance-request-tracking/maintenance-request-tracking.component';
import { MessageCenterComponent } from './Communication-Notifications/message-center/message-center.component';
import { EmailSmsNotificationComponent } from './Communication-Notifications/email-sms-notification/email-sms-notification.component';
import { FinancialReportingComponent } from './Financial-Reporting-Analytics/financial-reporting/financial-reporting.component';
import { TaxInvoiceGeneratorComponent } from './Financial-Reporting-Analytics/tax-invoice-generator/tax-invoice-generator.component';
import { DocumentStorageComponent } from './authentication-user-management/components/User-Roles-Permissions/tenant-portal/document-storage/document-storage.component';
import { AdminPanelComponent } from './admin-panel/admin-panel/admin-panel.component';
import { AuditActivityLogComponent } from './admin-panel/audit-activity-log/audit-activity-log.component';
import { LeaseAgreementsComponent } from './authentication-user-management/components/User-Roles-Permissions/tenant-portal/lease-agreements/lease-agreements.component';
import { PaymentReceiptsComponent } from './authentication-user-management/components/User-Roles-Permissions/tenant-portal/payment-receipts/payment-receipts.component';
import { TechnicianListComponent } from './Maintenance-Service-Requests/technician-list/technician-list.component';
import { PropertyManagerComponent } from './authentication-user-management/components/property-manager/property-manager.component';
import { AccessPermissionComponent } from './authentication-user-management/components/access-permission/access-permission.component';
import { TenantInviteComponent } from './tenant-invite/tenant-invite.component';
import { TenantManagementComponent } from './Tenant-Management/tenant-management/tenant-management.component';
import { authGuard } from './authentication-user-management/services/auth.guard';
import { RoleGuard } from './authentication-user-management/services/role.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { UserRole } from './authentication-user-management/services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'landlord-dashboard',
        component: LandlordDashboardComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Landlord, expectedRole: 'landlord' }
      },
      {
        path: 'property-manager-dashboard',
        component: PropertyManagerDashboardComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.PropertyManager, expectedRole: 'property-manager' }
      },
      {
        path: 'tenant-dashboard',
        component: TenantDashboardComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Tenant, expectedRole: 'tenant' }
      },
      { path: 'profile-management', component: ProfileManagementComponent },
      { path: 'property-listing', component: PropertyListingComponent },
      { path: 'property-details/:id', component: PropertyDetailsComponent },
      {
        path: 'tenant-management',
        component: TenantManagementComponent,
        children: [
          { path: 'tenant-directory', component: TenantDirectoryComponent },
          { path: 'lease-management', component: LeaseManagementComponent },
          { path: 'lease-agreements', component: LeaseAgreementsComponent },
          { path: 'payment-receipts', component: PaymentReceiptsComponent },
          { path: 'document-storage', component: DocumentStorageComponent }
        ]
      },
      { path: 'payment', component: PaymentComponent },
      { path: 'payment-success', component: PaymentSuccessComponent },
      { path: 'payment-failure', component: PaymentFailureComponent },
      {
        path: 'maintenance-request',
        component: MaintenanceRequestComponent,
        canActivate: [RoleGuard],
        data: { expectedRole: 'tenant' }
      },
      { path: 'maintenance-tracking', component: MaintenanceRequestTrackingComponent },
      { path: 'message-center', component: MessageCenterComponent },
      { path: 'email-sms-notification', component: EmailSmsNotificationComponent },
      { path: 'financial-reporting', component: FinancialReportingComponent },
      { path: 'tax-invoice-generator', component: TaxInvoiceGeneratorComponent },
      {
        path: 'admin-panel',
        component: AdminPanelComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Admin, expectedRole: 'admin' }
      },
      {
        path: 'audit-activity-log',
        component: AuditActivityLogComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Admin, expectedRole: 'admin' }
      },
      {
        path: 'technician-list',
        component: TechnicianListComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Admin, expectedRole: 'admin' }
      },
      {
        path: 'property-manager',
        component: PropertyManagerComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Admin, expectedRole: 'admin' }
      },
      {
        path: 'access-permission',
        component: AccessPermissionComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Admin, expectedRole: 'admin' }
      },
      {
        path: 'tenant-invite',
        component: TenantInviteComponent,
        canActivate: [RoleGuard],
        data: { role: UserRole.Admin, expectedRole: 'admin' }
      },
      { path: '', redirectTo: '/login', pathMatch: 'full' }
    ]
  },

  { path: '**', component: NotFoundComponent }
];
