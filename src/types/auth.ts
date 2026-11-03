export interface UserProfile {
  id: number;
  username: string;
  name: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  avatar: string;
  role: string;
}

export interface LoginPayload {
  username: string; // DummyJSON auth requires username
  password: string;
  expiresInMins?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}
