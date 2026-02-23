
import { UserRole } from '../types';
import { FOUNDER_CREDENTIALS } from '../config/constants';

/**
 * AUTH SERVICE
 * REQUIRES AUTH INTEGRATION (e.g., Firebase Auth, Supabase Auth, or Custom JWT)
 */

export const authService = {
  // TODO: Replace with backend API call
  // REQUIRES BACKEND API ROUTE
  login: async (email: string, password: string): Promise<{ email: string, isNew: boolean, isFounder: boolean, role: UserRole }> => {
    console.log('Authenticating with backend...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const isFounder = email === FOUNDER_CREDENTIALS.email && password === FOUNDER_CREDENTIALS.password;
    
    if (isFounder) {
      return { email, isNew: false, isFounder: true, role: 'FOUNDER' };
    }

    // Mock success for any other email for now
    return { email, isNew: false, isFounder: false, role: 'LANDLORD' };
  },

  // TODO: Replace with backend API call
  signup: async (email: string, password: string): Promise<{ email: string, isNew: boolean, isFounder: boolean, role: UserRole }> => {
    console.log('Registering with backend...');
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { email, isNew: true, isFounder: false, role: 'LANDLORD' };
  },

  logout: async () => {
    console.log('Logging out from backend...');
    // TODO: Clear session/tokens
  }
};
