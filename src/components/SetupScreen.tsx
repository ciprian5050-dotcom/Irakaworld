import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'sonner@2.0.3';
import { crearUsuarioAdmin, crearDatosEjemplo } from '../utils/init-database';
import logoIrakaworld from 'figma:asset/95c19a5ca5cd7a987b45131d4fca3837e0919929.png';

interface SetupScreenProps {
  onComplete: () => void;
}

export function SetupScreen({ onComplete }: SetupScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [incluirDatos, setIncluirDatos] = useState(true);

  const handleSetup = async () => {
    setIsLoading(true);
    
    try {
      // Crear usuario admin
      toast.info('Paso 1/2: Creando usuario administrador...');
      await crearUsuarioAdmin();
      
      // Crear datos de ejemplo si se seleccionó
      if (incluirDatos) {
        toast.info('Paso 2/2: Creando datos de ejemplo...');
        await crearDatosEjemplo();
      }
      
      toast.success('¡Configuración completada!', {
        description: 'Ya puedes iniciar sesión con admin@irakaworld.com'
      });
      
      // Esperar un poco para que se vea el mensaje
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (error: any) {
      console.error('❌ Error en setup:', error);
      
      // Si el error es que el usuario ya existe, está bien
      if (error.message && (error.message.includes('ya existe') || error.message.includes('already'))) {
        toast.success('Usuario ya configurado', {
          description: 'Puedes iniciar sesión directamente'
        });
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        toast.error('Error en la configuración', {
          description: error.message || 'Por favor intenta de nuevo'
        });
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 h-full bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Logo */}
      <div className="mb-6">
        <img
          src={logoIrakaworld}
          alt="Logo Irakaworld"
          className="w-[120px] h-[120px] object-cover rounded-full shadow-lg"
        />
      </div>

      {/* Título */}
      <h1 className="text-amber-600 mb-2">Bienvenido a Irakaworld</h1>
      <p className="text-sm text-slate-600 mb-8 text-center max-w-xs">
        Vamos a configurar tu aplicación
      </p>

      {/* Card de configuración */}
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mb-4">
        <h3 className="text-amber-700 mb-4">Configuración Inicial</h3>
        
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-slate-700 mb-2">
              <strong>Se creará automáticamente:</strong>
            </p>
            <p className="text-xs text-slate-600 mb-1">
              📧 Email: <span className="font-mono">admin@irakaworld.com</span>
            </p>
            <p className="text-xs text-slate-600">
              🔒 Contraseña: <span className="font-mono">Iraka2025</span>
            </p>
            <p className="text-xs text-amber-600 mt-2">
              Guarda estas credenciales para iniciar sesión
            </p>
          </div>

          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="incluirDatos"
              checked={incluirDatos}
              onChange={(e) => setIncluirDatos(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="incluirDatos" className="text-sm text-slate-600">
              Incluir <strong>63 productos Wayuu auténticos</strong> organizados en 6 categorías (Mochilas, Bolsos, Accesorios, Calzado, Hogar y Especiales) con imágenes reales, precios en COP y stock
            </label>
          </div>
        </div>
      </div>

      {/* Botón de configuración */}
      <Button
        onClick={handleSetup}
        disabled={isLoading}
        className="w-full max-w-sm bg-amber-600 hover:bg-amber-700"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Configurando...
          </>
        ) : (
          'Iniciar Configuración'
        )}
      </Button>

      <p className="text-xs text-slate-500 mt-6 text-center max-w-xs">
        Esta configuración solo se ejecuta una vez. Después podrás crear más usuarios desde el panel de administración.
      </p>
    </div>
  );
}