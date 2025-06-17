import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeComponent } from 'angularx-qrcode';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tenant-invite',
  standalone: true,
  imports: [CommonModule, QRCodeComponent, HttpClientModule],
  templateUrl: './tenant-invite.component.html',
  styleUrls: ['./tenant-invite.component.css']
})
export class TenantInviteComponent {
  inviteLink: string | null = null;
  private http = inject(HttpClient);

  generateInvite() {
    this.http.post<{ inviteLink: string }>('http://localhost:5000/api/invite', {})
      .subscribe({
        next: (res) => this.inviteLink = res.inviteLink,
        error: (err) => {
          console.error('Failed to generate invite', err);
          alert('Failed to generate invite link. Please try again later.');
        }
      });
  }

  reset() {
    this.inviteLink = null;
  }
}
