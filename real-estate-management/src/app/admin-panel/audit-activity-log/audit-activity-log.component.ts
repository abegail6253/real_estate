// src/app/admin-panel/audit-activity-log/audit-activity-log.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule to use *ngFor

@Component({
  selector: 'app-audit-activity-log',
  standalone: true,  // Marking this as a standalone component
  imports: [CommonModule],  // Add CommonModule here to enable *ngFor
  templateUrl: './audit-activity-log.component.html',
  styleUrls: ['./audit-activity-log.component.css']
})
export class AuditActivityLogComponent {
  activityLogs: { action: string, timestamp: string, user: string }[] = [];

  constructor() {
    // For now, we will simulate some logs
    this.activityLogs = [
      { action: 'User login', timestamp: '2025-04-04 08:00', user: 'John Doe' },
      { action: 'Property added', timestamp: '2025-04-04 09:00', user: 'Jane Smith' },
      { action: 'Payment processed', timestamp: '2025-04-04 10:00', user: 'John Doe' },
    ];
  }

  // Delete a log entry
  deleteLog(log: any): void {
    this.activityLogs = this.activityLogs.filter(l => l !== log);
  }
}
