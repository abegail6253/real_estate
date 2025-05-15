import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-details',
  standalone: true,
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],
  imports: [CommonModule]
})
export class PropertyDetailsComponent implements OnInit {
  property: any = {
    name: '',
    address: '',
    type: '',
    rentPrice: 0,
    images: [],
    leaseStartDate: '',
    leaseEndDate: '',
    leaseAgreement: '',
    tenantName: '',
    tenantContact: '',
    status: '' // Added status here
  };

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.loadPropertyDetails(propertyId);
    }
  }

  loadPropertyDetails(propertyId: string): void {
    const property = this.getMockPropertyDetails(propertyId);
    this.property = property;
  }

  getMockPropertyDetails(propertyId: string): any {
    const mockProperties = [
      {
        id: '1',
        name: 'Sunset Villa',
        address: '123 Sunset Blvd, Cityville, ST 12345',
        type: 'House',
        rentPrice: 1200,
        images: [
          'https://via.placeholder.com/600x400.png?text=Property+Image+1',
          'https://via.placeholder.com/600x400.png?text=Property+Image+2'
        ],
        leaseStartDate: '', // No lease start for available property
        leaseEndDate: '',   // No lease end for available property
        leaseAgreement: '',
        tenantName: '',      // Empty tenant info for available property
        tenantContact: '',   // Empty tenant info for available property
        status: 'Available'  // Status is available
      },
      {
        id: '2',
        name: '456 Oak Rd',
        address: '456 Oak Rd, Cityville, ST 67890',
        type: 'House',
        rentPrice: 1500,
        images: [
          'https://via.placeholder.com/600x400.png?text=Property+Image+1',
          'https://via.placeholder.com/600x400.png?text=Property+Image+2'
        ],
        leaseStartDate: '2023-01-01',
        leaseEndDate: '2024-01-01',
        leaseAgreement: 'https://example.com/lease-agreement.pdf',
        tenantName: 'Jane Smith',
        tenantContact: '098-765-4321',
        status: 'Rented'
      },
      {
        id: '3',
        name: 'Pine Condo',
        address: '789 Pine Ave, Cityville, ST 54321',
        type: 'Condo',
        rentPrice: 1000,
        images: [
          'https://via.placeholder.com/600x400.png?text=Property+Image+1',
          'https://via.placeholder.com/600x400.png?text=Property+Image+2'
        ],
        leaseStartDate: '', // No lease start for available property
        leaseEndDate: '',   // No lease end for available property
        leaseAgreement: '',
        tenantName: '',      // Empty tenant info for available property
        tenantContact: '',   // Empty tenant info for available property
        status: 'Available'
      },
      {
        id: '4',
        name: 'Sunset Blvd House',
        address: '123 Sunset Blvd, Cityville, ST 12345',
        type: 'House',
        rentPrice: 1200,
        images: [
          'https://via.placeholder.com/600x400.png?text=Property+Image+1',
          'https://via.placeholder.com/600x400.png?text=Property+Image+2'
        ],
        leaseStartDate: '2023-01-01',
        leaseEndDate: '2024-01-01',
        leaseAgreement: 'https://example.com/lease-agreement.pdf',
        tenantName: 'Jane Doe',  // Tenant info for rented property
        tenantContact: '123-456-7890',
        status: 'Rented'
      }
    ];
    return mockProperties.find(p => p.id === propertyId);
  }

  goBack(): void {
    this.router.navigate(['/property-listing']);
  }
}
