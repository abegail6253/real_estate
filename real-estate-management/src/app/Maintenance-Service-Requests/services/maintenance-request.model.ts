export interface MaintenanceRequest {
  id: number;
  title?: string | null;
  description?: string | null;
  issue_description: string;
  status: string | null;
  assignedTo?: number | null;
  propertyId?: number;
  images: Array<{ file_type: 'image' | 'video'; file_path: string }>;  // Array for images and videos
  createdAt?: Date | null;
  requestedAt: Date | null;  // Changed to Date | null for consistency
  completedAt?: Date | null;  // Changed to Date | null for consistency
  media: Array<{ file_type: 'image' | 'video'; file_path: string }> | null;  // Consistent structure for media
  media_json?: any[];  // Optional field, if additional data needs to be stored
  file_path?: string;  // Optional, for direct file path
  technician_name?: string;  // Added technician_name to store the technician's name
  assignedToId?: number; // Optional: Added if technician_id or similar is used
}
