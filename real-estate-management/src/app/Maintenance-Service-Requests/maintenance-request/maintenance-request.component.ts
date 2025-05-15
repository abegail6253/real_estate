import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaintenanceRequestService } from '../services/maintenance-request.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance-request',
  standalone: true,
  templateUrl: './maintenance-request.component.html',
  styleUrls: ['./maintenance-request.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class MaintenanceRequestComponent {
  maintenanceForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private maintenanceRequestService: MaintenanceRequestService,
    private router: Router
  ) {
    this.maintenanceForm = this.fb.group({
      issueDescription: ['', Validators.required],
      urgency: ['low', Validators.required],
      status: ['pending', Validators.required],
      media: [null],
    });
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  onSubmit(): void {
    if (this.maintenanceForm.invalid) {
      alert('Please fill out all required fields!');
      return;
    }

    const formValues = this.maintenanceForm.value;
    console.log('Form Values:', formValues); // ✅ Debug form values

    // Defensive check (optional, but helpful)
    if (!formValues.issueDescription || !formValues.urgency) {
      alert('Missing required form data.');
      return;
    }

    const formData = new FormData();
    formData.append('issueDescription', formValues.issueDescription);
    formData.append('urgency', formValues.urgency);
    formData.append('status', formValues.status || 'pending');

    this.selectedFiles.forEach((file: File) => {
      formData.append('media', file, file.name);
    });

    // Debugging: log FormData entries
    console.log('Submitting FormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    this.maintenanceRequestService.submitRequest(formData).subscribe({
      next: (response) => {
        console.log('✅ Maintenance request submitted successfully', response);
        alert('Maintenance request submitted successfully!');
        this.maintenanceForm.reset();
        this.selectedFiles = [];
        this.router.navigate(['/maintenance-tracking']);
      },
      error: (error) => {
        console.error('❌ Error submitting maintenance request', error);
        alert('Failed to submit maintenance request!');
      },
    });
  }
}
