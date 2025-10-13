import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { 
  BackendUser, 
  BackendLoginDto, 
  BackendRegisterDriverDto, 
  BackendAuthResponse, 
  ApiResponse,
  BackendSessionInfo 
} from '../interfaces';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<BackendUser | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private sessionSubject = new BehaviorSubject<BackendSessionInfo>({
    isLoggedIn: false,
    lastActivity: new Date()
  });
  public session$ = this.sessionSubject.asObservable();

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    try {
      const token = await this.storage.get(this.TOKEN_KEY);
      const user = await this.storage.get(this.USER_KEY);
      
      if (token && user && this.isTokenValid(token)) {
        this.currentUserSubject.next(user);
        this.updateSessionInfo({
          isLoggedIn: true,
          token,
          lastActivity: new Date()
        });
      } else {
        await this.clearAuthData();
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      await this.clearAuthData();
    }
  }

  login(credentials: BackendLoginDto): Observable<BackendUser> {
    return this.http.post<ApiResponse<BackendAuthResponse>>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error en login');
          }
          return response.data;
        }),
        tap(async (authResponse) => {
          await this.setAuthData(authResponse);
        }),
        map(authResponse => authResponse.user),
        catchError(this.handleError)
      );
  }

  register(driverData: BackendRegisterDriverDto): Observable<BackendUser> {
    return this.http.post<ApiResponse<BackendAuthResponse>>(`${this.API_URL}/auth/register`, driverData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error en registro');
          }
          return response.data;
        }),
        tap(async (authResponse) => {
          await this.setAuthData(authResponse);
        }),
        map(authResponse => authResponse.user),
        catchError(this.handleError)
      );
  }

  async logout(): Promise<void> {
    try {
      const token = await this.storage.get(this.TOKEN_KEY);
      if (token) {
        this.http.post(`${this.API_URL}/auth/logout`, {}).subscribe();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  refreshToken(): Observable<string> {
    return this.http.post<ApiResponse<{token: string, expiresIn: number}>>(`${this.API_URL}/auth/refresh`, {})
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error('Error refreshing token');
          }
          return response.data.token;
        }),
        tap(async (newToken) => {
          await this.storage.set(this.TOKEN_KEY, newToken);
          this.updateSessionInfo({
            isLoggedIn: true,
            token: newToken,
            lastActivity: new Date()
          });
        }),
        catchError((error) => {
          this.clearAuthData();
          return throwError(error);
        })
      );
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null && this.sessionSubject.value.isLoggedIn;
  }

  async getToken(): Promise<string | null> {
    return await this.storage.get(this.TOKEN_KEY);
  }

  getCurrentUser(): BackendUser | null {
    return this.currentUserSubject.value;
  }

  updateProfile(profileData: Partial<BackendUser>): Observable<BackendUser> {
    return this.http.put<ApiResponse<BackendUser>>(`${this.API_URL}/auth/profile`, profileData)
      .pipe(
        map(response => {
          if (!response.success || !response.data) {
            throw new Error(response.message || 'Error updating profile');
          }
          return response.data;
        }),
        tap(async (updatedUser) => {
          this.currentUserSubject.next(updatedUser);
          await this.storage.set(this.USER_KEY, updatedUser);
        }),
        catchError(this.handleError)
      );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<boolean> {
    return this.http.put<ApiResponse<boolean>>(`${this.API_URL}/auth/change-password`, {
      currentPassword,
      newPassword
    }).pipe(
      map(response => {
        if (!response.success) {
          throw new Error(response.message || 'Error changing password');
        }
        return true;
      }),
      catchError(this.handleError)
    );
  }

  private async setAuthData(authResponse: BackendAuthResponse): Promise<void> {
    await Promise.all([
      this.storage.set(this.TOKEN_KEY, authResponse.token),
      this.storage.set(this.USER_KEY, authResponse.user)
    ]);

    this.currentUserSubject.next(authResponse.user);
    this.updateSessionInfo({
      isLoggedIn: true,
      token: authResponse.token,
      lastActivity: new Date()
    });
  }

  private async clearAuthData(): Promise<void> {
    await Promise.all([
      this.storage.remove(this.TOKEN_KEY),
      this.storage.remove(this.REFRESH_TOKEN_KEY),
      this.storage.remove(this.USER_KEY)
    ]);

    this.currentUserSubject.next(null);
    this.updateSessionInfo({
      isLoggedIn: false,
      lastActivity: new Date()
    });
  }

  private updateSessionInfo(session: Partial<BackendSessionInfo>): void {
    const currentSession = this.sessionSubject.value;
    this.sessionSubject.next({
      ...currentSession,
      ...session
    });
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() < expirationTime;
    } catch {
      return false;
    }
  }

  private handleError = (error: any): Observable<never> => {
    let errorMessage = 'Error desconocido';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 401) {
      errorMessage = 'Credenciales inválidas';
    } else if (error.status === 403) {
      errorMessage = 'Acceso denegado';
    } else if (error.status === 500) {
      errorMessage = 'Error del servidor';
    }

    console.error('Auth Service Error:', error);
    return throwError(errorMessage);
  };
}
