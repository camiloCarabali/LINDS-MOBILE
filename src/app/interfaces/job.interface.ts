export interface Job {
  id: string;
  title: string;
  description: string;
  status: JobStatus;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type JobStatus = 
  | 'draft' 
  | 'published' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled' 
  | 'expired';

export interface JobApplication {
  id: string;
  jobId: string;
  driverId: string;
  status: ApplicationStatus;
  appliedAt: Date;
  message?: string;
  proposedPrice?: number;
}

export type ApplicationStatus = 
  | 'pending' 
  | 'accepted' 
  | 'rejected' 
  | 'withdrawn';

export interface JobSearchFilters {
  city?: string;
  state?: string;
  minPayment?: number;
  maxPayment?: number;
  search?: string;
}

export interface BackendJob {
  id: number;
  cliente_id: string;
  titulo: string;
  descripcion: string;
  origen: string;
  destino: string;
  tipo_carga: string;
  peso: number;
  precio: number;
  estado: BackendJobStatus;
  fecha_limite: string;
  created_at: string;
  updated_at: string;
}

export type BackendJobStatus = 
  | 'disponible' 
  | 'asignado' 
  | 'en_progreso' 
  | 'completado' 
  | 'cancelado';

export interface BackendJobApplication {
  id: number;
  job_id: number;
  driver_id: string;
  status: BackendApplicationStatus;
  message?: string;
  proposed_price?: number;
  applied_at: string;
  responded_at?: string;
}

export type BackendApplicationStatus = 
  | 'pendiente' 
  | 'aceptada' 
  | 'rechazada' 
  | 'retirada';

export interface JobApplicationResponse {
  id: number;
  job_id: number;
  message: string;
  status: string;
  applied_at: string;
}

export interface BackendDriverProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  vehicle_type: string;
  vehicle_plate: string;
  rating: number;
  completed_jobs: number;
  created_at: string;
  updated_at: string;
}

export interface DriverProfileUpdate {
  name?: string;
  phone?: string;
  license?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
}

export interface JobStats {
  total_applied: number;
  total_completed: number;
  total_earnings: number;
  rating: number;
  pending_applications: number;
}

export interface BackendJobSearchFilters {
  ciudad?: string;
  estado?: string;
  tipo_carga?: string;
  precio_min?: number;
  precio_max?: number;
  fecha_limite?: string;
  search?: string;
}