import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, User } from 'lucide-react';
import { UsuarioForm } from '../forms/UsuarioForm';
import { Usuario, getUsuarios, addUsuario, deleteUsuario, updateUsuario } from '../../utils/users';
import { getCurrentUser } from '../../utils/auth';
import { addActivityLog } from '../../utils/activity';
import { toast } from "sonner@2.0.3";

export function UsuariosScreen() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadUsuarios();
  }, []);

  const loadUsuarios = () => {
    setUsuarios(getUsuarios());
  };

  const handleAddUsuario = (data: Omit<Usuario, 'id' | 'fechaCreacion'>) => {
    // Verificar si el usuario ya existe
    const exists = usuarios.some(u => u.usuario === data.usuario);
    if (exists) {
      toast.error('Usuario duplicado', {
        description: 'Ya existe un usuario con ese nombre de usuario'
      });
      return;
    }

    const newUsuario = addUsuario(data);
    
    // Registrar actividad
    if (currentUser) {
      addActivityLog(
        currentUser.id,
        currentUser.nombre,
        'Usuario creado',
        `${currentUser.nombre} creó el usuario ${data.nombre} (@${data.usuario}) como ${data.rol}`,
        'create'
      );
    }
    
    loadUsuarios();
    toast.success('Usuario creado', {
      description: `${data.nombre} ha sido agregado correctamente`
    });
  };

  const handleUpdateUsuario = (data: Omit<Usuario, 'id' | 'fechaCreacion'>) => {
    if (!editingUsuario) return;
    
    updateUsuario(editingUsuario.id, data);
    
    // Registrar actividad
    if (currentUser) {
      addActivityLog(
        currentUser.id,
        currentUser.nombre,
        'Usuario actualizado',
        `${currentUser.nombre} actualizó el usuario ${data.nombre} (@${data.usuario})`,
        'update'
      );
    }
    
    loadUsuarios();
    setEditingUsuario(null);
    toast.success('Usuario actualizado', {
      description: `${data.nombre} ha sido actualizado correctamente`
    });
  };

  const handleDeleteUsuario = (usuario: Usuario) => {
    if (usuario.email === 'admin@irakaworld.com') {
      toast.error('Acción no permitida', {
        description: 'No puedes eliminar al administrador principal'
      });
      return;
    }

    if (confirm(`¿Estás seguro de eliminar a ${usuario.nombre}?`)) {
      deleteUsuario(usuario.id);
      
      // Registrar actividad
      if (currentUser) {
        addActivityLog(
          currentUser.id,
          currentUser.nombre,
          'Usuario eliminado',
          `${currentUser.nombre} eliminó el usuario ${usuario.nombre} (${usuario.email})`,
          'delete'
        );
      }
      
      loadUsuarios();
      toast.success('Usuario eliminado', {
        description: `${usuario.nombre} ha sido eliminado`
      });
    }
  };

  const handleToggleActivo = (usuario: Usuario) => {
    if (usuario.email === 'admin@irakaworld.com') {
      toast.error('Acción no permitida', {
        description: 'No puedes desactivar al administrador principal'
      });
      return;
    }

    updateUsuario(usuario.id, { activo: !usuario.activo });
    
    // Registrar actividad
    if (currentUser) {
      addActivityLog(
        currentUser.id,
        currentUser.nombre,
        usuario.activo ? 'Usuario desactivado' : 'Usuario activado',
        `${currentUser.nombre} ${usuario.activo ? 'desactivó' : 'activó'} el usuario ${usuario.nombre}`,
        'update'
      );
    }
    
    loadUsuarios();
    toast.success(
      usuario.activo ? 'Usuario desactivado' : 'Usuario activado',
      { description: `${usuario.nombre} ahora está ${usuario.activo ? 'inactivo' : 'activo'}` }
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
        <div>
          <h2 className="text-amber-600">Gestión de Usuarios</h2>
          <p className="text-xs text-slate-500 mt-1">
            {usuarios.length} {usuarios.length === 1 ? 'usuario' : 'usuarios'} registrados
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-amber-600 text-white px-3 py-2 rounded-md flex items-center gap-2 hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Nuevo</span>
        </button>
      </div>

      {/* Lista de Usuarios */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {usuarios.map((usuario) => (
          <div
            key={usuario.id}
            className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-3 flex-1">
                {/* Avatar Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  usuario.rol === 'Admin' ? 'bg-amber-100' : 'bg-blue-100'
                }`}>
                  {usuario.rol === 'Admin' ? (
                    <Shield className="w-6 h-6 text-amber-600" />
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-slate-800 truncate">{usuario.nombre}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      usuario.rol === 'Admin' 
                        ? 'bg-amber-100 text-amber-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {usuario.rol}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{usuario.email || `@${usuario.usuario}`}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${
                      usuario.activo 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                    <span className="text-xs text-slate-500">
                      Creado: {new Date(usuario.fechaCreacion).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1">
                <button
                  onClick={() => setEditingUsuario(usuario)}
                  className="p-2 rounded hover:bg-amber-50 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4 text-amber-600" />
                </button>
                <button
                  onClick={() => handleToggleActivo(usuario)}
                  className={`p-2 rounded hover:bg-slate-100 transition-colors ${
                    usuario.email === 'admin@irakaworld.com' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={usuario.activo ? 'Desactivar' : 'Activar'}
                >
                  <Edit2 className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={() => handleDeleteUsuario(usuario)}
                  className={`p-2 rounded hover:bg-red-50 transition-colors ${
                    usuario.email === 'admin@irakaworld.com' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Eliminar"
                  disabled={usuario.email === 'admin@irakaworld.com'}
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>

            {/* Nota para admin principal */}
            {usuario.email === 'admin@irakaworld.com' && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-amber-600">
                  👑 Usuario administrador principal - No se puede eliminar ni desactivar
                </p>
              </div>
            )}
          </div>
        ))}

        {usuarios.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No hay usuarios registrados</p>
            <p className="text-sm text-slate-400 mt-1">Agrega tu primer usuario</p>
          </div>
        )}
      </div>

      {/* Form Modal - Crear */}
      {showForm && (
        <UsuarioForm
          onClose={() => setShowForm(false)}
          onSubmit={handleAddUsuario}
        />
      )}

      {/* Form Modal - Editar */}
      {editingUsuario && (
        <UsuarioForm
          usuario={editingUsuario}
          onClose={() => setEditingUsuario(null)}
          onSubmit={handleUpdateUsuario}
        />
      )}
    </div>
  );
}