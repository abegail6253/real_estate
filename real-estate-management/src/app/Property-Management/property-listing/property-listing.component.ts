import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-listing',
  standalone: true,
  templateUrl: './property-listing.component.html',
  styleUrls: ['./property-listing.component.css'],
  imports: [CommonModule, RouterModule]
})
export class PropertyListingComponent implements OnInit {
  properties: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Hardcoded list of properties
    this.properties = [
      {
        id: '1',
        name: 'Sunset Villa',
        address: '123 Sunset Blvd, Cityville, ST 12345',
        type: 'House',
        rentPrice: 1200,
        status: 'Available'
      },
      {
        id: '2',
        name: '456 Oak Rd',
        address: '456 Oak Rd, Cityville, ST 67890',
        type: 'House',
        rentPrice: 1500,
        status: 'Rented'
      },
      {
        id: '3',
        name: '789 Pine Ave',
        address: '789 Pine Ave, Cityville, ST 98765',
        type: 'Condo',
        rentPrice: 1000,
        status: 'Available'
      },
      {
        id: '4',
        name: 'Sunset Blvd House',
        address: '123 Sunset Blvd, Cityville, ST 12345',
        type: 'House',
        rentPrice: 1200,
        status: 'Rented'
      }
    ];
  }

  viewDetails(id: string) {
    this.router.navigate(['/property-details', id]);
  }
}
