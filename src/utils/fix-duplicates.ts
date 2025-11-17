/**
 * Utilidad para limpiar duplicados en localStorage
 * Ejecutar una vez si hay problemas con datos duplicados
 */

import { Usuario } from './users';

export const limpiarDuplicadosUsuarios = () => {
  try {
    const STORAGE_KEY = 'irakaworld_usuarios';
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      console.log('✅ No hay datos de usuarios para limpiar');
      return;
    }
    
    const usuarios: Usuario[] = JSON.parse(stored);
    const antes = usuarios.length;
    
    // Eliminar duplicados por ID
    const uniqueUsuarios = usuarios.filter((usuario, index, self) =>
      index === self.findIndex((u) => u.id === usuario.id)
    );
    
    if (uniqueUsuarios.length < antes) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(uniqueUsuarios));
      console.log(`✅ Duplicados eliminados: ${antes} → ${uniqueUsuarios.length} usuarios`);
      return { antes, despues: uniqueUsuarios.length, eliminados: antes - uniqueUsuarios.length };
    } else {
      console.log('✅ No se encontraron duplicados');
      return { antes, despues: antes, eliminados: 0 };
    }
  } catch (error) {
    console.error('❌ Error limpiando duplicados:', error);
    return null;
  }
};

// Exportar función para limpiar todos los duplicados
export const limpiarTodosDuplicados = () => {
  console.log('🧹 Iniciando limpieza de duplicados...\n');
  
  const resultadoUsuarios = limpiarDuplicadosUsuarios();
  
  console.log('\n✨ Limpieza completada');
  
  return {
    usuarios: resultadoUsuarios
  };
};
