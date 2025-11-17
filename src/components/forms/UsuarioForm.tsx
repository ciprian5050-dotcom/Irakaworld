import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { UserRole, Usuario } from '../../utils/users';

interface UsuarioFormProps {
  usuario?: Usuario;
  onClose: () => void;
  onSubmit: (data: {
    nombre: string;
    usuario: string;
    email: string;
    password: string;
    rol: UserRole;
    activo: boolean;
  }) => void;
}

export function UsuarioForm({ usuario, onClose, onSubmit }: UsuarioFormProps) {
  const [nombre, setNombre] = useState('');
  const [usuarioName, setUsuarioName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<UserRole>('Vendedor');
  const [activo, setActivo] = useState(true);

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setUsuarioName(usuario.usuario);
      setEmail(usuario.email || '');
      setPassword(usuario.password);
      setRol(usuario.rol);
      setActivo(usuario.activo);
    }
  }, [usuario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && usuarioName && email && password) {
      onSubmit({ nombre, usuario: usuarioName, email, password, rol, activo });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-amber-600">
          <h2 className="text-white">{usuario ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-amber-700 p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Nombre Completo */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan Pérez"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          </div>

          {/* Usuario */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Usuario (para login) *
            </label>
            <input
              type="text"
              value={usuarioName}
              onChange={(e) => setUsuarioName(e.target.value)}
              placeholder="juan.perez"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
              disabled={usuario?.email === 'admin@irakaworld.com'}
            />
            {usuario?.email === 'admin@irakaworld.com' && (
              <p className="text-xs text-amber-600 mt-1">
                No puedes cambiar el usuario del admin principal
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="juan.perez@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
              disabled={usuario?.email === 'admin@irakaworld.com'}
            />
            {usuario?.email === 'admin@irakaworld.com' && (
              <p className="text-xs text-amber-600 mt-1">
                No puedes cambiar el email del admin principal
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Contraseña *
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={usuario ? '••••••••' : 'Mínimo 6 caracteres'}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
              minLength={6}
            />
            {usuario && (
              <p className="text-xs text-slate-500 mt-1">
                Deja la contraseña actual o ingresa una nueva
              </p>
            )}
          </div>

          {/* Rol */}
          <div>
            <label className="block text-sm text-slate-700 mb-1">
              Rol *
            </label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as UserRole)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={usuario?.email === 'admin@irakaworld.com'}
            >
              <option value="Vendedor">Vendedor</option>
              <option value="Admin">Administrador</option>
            </select>
            <p className="text-xs text-slate-500 mt-1">
              {rol === 'Admin' 
                ? 'Puede gestionar usuarios y toda la información' 
                : 'Puede gestionar clientes, productos y ventas'}
            </p>
            {usuario?.email === 'admin@irakaworld.com' && (
              <p className="text-xs text-amber-600 mt-1">
                No puedes cambiar el rol del admin principal
              </p>
            )}
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
              disabled={usuario?.email === 'admin@irakaworld.com'}
            />
            <label htmlFor="activo" className="text-sm text-slate-700">
              Usuario Activo
            </label>
            {usuario?.email === 'admin@irakaworld.com' && (
              <p className="text-xs text-amber-600">
                (No se puede desactivar al admin principal)
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors"
            >
              {usuario ? 'Actualizar' : 'Guardar Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}