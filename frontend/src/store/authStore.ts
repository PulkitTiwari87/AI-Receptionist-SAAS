import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'BUSINESS_OWNER' | 'STAFF';
  businessId?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  avatarUrl: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setAvatarUrl: (url: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  avatarUrl: localStorage.getItem('avatar_url'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('avatar_url');
    set({ user: null, token: null, avatarUrl: null, isAuthenticated: false });
  },

  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...updates };
      localStorage.setItem('user', JSON.stringify(updated));
      return { user: updated };
    });
  },

  setAvatarUrl: (url) => {
    if (url) {
      localStorage.setItem('avatar_url', url);
    } else {
      localStorage.removeItem('avatar_url');
    }
    set({ avatarUrl: url });
  },
}));

// Auto-hydrate user from localStorage on load
const storedUser = localStorage.getItem('user');
if (storedUser) {
  useAuthStore.setState({ user: JSON.parse(storedUser) });
}
