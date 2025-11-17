import { Usuario } from './users';
import { api } from './api';

const CURRENT_USER_KEY = 'currentUser';

export const setCurrentUser = (usuario: Usuario): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(usuario));
};

export const getCurrentUser = (): Usuario | null => {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  } catch {
    return null;
  }
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
  localStorage.removeItem('accessToken');
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.rol === 'Admin';
};

export const canAccessUsuarios = (): boolean => {
  return isAdmin();
};

// Nueva función para login con backend
export const login = async (username: string, password: string): Promise<Usuario> => {
  try {
    const data = await api.auth.login(username, password);
    setCurrentUser(data.user);
    return data.user;
  } catch (error) {
    throw error;
  }
};

// Nueva función para logout
export const logout = (): void => {
  api.auth.logout();
  clearCurrentUser();
};