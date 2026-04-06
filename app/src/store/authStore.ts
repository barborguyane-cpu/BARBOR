import { create } from 'zustand';
import { User } from '../services/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email, password) => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000));
    const mockUser: User = {
      id: 'u1',
      firstName: 'Jean',
      lastName: 'MARTIN',
      phone: '+594 694 12 34 56',
      email,
      role: 'client',
      createdAt: new Date().toISOString(),
    };
    set({ user: mockUser, token: 'mock-token', isAuthenticated: true, isLoading: false });
  },

  register: async (data) => {
    set({ isLoading: true });
    await new Promise((r) => setTimeout(r, 1000));
    const mockUser: User = {
      id: 'u' + Date.now(),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      phone: data.phone || '',
      email: data.email || '',
      role: 'client',
      createdAt: new Date().toISOString(),
    };
    set({ user: mockUser, token: 'mock-token', isAuthenticated: true, isLoading: false });
  },

  logout: () => set({ user: null, token: null, isAuthenticated: false }),

  updateProfile: (data) =>
    set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
}));
