import API_ENDPOINTS from '../utils/apiConfig';

export interface ApiError {
  message: string;
  response?: {
    data: string;
  };
}

interface LoginResponse {
  message: string;
  user: {
    username: string;
    id: number;
    email: string;
    phone: string;
    role: string;
    patientName: string;
  };
}

export const authService = {
  login: async (credentials: { emailOrPhone: string; password: string }): Promise<LoginResponse> => {
    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw {
          message: 'Login failed',
          response: {
            data: errorData
          }
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }
}; 