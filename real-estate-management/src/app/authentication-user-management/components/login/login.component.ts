import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from '../register/register.component';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt'; // <-- Updated

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RegisterComponent],
  providers: [
    JwtHelperService,
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS } // <-- Fix for NullInjectorError
  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showRegister: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private jwtHelper: JwtHelperService
  ) {}

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.authService.login(this.email, this.password).subscribe(
      (response: any) => {
        console.log('Login successful:', response);
        this.authService.handleLoginResponse(response);

        const token = response.token;
        const isExpired = this.jwtHelper.isTokenExpired(token);
        if (isExpired) {
          console.log('Token is expired');
        } else {
          console.log('Token is valid');
        }

        this.redirectUser(response.role);
      },
      (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid email or password';
      }
    );
  }

  redirectUser(role: string): void {
    console.log('Redirecting to role:', role);
    switch (role) {
      case 'admin':
        this.router.navigate(['/admin-panel']).then(() => {
          this.changeDetectorRef.detectChanges();
        });
        break;
      case 'tenant':
        this.router.navigate(['/tenant-dashboard']);
        break;
      case 'landlord':
        this.router.navigate(['/landlord-dashboard']);
        break;
      case 'property-manager':
        this.router.navigate(['/property-manager-dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }

  openRegister(): void {
    this.showRegister = true;
  }

  closeRegister(): void {
    this.showRegister = false;
  }
}
