import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';

@Component({
  selector: 'app-tenant-invite',
  standalone: true,
  imports: [CommonModule, QRCodeComponent],
  templateUrl: './tenant-invite.component.html',
  styleUrls: ['./tenant-invite.component.css']
})
export class TenantInviteComponent {
  inviteLink: string | null = null;

  generateInvite() {
    this.inviteLink = 'https://yourapp.com/register?invite=ABC123';
  }

  reset() {
    this.inviteLink = null;
  }
}
