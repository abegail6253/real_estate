import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';  // Required for standalone components

@Component({
  selector: 'app-register',
  standalone: true,  // Marking it as a standalone component
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule]  // Import necessary modules like CommonModule for directives
})
export class RegisterComponent {
  @Output() closeModal = new EventEmitter<void>();  // Event emitter to close the modal
}
