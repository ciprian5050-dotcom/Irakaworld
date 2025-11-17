import { AndroidMockup } from './components/AndroidMockup';
import { limpiarTodosDuplicados } from './utils/fix-duplicates';
import { useEffect } from 'react';

export default function App() {
  // Limpiar duplicados al iniciar la app (solo una vez)
  useEffect(() => {
    const hasCleanedDuplicates = sessionStorage.getItem('irakaworld_duplicates_cleaned');
    if (!hasCleanedDuplicates) {
      limpiarTodosDuplicados();
      sessionStorage.setItem('irakaworld_duplicates_cleaned', 'true');
    }
  }, []);

  // Hacer disponible la función de limpieza en la consola del navegador
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).limpiarDuplicados = limpiarTodosDuplicados;
    }
  }, []);

  return <AndroidMockup />;
}