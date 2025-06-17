import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-details',
  standalone: true,
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
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
    tenantEmail: '',
    status: ''
  };

  tenants: any[] = [];
  assignTenantForm: FormGroup;
  loadingTenants = false;
  assigningTenant = false;
  assignSuccess = '';
  assignError = '';

  isAssignTenantEnabled = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.assignTenantForm = this.fb.group({
      tenantId: ['', Validators.required],
      leaseStartDate: ['', Validators.required],
      leaseEndDate: ['', Validators.required],
      leaseAgreementUrl: ['']
    });
  }

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      this.loadPropertyDetails(propertyId);
      this.loadTenants();
    }
  }

  get token() {
    return localStorage.getItem('token');
  }

  get headers() {
    return { headers: new HttpHeaders({ Authorization: `Bearer ${this.token}` }) };
  }

  loadPropertyDetails(propertyId: string): void {
  if (!this.token) {
    this.router.navigate(['/login']);
    return;
  }

  this.http.get<any>(`http://localhost:5000/api/properties/${propertyId}`, this.headers).subscribe({
    next: (data) => {
      console.log('Property image_url:', data.image_url); // Debug log

      let images: string[] = [];
      if (data.image_url) {
        if (data.image_url.startsWith('http')) {
          images = [data.image_url];
        } else {
          images = [`http://localhost:5000/${data.image_url}`];
        }
      }

      this.property = {
        ...data,
        rentPrice: data.price || 0,
        images,
        tenantName: data.tenantName || '',
        tenantContact: data.tenantContact || '',
        tenantEmail: data.tenantEmail || '',
        status: data.status || '',
      };
    },
    error: (err) => {
      console.error('❌ Failed to fetch property details:', err);
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      } else if (err.status === 404) {
        alert('Property not found or you do not have permission to view it.');
        this.router.navigate(['/property-listing']);
      } else {
        alert(`Error ${err.status}: ${err.error?.message || 'Unknown error'}`);
      }
    }
  });
}


  loadTenants(): void {
    if (!this.token) return;
    this.loadingTenants = true;
    this.http.get<any[]>('http://localhost:5000/api/users/tenants', this.headers).subscribe({
      next: (data) => {
        this.tenants = data;
        this.loadingTenants = false;
      },
      error: (err) => {
        console.error('❌ Failed to fetch tenants:', err);
        this.loadingTenants = false;
      }
    });
  }

  assignTenant(): void {
    if (this.assignTenantForm.invalid) {
      this.assignError = 'Please fill all required fields.';
      return;
    }
    this.assignError = '';
    this.assignSuccess = '';
    this.assigningTenant = true;

    const propertyId = this.route.snapshot.paramMap.get('id');
    if (!propertyId) {
      this.assignError = 'Property ID is missing.';
      this.assigningTenant = false;
      return;
    }

    this.http.post(`http://localhost:5000/api/properties/${propertyId}/assign-tenant`, this.assignTenantForm.value, this.headers).subscribe({
      next: () => {
        this.assignSuccess = 'Tenant assigned successfully!';
        this.assigningTenant = false;
        this.isAssignTenantEnabled = false;
        this.loadPropertyDetails(propertyId);
      },
      error: (err) => {
        console.error('❌ Failed to assign tenant:', err);
        this.assignError = err.error?.message || 'Failed to assign tenant';
        this.assigningTenant = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/property-listing']);
  }
}
