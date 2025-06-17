import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Country, State, City } from 'country-state-city';
import getSymbolFromCurrency from 'currency-symbol-map';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-property-listing',
  standalone: true,
  templateUrl: './property-listing.component.html',
  styleUrls: ['./property-listing.component.css'],
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule]
})
export class PropertyListingComponent implements OnInit {
  property = {
    name: '',
    title: '',
    description: '',
    price: null,
    country: '',
    state: '',
    city: '',
    street: '',
    status: '',
    type: ''
  };

  selectedFiles: File[] = [];
  countries: { name: string; isoCode: string }[] = [];
  states: { name: string; isoCode: string }[] = [];
  cities: { name: string }[] = [];

  filters = {
    country: '',
    state: '',
    city: '',
    minPrice: 0,
    maxPrice: 9999999999999999999,
    type: ''
  };

  currencyCode = 'USD';
  properties: any[] = [];
  currentPage = 1;
  limit = 10;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.countries = Country.getAllCountries();
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchPropertiesWithFilters();
  }

  onFilesSelected(event: any): void {
    this.selectedFiles = Array.from(event.target.files);
  }

  submitProperty(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('🔐 Token not found. Please login.');
      this.router.navigate(['/login']);
      return;
    }

    const requiredFields: (keyof typeof this.property)[] = [
      'name', 'title', 'description', 'price', 'country', 'state', 'city', 'street', 'type'
    ];

    for (const field of requiredFields) {
      if (!this.property[field]) {
        alert(`❌ Missing required field: ${field}`);
        return;
      }
    }

    const formData = new FormData();
    for (const key in this.property) {
      formData.append(key, this.property[key as keyof typeof this.property]?.toString() || '');
    }
    formData.append('currency', this.currencyCode);
    this.selectedFiles.forEach(file => formData.append('images', file));

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post('http://localhost:5000/api/properties', formData, { headers }).subscribe({
      next: () => {
        alert('✅ Property added successfully!');
        this.resetForm();
        this.currentPage = 1;
        this.fetchPropertiesWithFilters(() => {
          setTimeout(() => {
            const lastProperty = this.properties[0]; // Assuming newest is first
            const element = document.getElementById('property-' + lastProperty.id);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        });
      },
      error: err => {
        console.error('❌ Failed to add property:', err);
        alert(`❌ Error: ${err.status} ${err.statusText}`);
      }
    });
  }

  resetForm(): void {
    this.property = {
      name: '',
      title: '',
      description: '',
      price: null,
      country: '',
      state: '',
      city: '',
      street: '',
      status: 'Available',
      type: ''
    };
    this.selectedFiles = [];
    this.states = [];
    this.cities = [];
    this.currencyCode = 'USD';
  }

  onCountryChange(): void {
    this.states = [];
    this.cities = [];
    this.filters.state = '';
    this.filters.city = '';
    this.property.state = '';
    this.property.city = '';

    if (this.filters.country) {
      this.states = State.getStatesOfCountry(this.filters.country);
    }

    if (this.property.country) {
      this.states = State.getStatesOfCountry(this.property.country);
      const selectedCountry = Country.getCountryByCode(this.property.country);
      this.currencyCode = selectedCountry?.currency || 'USD';
    }
  }

  onStateChange(): void {
    this.cities = [];
    this.filters.city = '';
    this.property.city = '';

    if (this.filters.country && this.filters.state) {
      this.cities = City.getCitiesOfState(this.filters.country, this.filters.state);
    }

    if (this.property.country && this.property.state) {
      this.cities = City.getCitiesOfState(this.property.country, this.property.state);
    }
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.fetchPropertiesWithFilters();
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchPropertiesWithFilters();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.fetchPropertiesWithFilters();
  }

  fetchPropertiesWithFilters(callback?: () => void): void {
  const token = localStorage.getItem('token');
  if (!token) {
    this.router.navigate(['/login']);
    return;
  }

  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  // 🔧 Fix: Use a high maxPrice if not explicitly set by the user
  const minPrice = this.filters.minPrice ?? 0;
  const maxPrice = this.filters.maxPrice && this.filters.maxPrice > 0 ? this.filters.maxPrice : 9999999999999999999;

  const queryParams = new URLSearchParams({
    city: this.filters.city,
    state: this.filters.state,
    country: this.filters.country,
    minPrice: String(minPrice),
    maxPrice: String(maxPrice),
    type: this.filters.type,
    page: String(this.currentPage),
    limit: String(this.limit)
  });

  this.http.get<any[]>(`http://localhost:5000/api/properties?${queryParams}`, { headers }).subscribe({
    next: (data) => {
      this.properties = data.filter(p =>
        p.status?.toLowerCase() === 'available' || p.status?.toLowerCase() === 'rented'
      );
      if (callback) callback();
    },
    error: (err) => {
      if (err.status === 401 || err.status === 403) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      } else {
        alert(`Error ${err.status}: ${err.error?.message || 'Unknown error'}`);
      }
    }
  });
}


  deleteProperty(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this property?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('🔐 Token not found. Please login.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`http://localhost:5000/api/properties/${id}`, { headers }).subscribe({
      next: () => {
        alert('🗑️ Property deleted successfully');
        this.fetchPropertiesWithFilters();
      },
      error: (err) => {
        console.error('❌ Failed to delete property:', err);
        alert(`❌ Error: ${err.status} ${err.statusText}`);
      }
    });
  }

  deleteAllProperties(): void {
    const confirmed = confirm('⚠️ This will delete ALL your properties. Are you sure?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('🔐 Token not found. Please login.');
      this.router.navigate(['/login']);
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.delete(`http://localhost:5000/api/properties`, { headers }).subscribe({
      next: (response: any) => {
        alert(`🧹 ${response.message}`);
        this.fetchPropertiesWithFilters();
      },
      error: (err) => {
        console.error('❌ Failed to delete all properties:', err);
        alert(`❌ Error: ${err.status} ${err.statusText}`);
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/property-details', id]);
  }

  formatStatus(status: string): string {
    if (!status) return 'Unknown';
    const s = status.toLowerCase();
    if (s === 'available') return 'Available';
    if (s === 'rented') return 'Rented';
    return 'Unknown';
  }

  getCountryCode(property: any): string | null {
    if (property.country) {
      return property.country.toUpperCase();
    }
    if (property.address) {
      const parts = property.address.split(',').map((part: string) => part.trim());
      const possibleCountry = parts[parts.length - 1];
      if (possibleCountry && possibleCountry.length === 2) {
        return possibleCountry.toUpperCase();
      }
    }
    return null;
  }

  getCurrencySymbolFromCountry(countryCode: string | null): string {
    if (!countryCode) return '';
    const country = Country.getCountryByCode(countryCode);
    if (!country) return '';
    const currencyCode = country.currency;
    if (!currencyCode) return '';

    const symbol = getSymbolFromCurrency(currencyCode);
    if (symbol && symbol !== currencyCode) {
      return symbol;
    }
    return currencyCode + ' ';
  }
}
