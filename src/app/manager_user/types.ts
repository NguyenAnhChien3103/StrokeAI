export interface User {
  userId: string;
  username: string;
  roles: string[];
  patientName: string;  
  dateOfBirth: string;
  gender: number;
  phone: string;
  email: string;
  token: string;
  status: string;
  isActive: boolean;
  is_active: number; 
  accountStatus: string; 
  isLocked: boolean; 
} 