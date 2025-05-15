import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css'],
  standalone: true
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/login']); // Navigate to the login page
  }
}
