// types/auth.ts
export interface AuthState {
    user: null | { 
      name: string;
      age: number;
      role: string;
      batch?: string;
      phone: string;
      emergencyContact?: string;
      address: string;
      username: string;
      email: string;
      password: string;
      __v: number;
    };
    token: string | null;
    error: string | null;
    loading: boolean;
  }
  
  export interface RegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    age: string;
    role: 'Student' | 'Teacher' | 'Intern';
    batch?: 'morning' | 'afternoon' | 'Both';
    phone: string;
    emergencyContact: string;
    address: string;
    username: string;
  }