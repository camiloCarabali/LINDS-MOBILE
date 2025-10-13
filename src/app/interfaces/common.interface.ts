export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
  lastUpdated?: Date;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: Date;
}

export interface SessionInfo {
  isLoggedIn: boolean;
  token?: string;
  refreshToken?: string;
  expiresAt?: Date;
  lastActivity?: Date;
}