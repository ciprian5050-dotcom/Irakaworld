export type UserRole = 'Admin' | 'Vendedor';

export interface Usuario {
  id: string;
  nombre: string;
  usuario: string;
  email: string;
  password: string;
  rol: UserRole;
  activo: boolean;
  fechaCreacion: string;
}

// Usuario admin por defecto
const DEFAULT_ADMIN: Usuario = {
  id: '1',
  nombre: 'Administrador Principal',
  usuario: 'admin',
  email: 'admin@irakaworld.com',
  password: 'Iraka2025',
  rol: 'Admin',
  activo: true,
  fechaCreacion: new Date().toISOString()
};

const STORAGE_KEY = 'irakaworld_usuarios';

export const getUsuarios = (): Usuario[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const usuarios = JSON.parse(stored);
      // Asegurar que el admin por defecto siempre exista
      const hasAdmin = usuarios.some((u: Usuario) => u.email === DEFAULT_ADMIN.email);
      if (!hasAdmin) {
        usuarios.unshift(DEFAULT_ADMIN);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
      }
      // Eliminar duplicados por ID
      const uniqueUsuarios = usuarios.filter((usuario: Usuario, index: number, self: Usuario[]) =>
        index === self.findIndex((u) => u.id === usuario.id)
      );
      if (uniqueUsuarios.length !== usuarios.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueUsuarios));
        return uniqueUsuarios;
      }
      return usuarios;
    }
    // Si no hay datos, crear con el admin por defecto
    localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]));
    return [DEFAULT_ADMIN];
  } catch {
    return [DEFAULT_ADMIN];
  }
};

export const saveUsuarios = (usuarios: Usuario[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
};

export const addUsuario = (usuario: Omit<Usuario, 'id' | 'fechaCreacion'>): Usuario => {
  const usuarios = getUsuarios();
  const newUsuario: Usuario = {
    ...usuario,
    id: Date.now().toString(),
    fechaCreacion: new Date().toISOString()
  };
  usuarios.push(newUsuario);
  saveUsuarios(usuarios);
  return newUsuario;
};

export const updateUsuario = (id: string, data: Partial<Usuario>): void => {
  const usuarios = getUsuarios();
  const index = usuarios.findIndex(u => u.id === id);
  if (index !== -1) {
    usuarios[index] = { ...usuarios[index], ...data };
    saveUsuarios(usuarios);
  }
};

export const deleteUsuario = (id: string): void => {
  const usuarios = getUsuarios();
  // No permitir eliminar al admin principal
  const filtered = usuarios.filter(u => u.id !== id || u.usuario === DEFAULT_ADMIN.usuario);
  saveUsuarios(filtered);
};

export const validateCredentials = (usuario: string, password: string): Usuario | null => {
  const usuarios = getUsuarios();
  const user = usuarios.find(u => 
    u.usuario === usuario && 
    u.password === password && 
    u.activo
  );
  return user || null;
};