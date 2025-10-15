import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import {
  EnvioApplication,
  EnvioApplicationCreate,
  EnvioApplicationWithDetails,
  Envio
} from '../interfaces/job-application.interface';

@Injectable({
  providedIn: 'root'
})
export class JobApplicationService {
  private baseUrl = `${environment.apiUrl}/job-applications`;
  private enviosUrl = `${environment.apiUrl}/envios`;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {}

  private getHeaders(): Observable<HttpHeaders> {
    return from(this.storage.get('auth_token')).pipe(
      switchMap(token => {
        console.log('🔑 Token obtenido del storage:', token ? token.substring(0, 20) + '...' : 'NULL');
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        return [headers];
      })
    );
  }

  /**
   * Aplicar a un envío
   */
  aplicarAEnvio(application: EnvioApplicationCreate): Observable<EnvioApplication> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.post<EnvioApplication>(this.baseUrl, application, { headers }))
    );
  }

  /**
   * Obtener mis aplicaciones como conductor
   */
  getMisAplicaciones(): Observable<EnvioApplicationWithDetails[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<EnvioApplicationWithDetails[]>(`${this.baseUrl}/mis-aplicaciones`, { headers }))
    );
  }

  /**
   * Cancelar una aplicación
   */
  cancelarAplicacion(applicationId: number): Observable<any> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.delete(`${this.baseUrl}/${applicationId}`, { headers }))
    );
  }

  /**
   * Obtener envíos disponibles (sin conductor asignado)
   */
  getEnviosDisponibles(): Observable<Envio[]> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<Envio[]>(`${this.enviosUrl}/disponibles`, { headers }))
    );
  }

  /**
   * Obtener envíos con filtros
   */
  getEnvios(params?: { estado?: string, conductor_id?: string }): Observable<Envio[]> {
    return this.getHeaders().pipe(
      switchMap(headers => {
        let url = this.enviosUrl;
        if (params) {
          const queryParams = new URLSearchParams();
          if (params.estado) queryParams.append('estado', params.estado);
          if (params.conductor_id) queryParams.append('conductor_id', params.conductor_id);
          const queryString = queryParams.toString();
          if (queryString) url += `?${queryString}`;
        }
        return this.http.get<Envio[]>(url, { headers });
      })
    );
  }

  /**
   * Obtener detalle de un envío específico
   */
  getEnvioDetalle(envioId: number): Observable<Envio> {
    return this.getHeaders().pipe(
      switchMap(headers => this.http.get<Envio>(`${this.enviosUrl}/${envioId}`, { headers }))
    );
  }

  /**
   * Cambiar el estado de un envío
   */
  cambiarEstadoEnvio(envioId: number, nuevoEstado: string): Observable<Envio> {
    return this.getHeaders().pipe(
      switchMap(headers => 
        this.http.patch<Envio>(
          `${this.enviosUrl}/${envioId}/estado`,
          { estado: nuevoEstado },
          { headers }
        )
      )
    );
  }
}
