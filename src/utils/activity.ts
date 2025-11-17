export interface ActivityLog {
  id: string;
  usuarioId: string;
  usuario: string;
  accion: string;
  descripcion: string;
  fecha: string;
  tipo: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view';
}

const STORAGE_KEY = 'irakaworld_activity_log';

export const getActivityLog = (): ActivityLog[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return [];
  } catch {
    return [];
  }
};

export const addActivityLog = (
  usuarioId: string,
  usuario: string,
  accion: string,
  descripcion: string,
  tipo: ActivityLog['tipo']
): void => {
  const logs = getActivityLog();
  const newLog: ActivityLog = {
    id: Date.now().toString(),
    usuarioId,
    usuario,
    accion,
    descripcion,
    fecha: new Date().toISOString(),
    tipo
  };
  
  // Mantener solo los últimos 100 registros
  logs.unshift(newLog);
  if (logs.length > 100) {
    logs.pop();
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
};

export const clearActivityLog = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
};
