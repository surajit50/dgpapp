export interface LoginRequest {
  email: string;
  password: string;
  code?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  error?: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    isTwoFactorEnabled: boolean;
  };
  twoFactorRequired?: boolean;
  emailVerificationRequired?: boolean;
}
