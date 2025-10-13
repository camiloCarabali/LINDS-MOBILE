import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import {
  BackendJob,
  BackendJobApplication,
  BackendJobSearchFilters,
  JobApplicationResponse,
  BackendDriverProfile,
  JobStats,
  ApiResponse,
  LoadingState
} from '../interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private readonly API_URL = environment.apiUrl;

  private availableJobsSubject = new BehaviorSubject<BackendJob[]>([]);
  public availableJobs$ = this.availableJobsSubject.asObservable();

  private myApplicationsSubject = new BehaviorSubject<BackendJobApplication[]>([]);
  public myApplications$ = this.myApplicationsSubject.asObservable();

  private activeJobSubject = new BehaviorSubject<BackendJob | null>(null);
  public activeJob$ = this.activeJobSubject.asObservable();

  private loadingStateSubject = new BehaviorSubject<LoadingState>({
    isLoading: false
  });
  public loadingState$ = this.loadingStateSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.getAvailableJobs();
    this.getMyApplications();
    this.getActiveJob();
  }

  getAvailableJobs(filters?: BackendJobSearchFilters): Observable<BackendJob[]> {
    this.setLoading(true);

    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            params = params.set(key, JSON.stringify(value));
          } else {
            params = params.set(key, value.toString());
          }
        }
      });
    }

    return this.http.get<ApiResponse<BackendJob[]>>(`${this.API_URL}/drivers/jobs/available`, { params })
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error getting jobs');
          }
          return response.data;
        }),
        tap(jobs => {
          this.availableJobsSubject.next(jobs);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setLoading(false, error.message);
          return throwError(error);
        })
      );
  }

  searchJobs(searchTerm: string, filters?: BackendJobSearchFilters): Observable<BackendJob[]> {
    const searchFilters = {
      ...filters,
      search: searchTerm
    };
    return this.getAvailableJobs(searchFilters);
  }

  getJobDetails(jobId: number): Observable<BackendJob> {
    return this.http.get<ApiResponse<BackendJob>>(`${this.API_URL}/drivers/jobs/${jobId}`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error getting job details');
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  applyToJob(jobId: number, message?: string, proposedPrice?: number): Observable<JobApplicationResponse> {
    const applicationData = {
      message,
      proposedPrice
    };

    return this.http.post<ApiResponse<JobApplicationResponse>>(`${this.API_URL}/drivers/jobs/${jobId}/apply`, applicationData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error applying to job');
          }
          return response.data;
        }),
        tap(() => {
          this.getMyApplications();
        }),
        catchError(this.handleError)
      );
  }

  getMyApplications(): Observable<BackendJobApplication[]> {
    return this.http.get<ApiResponse<BackendJobApplication[]>>(`${this.API_URL}/drivers/applications`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error getting applications');
          }
          return response.data;
        }),
        tap(applications => {
          this.myApplicationsSubject.next(applications);
        }),
        catchError(this.handleError)
      );
  }

  getActiveJob(): Observable<BackendJob | null> {
    return this.http.get<ApiResponse<BackendJob>>(`${this.API_URL}/drivers/active-job`)
      .pipe(
        map(response => {
          if (!response.success) {
            return null;
          }
          return response.data || null;
        }),
        tap(activeJob => {
          this.activeJobSubject.next(activeJob);
        }),
        catchError(() => {
          this.activeJobSubject.next(null);
          return throwError('Error getting active job');
        })
      );
  }

  getDriverProfile(): Observable<BackendDriverProfile> {
    return this.http.get<ApiResponse<BackendDriverProfile>>(`${this.API_URL}/drivers/profile`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error getting driver profile');
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  updateDriverProfile(profileData: any): Observable<BackendDriverProfile> {
    return this.http.put<ApiResponse<BackendDriverProfile>>(`${this.API_URL}/drivers/profile`, profileData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error updating driver profile');
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  getDriverStats(): Observable<JobStats> {
    return this.http.get<ApiResponse<JobStats>>(`${this.API_URL}/drivers/stats`)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error getting stats');
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  private setLoading(isLoading: boolean, error?: string): void {
    this.loadingStateSubject.next({
      isLoading,
      error,
      lastUpdated: new Date()
    });
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'Error desconocido';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('Job Service Error:', error);
    return throwError(errorMessage);
  };
}
