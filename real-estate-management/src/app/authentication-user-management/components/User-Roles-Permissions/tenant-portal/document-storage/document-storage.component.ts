// src/app/authentication-user-management/components/User-Roles-Permissions/tenant-portal/document-storage/document-storage.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule to use *ngIf
import { ReactiveFormsModule } from '@angular/forms';  // If necessary, import other modules

@Component({
  selector: 'app-document-storage',
  standalone: true,  // Marking this as a standalone component
  imports: [CommonModule, ReactiveFormsModule],  // Add CommonModule to enable *ngIf
  templateUrl: './document-storage.component.html',
  styleUrls: ['./document-storage.component.css']
})
export class DocumentStorageComponent implements OnInit {

  documents: any[] = [];  // Array to store uploaded documents
  selectedFiles: FileList | null = null;  // Selected files for upload

  // Handle file selection
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  // Upload documents (for now, just adding them to an array)
  uploadDocuments(): void {
    if (this.selectedFiles) {
      Array.from(this.selectedFiles).forEach(file => {
        const document = {
          name: file.name,
          url: URL.createObjectURL(file), // Simulating file URL
          file: file
        };
        this.documents.push(document);
      });
    }
  }

  // Delete a document
  deleteDocument(document: any): void {
    this.documents = this.documents.filter(doc => doc !== document);
  }

  ngOnInit(): void {
    // Initialize any data if needed
  }
}
