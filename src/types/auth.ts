export interface UserLogin {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserSession {
  username: string;
  token: string;
  exp?: number;
}
