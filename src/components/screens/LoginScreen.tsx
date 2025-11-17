import { useState, useEffect } from 'react';
import logoIrakaworld from 'figma:asset/95c19a5ca5cd7a987b45131d4fca3837e0919929.png';
import { toast } from "sonner@2.0.3";
import { login as apiLogin } from '../../utils/auth';
import { api } from '../../utils/api';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  // Inicializar usuario admin al cargar
  useEffect(() => {
    const initAdmin = async () => {
      try {
        console.log('🔧 Verificando usuario admin...');
        
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-c94f8b91/init/admin`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            }
          }
        );

        const data = await response.json();
        
        if (data.success) {
          console.log('✅ Admin inicializado:', data.message);
        }
      } catch (error) {
        console.error('⚠️ Error inicializando admin:', error);
      }
    };

    initAdmin();
  }, []);

  const handleCreateAdmin = async () => {
    setIsCreatingAdmin(true);
    
    try {
      console.log('🔨 Creando usuario admin manualmente...');
      
      await api.auth.signup(
        'admin@irakaworld.com',
        'Iraka2025',
        'Administrador Principal',
        'Admin'
      );
      
      toast.success('¡Usuario creado!', {
        description: 'Ahora puedes iniciar sesión'
      });
      
      // Auto-completar campos
      setEmail('admin@irakaworld.com');
      setPassword('Iraka2025');
      
    } catch (error: any) {
      console.error('Error creando admin:', error);
      
      if (error.message.includes('ya existe')) {
        toast.info('Usuario ya existe', {
          description: 'Intenta iniciar sesión'
        });
        setEmail('admin@irakaworld.com');
        setPassword('Iraka2025');
      } else {
        toast.error('Error al crear usuario', {
          description: error.message
        });
      }
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleTestLogin = async () => {
    if (!email || !password) {
      toast.error('Ingresa email y contraseña');
      return;
    }

    try {
      console.log('🧪 Probando login con detalles...');
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-c94f8b91/debug/test-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({ email: email, password })
        }
      );

      const data = await response.json();
      console.log('🧪 Resultado del test:', data);

      if (data.success) {
        toast.success('✅ Contraseña correcta!', {
          description: 'El login debería funcionar'
        });
      } else if (data.error === 'Usuario no encontrado') {
        toast.error('❌ Usuario no existe', {
          description: 'Crea el usuario admin primero'
        });
        console.log('📋 Usuarios disponibles:', data.allKeys);
      } else {
        toast.error('❌ Contraseña incorrecta', {
          description: 'Los hashes no coinciden'
        });
        console.log('🔍 Detalles:', data.details);
      }
    } catch (error) {
      console.error('Error en test:', error);
      toast.error('Error en test de login');
    }
  };

  const handleLogin = async () => {
    // Validar que los campos no estén vacíos
    if (!email || !password) {
      toast.error('Campos requeridos', {
        description: 'Por favor ingrese usuario y contraseña'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Intentar login con la API
      const user = await apiLogin(email, password);
      
      toast.success(`¡Bienvenido ${user.nombre}!`, {
        description: `Rol: ${user.rol}`
      });
      
      setTimeout(() => {
        onLogin();
      }, 500);
    } catch (error: any) {
      console.error('Error en login:', error);
      toast.error('Credenciales incorrectas', {
        description: 'Si es la primera vez, crea el usuario admin primero'
      });
      setIsLoading(false);
    }
  };

  // Permitir login con Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center px-6 py-12 h-full"
      style={{ backgroundColor: '#F4F6F8' }}
    >
      {/* Logo */}
      <div className="mb-6">
        <img
          src={logoIrakaworld}
          alt="Logo Irakaworld"
          className="w-[150px] h-[150px] object-cover rounded-full shadow-lg"
        />
      </div>

      {/* App Name */}
      <h1 className="mb-8 text-amber-600">Irakaworld</h1>
      <p className="text-sm text-slate-600 mb-6 text-center">Un mundo inspirado en la artesanía</p>

      {/* Email Input */}
      <input
        id="txtUsuario"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className="w-full px-4 py-3 mb-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Password Input */}
      <input
        id="txtPassword"
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
        disabled={isLoading}
        className="w-full px-4 py-3 mb-4 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Login Button */}
      <button
        id="btnLogin"
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full py-3 bg-amber-600 text-white rounded-md shadow-md hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Iniciando...
          </>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </div>
  );
}