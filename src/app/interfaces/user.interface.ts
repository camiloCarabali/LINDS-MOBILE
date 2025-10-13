export interface User {
  id: string;
  email: string;
  profile: DriverProfile;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  license: string;
  licenseType: 'C1' | 'C2' | 'C3';
  rating: number;
  totalJobs: number;
  totalEarnings: number;
  isVerified: boolean;
}

export interface RegisterDriverDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  license: string;
  licenseType: 'C1' | 'C2' | 'C3';
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: BackendUserRole;
  created_at: string;
  updated_at: string;
}

export type BackendUserRole = 'cliente' | 'conductor';

export interface UserCreate {
  email: string;
  name: string;
  phone: string;
  role: BackendUserRole;
}

export interface BackendAuthResponse {
  token: string;
  user: BackendUser;
}

export interface BackendLoginDto {
  email: string;
  password: string;
}

export interface BackendRegisterDriverDto {
  name: string;
  email: string;
  phone: string;
  license: string;
  vehicle_type: string;
}

export interface BackendSessionInfo {
  isLoggedIn: boolean;
  token?: string;
  lastActivity: Date;
  expiresAt?: Date;
}