// Core application types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

// API Response shapes
export type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    code: string;
  };
};

// Auth-specific types
export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  name: string;
};
