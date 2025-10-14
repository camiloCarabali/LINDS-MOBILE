import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

export interface DriverProfile {
  user_id: string;
  vehicle_type: string;
  vehicle_plate: string;
  vehicle_capacity_kg: number;
  vehicle_year?: number;
  vehicle_photo_url?: string;
  license_number: string;
  license_category: string;
  license_expiry_date: string; // ISO date string
  license_photo_url?: string;
  phone: string;
  city: string;
  years_experience: number;
  description?: string;
  rating: number;
  total_trips: number;
  completed_trips: number;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DriverProfileCreate {
  vehicle_type: string;
  vehicle_plate: string;
  vehicle_capacity_kg: number;
  vehicle_year?: number;
  vehicle_photo_url?: string;
  license_number: string;
  license_category: string;
  license_expiry_date: string; // ISO date format: YYYY-MM-DD
  license_photo_url?: string;
  phone: string;
  city: string;
  years_experience: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private apiUrl = `${environment.apiUrl}/drivers`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  /**
   * Verificar si el conductor tiene un perfil completo
   * Retorna el perfil si existe, null si no existe (404)
   */
  checkProfile(): Observable<DriverProfile | null> {
    return from(this.storage.get('auth_token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return new Observable<DriverProfile | null>(observer => {
          this.http.get<DriverProfile>(`${this.apiUrl}/profile`, { headers })
            .subscribe({
              next: (profile) => {
                console.log('Driver profile found:', profile);
                observer.next(profile);
                observer.complete();
              },
              error: (error) => {
                if (error.status === 404) {
                  // Perfil no existe, usuario nuevo
                  console.log('Driver profile not found (new user)');
                  observer.next(null);
                  observer.complete();
                } else {
                  // Otro error
                  console.error('Error checking profile:', error);
                  observer.error(error);
                }
              }
            });
        });
      })
    );
  }

  /**
   * Crear perfil de conductor nuevo
   */
  createProfile(profile: DriverProfileCreate): Observable<DriverProfile> {
    return from(this.storage.get('auth_token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.post<DriverProfile>(`${this.apiUrl}/profile`, profile, { headers });
      })
    );
  }

  /**
   * Obtener perfil de conductor
   */
  getProfile(): Observable<DriverProfile> {
    return from(this.storage.get('auth_token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });

        return this.http.get<DriverProfile>(`${this.apiUrl}/profile`, { headers });
      })
    );
  }

  /**
   * Actualizar perfil de conductor
   */
  updateProfile(profile: Partial<DriverProfileCreate>): Observable<DriverProfile> {
    return from(this.storage.get('auth_token')).pipe(
      switchMap(token => {
        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return this.http.put<DriverProfile>(`${this.apiUrl}/profile`, profile, { headers });
      })
    );
  }
}
