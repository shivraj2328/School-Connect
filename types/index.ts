import store from '@/redux/store';
import { AuthState } from './auth';

// Define RootState type based on your Redux store
export type RootState = {
  auth: AuthState;
  // Add other slice states here if you have them
};

// Navigation type definition
export type RootStackParamList = {
  index: undefined;
  'message-teacher': undefined;
  'view-homework': undefined;
};

// Registration form data type
export interface RegisterFormData {
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
}