import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';  // Import FormsModule

@Component({
  selector: 'app-profile-management',
  standalone: true,
  templateUrl: './profile-management.component.html',
  styleUrls: ['./profile-management.component.css'],
  imports: [FormsModule]  // Add FormsModule to the imports array
})
export class ProfileManagementComponent implements OnInit {
  user = {
    name: '',
    email: '',
    password: ''  // You may want to handle password securely
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // On initialization, load the current user details (mock example)
    const currentUserRole = this.authService.getRole();
    if (currentUserRole) {
      // Example data; Replace with actual API call to fetch user data
      this.user.name = 'John Doe';
      this.user.email = 'johndoe@example.com';
    }
  }

  onSubmit() {
    // Call API to update the profile
    this.authService.updateProfile(this.user).subscribe(
      response => {
        alert('Profile updated successfully!');
      },
      error => {
        alert('Error updating profile.');
      }
    );
  }
}
