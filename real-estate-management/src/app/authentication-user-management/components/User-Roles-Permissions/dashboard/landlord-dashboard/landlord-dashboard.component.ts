import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Country, State, City } from 'country-state-city';
import { ICountry } from 'country-state-city';
import { PropertyService } from '../../../../../Property-Management/services/property.service';

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './landlord-dashboard.component.html',
  styleUrls: ['./landlord-dashboard.component.css']
})
export class LandlordDashboardComponent implements OnInit {
  property: {
    name: string;
    title: string;
    description: string;
    price: number | null;
    country: string;
    state: string;        // changed from province to state
    city: string;
    street: string;
    status: string;
    type: string;
  } = {
    name: '',
    title: '',
    description: '',
    price: null,
    country: '',
    state: '',            // changed here too
    city: '',
    street: '',
    status: 'Available',
    type: ''
  };

  selectedFiles: File[] = [];

  countries: { name: string; isoCode: string }[] = [];
  states: { name: string; isoCode: string }[] = [];      // renamed provinces → states
  availableCities: { name: string }[] = [];

  currencyCode: string = 'USD'; // default currency

  constructor(
    private http: HttpClient,
    private propertyService: PropertyService
  ) {}

  ngOnInit() {
    this.countries = Country.getAllCountries();
  }

  onCountryChange() {
    this.states = [];
    this.availableCities = [];
    this.property.state = '';   // reset state
    this.property.city = '';    // reset city

    if (this.property.country) {
      this.states = State.getStatesOfCountry(this.property.country);

      const selectedCountry: ICountry | undefined = Country.getCountryByCode(this.property.country);
      if (selectedCountry && selectedCountry.currency) {
        this.currencyCode = selectedCountry.currency;
      } else {
        this.currencyCode = 'USD'; // fallback if currency not found
      }
    }
  }

  onStateChange() {
    this.availableCities = [];
    this.property.city = '';

    if (this.property.state) {
      this.availableCities = City.getCitiesOfState(this.property.country, this.property.state);
    }
  }

  onFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  private getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  submitProperty() {
    const token = this.getToken();
    if (!token) {
      alert('🔐 Token not found. Please login.');
      return;
    }

    const requiredFields: (keyof typeof this.property)[] = [
      'name',
      'title',
      'description',
      'price',
      'country',
      'state',      // changed from province to state
      'city',
      'street',
      'type'
    ];

    for (const field of requiredFields) {
      const value = this.property[field];
      if (value === null || value === undefined || value === '') {
        alert(`❌ Missing required field: ${field}`);
        return;
      }
    }

    const formData = new FormData();
    for (const key in this.property) {
      if (Object.prototype.hasOwnProperty.call(this.property, key)) {
        const value = this.property[key as keyof typeof this.property];
        formData.append(key, value != null ? value.toString() : '');
      }
    }

    formData.append('currency', this.currencyCode);

    if (this.selectedFiles.length > 0) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append('images', this.selectedFiles[i]);
      }
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    this.http.post('http://localhost:5000/api/properties', formData, { headers }).subscribe({
      next: (response) => {
        console.log('✅ Property added:', response);
        alert('✅ Property added successfully!');
        this.resetForm();
      },
      error: (error) => {
        console.error('❌ Failed to add property:', error);
        alert(`❌ Failed to add property: ${error.status} ${error.statusText}`);
      }
    });
  }

  resetForm() {
    this.property = {
      name: '',
      title: '',
      description: '',
      price: null,
      country: '',
      state: '',      // reset state
      city: '',
      street: '',
      status: 'Available',
      type: ''
    };
    this.selectedFiles = [];
    this.states = [];
    this.availableCities = [];
    this.currencyCode = 'USD'; // reset currency to default
  }
}
