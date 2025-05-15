import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tenant-directory',
  standalone: true,
  templateUrl: './tenant-directory.component.html',
  styleUrls: ['./tenant-directory.component.css'],
  imports: [CommonModule, RouterModule]
})
export class TenantDirectoryComponent implements OnInit {
  tenants: any[] = [];

  ngOnInit(): void {
    // Hardcoded list of tenants
    this.tenants = [
      {
        id: '1',
        name: 'John Doe',
        email: 'johndoe@example.com',
        property: {
          id: '1',
          name: 'Sunset Villa',
          address: '123 Sunset Blvd, Cityville, ST 12345'
        }
      },
      {
        id: '2',
        name: 'Jane Smiths',
        email: 'janesmith@example.com',
        property: {
          id: '2',
          name: '456 Oak Rd',
          address: '456 Oak Rd, Cityville, ST 67890'
        }
      }
    ];
  }
}
