import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class RegisterComponent {
  @Output() closeModal = new EventEmitter<void>();

  fullName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'landlord'; // Only landlord can register
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient) {}

  onRegister(): void {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    const payload = {
      email: this.email,
      password: this.password,
      role: this.role // always "landlord"
    };

    this.http.post('http://localhost:5000/api/register', payload).subscribe({
      next: (res) => {
        this.successMessage = 'Registered successfully!';
        this.errorMessage = '';
        setTimeout(() => this.closeModal.emit(), 2000);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Registration failed. Try again.';
      }
    });
  }
}

