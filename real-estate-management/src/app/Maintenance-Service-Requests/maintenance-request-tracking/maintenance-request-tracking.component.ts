import { Component, OnInit } from '@angular/core';
import { MaintenanceRequest } from '../services/maintenance-request.model';
import { MaintenanceRequestService } from '../services/maintenance-request.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../authentication-user-management/services/auth.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface MediaFile {
  file_path: string;
  file_type: 'image' | 'video';
  [key: string]: any;
}

@Component({
  selector: 'app-maintenance-request-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-request-tracking.component.html',
  styleUrls: ['./maintenance-request-tracking.component.css'],
  providers: [DatePipe]
})
export class MaintenanceRequestTrackingComponent implements OnInit {
  requests: MaintenanceRequest[] = [];
  selectedRequest: MaintenanceRequest | null = null;
  statusOptions: string[] = ['Pending', 'In Progress', 'Completed'];
  technicians: { id: number, name: string }[] = [];
  userRole: string = '';
  fileToUpload: File | null = null;
  expandedRequests: { [key: number]: boolean } = {};
  statusEditEnabled: boolean = false;

  constructor(
    private maintenanceRequestService: MaintenanceRequestService,
    private authService: AuthService,
    private router: Router,
    private datePipe: DatePipe,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.loadRequests();
    this.loadTechnicians();
  }

  loadRequests(): void {
    this.maintenanceRequestService.getRequests().subscribe({
      next: (data) => {
        console.log('Fetched requests:', data);
  
        this.requests = data.map((req: any, i: number) => {
          console.log(`Request #${i} keys:`, Object.keys(req));
          console.log('Request #'+i+' full object:', req);
  
          const mediaArray = (req.media_json || []).map((media: any) => {
            const safePath = media.file_path || '';
            const safeType = media.file_type || 'image';
            console.log('Media URL:', this.getMediaUrl(safePath));
  
            return {
              ...media,
              file_type: safeType,
              file_path: safePath
            };
          });
  
          // Try all possible date keys for requestedAt
          const requestedAtValue =
            req.requested_at ? new Date(req.requested_at) :
            req.requestedAt ? new Date(req.requestedAt) :
            req.created_at ? new Date(req.created_at) :
            req.createdAt ? new Date(req.createdAt) :
            null;  // fallback since no date found
  
          // For completedAt, try both camelCase and snake_case
          const completedAtValue =
            req.completed_at ? new Date(req.completed_at) :
            req.completedAt ? new Date(req.completedAt) :
            null;
  
          console.log('Mapped requestedAt:', requestedAtValue);
          console.log('Mapped completedAt:', completedAtValue);
  
          return {
            ...req,
            description: req.issue_description || 'No description',
            requestedAt: requestedAtValue,
            completedAt: completedAtValue,
            media: mediaArray
          };
        });
  
        console.log('Requests with media and mapped dates:', this.requests);
      },
      error: (err) => {
        console.error('Error fetching requests', err);
        alert('Failed to fetch maintenance requests. Please try again later.');
      }
    });
  }
  

  loadTechnicians(): void {
    this.http.get<{ id: number, name: string }[]>('http://localhost:5000/technicians')
      .subscribe({
        next: (data) => {
          this.technicians = data;
          console.log('Technicians loaded:', this.technicians);
        },
        error: (err) => {
          console.error('Failed to load technicians:', err);
          alert('Could not load technician list.');
        }
      });
  }

  updateRequest(request: MaintenanceRequest): void {
    const updatedRequest = {
      ...request,
      status: this.selectedRequest?.status || 'Pending',
      assignedTo: this.selectedRequest?.assignedTo || null,
      description: this.selectedRequest?.description || 'No description'
    };

    if (updatedRequest.status === 'Completed' && !updatedRequest.completedAt) {
      updatedRequest.completedAt = new Date();
    }

    console.log('Sending update payload:', updatedRequest);

    const token = this.authService.getToken();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    this.http.put(`http://localhost:5000/maintenance-requests/${request.id}`, updatedRequest, { headers })
      .subscribe({
        next: () => {
          alert('Request updated successfully!');
          this.selectedRequest = null;
          this.loadRequests();
        },
        error: (err) => {
          console.error('Error updating request', err);
          alert('Failed to update request.');
        }
      });
  }

  selectRequest(request: MaintenanceRequest): void {
    let assignedTechnicianId = null;

    if (request.assignedTo) {
      assignedTechnicianId = request.assignedTo;
    } else if (request.technician_name) {
      const tech = this.technicians.find(t => t.name === request.technician_name);
      if (tech) {
        assignedTechnicianId = tech.id;
      }
    }

    this.selectedRequest = {
      ...request,
      assignedTo: assignedTechnicianId
    };

    this.statusEditEnabled = false;
  }

  enableStatusEdit(): void {
    this.statusEditEnabled = true;
  }

  navigateToTechnicianList(): void {
    this.router.navigate(['/technician-list']);
  }

  getMediaUrl(filePath: string): string {
    if (!filePath) {
      return 'assets/default-placeholder.jpg';
    }

    if (filePath.startsWith('http')) {
      return filePath;
    }

    return `http://localhost:5000${filePath.startsWith('/') ? filePath : '/' + filePath}`;
  }

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0];
  }

  onSubmit(form: any): void {
    const formData = new FormData();
    formData.append('description', form.description);

    if (this.fileToUpload) {
      formData.append('media', this.fileToUpload, this.fileToUpload.name);
    }

    this.http.post('http://localhost:5000/maintenance-request', formData).subscribe(
      (response: any) => {
        console.log('Response:', response);

        const now = new Date();
        const rawRequest = response.request || {};
        const mediaFiles: MediaFile[] = rawRequest.media || [];

        const newRequest: MaintenanceRequest = {
          ...rawRequest,
          description: rawRequest.issue_description || 'No description',
          media: mediaFiles.map((file) => ({
            ...file,
            file_path: file.file_path || '',
            file_type: file.file_type || 'image'
          })),
          requestedAt: rawRequest.requestedAt
            ? new Date(rawRequest.requestedAt)
            : (rawRequest.created_at ? new Date(rawRequest.created_at) : now),
          completedAt: rawRequest.completedAt ? new Date(rawRequest.completedAt) : null,
          createdAt: rawRequest.created_at ? new Date(rawRequest.created_at) : now
        };

        this.requests.unshift(newRequest);
        this.fileToUpload = null;
      },
      (error) => {
        console.error('Error uploading files:', error);
      }
    );
  }

  showMoreImages(request: MaintenanceRequest): void {
    const requestId = request.id;
    this.expandedRequests[requestId] = !this.expandedRequests[requestId];
  }

  isExpanded(request: MaintenanceRequest): boolean {
    return this.expandedRequests[request.id] || false;
  }
}
