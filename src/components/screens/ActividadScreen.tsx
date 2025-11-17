import { useState, useEffect } from 'react';
import { Activity, LogIn, LogOut, Plus, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { ActivityLog, getActivityLog, clearActivityLog } from '../../utils/activity';
import { toast } from "sonner@2.0.3";

export function ActividadScreen() {
  const [actividades, setActividades] = useState<ActivityLog[]>([]);
  const [filtro, setFiltro] = useState<'all' | ActivityLog['tipo']>('all');

  useEffect(() => {
    loadActividades();
  }, []);

  const loadActividades = () => {
    setActividades(getActivityLog());
  };

  const handleClearLog = () => {
    if (confirm('¿Estás seguro de borrar todo el registro de actividades? Esta acción no se puede deshacer.')) {
      clearActivityLog();
      loadActividades();
      toast.success('Registro limpiado', {
        description: 'El historial de actividades ha sido borrado'
      });
    }
  };

  const actividadesFiltradas = filtro === 'all' 
    ? actividades 
    : actividades.filter(a => a.tipo === filtro);

  const getIconByTipo = (tipo: ActivityLog['tipo']) => {
    switch (tipo) {
      case 'login': return <LogIn className="w-4 h-4 text-green-600" />;
      case 'logout': return <LogOut className="w-4 h-4 text-slate-600" />;
      case 'create': return <Plus className="w-4 h-4 text-blue-600" />;
      case 'update': return <Edit className="w-4 h-4 text-amber-600" />;
      case 'delete': return <Trash2 className="w-4 h-4 text-red-600" />;
      case 'view': return <Eye className="w-4 h-4 text-purple-600" />;
      default: return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getColorByTipo = (tipo: ActivityLog['tipo']) => {
    switch (tipo) {
      case 'login': return 'bg-green-50 border-green-200';
      case 'logout': return 'bg-slate-50 border-slate-200';
      case 'create': return 'bg-blue-50 border-blue-200';
      case 'update': return 'bg-amber-50 border-amber-200';
      case 'delete': return 'bg-red-50 border-red-200';
      case 'view': return 'bg-purple-50 border-purple-200';
      default: return 'bg-white border-slate-200';
    }
  };

  const formatFecha = (fecha: string) => {
    const date = new Date(fecha);
    const hoy = new Date();
    const esHoy = date.toDateString() === hoy.toDateString();
    
    if (esHoy) {
      return 'Hoy ' + date.toLocaleTimeString('es-CO', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    
    return date.toLocaleString('es-CO', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-amber-600" />
            <h2 className="text-amber-600">Registro de Actividad</h2>
          </div>
          <button
            onClick={handleClearLog}
            className="text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-colors"
          >
            Limpiar
          </button>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFiltro('all')}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              filtro === 'all' 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todas ({actividades.length})
          </button>
          <button
            onClick={() => setFiltro('login')}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              filtro === 'login' 
                ? 'bg-green-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setFiltro('create')}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              filtro === 'create' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Crear
          </button>
          <button
            onClick={() => setFiltro('update')}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              filtro === 'update' 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Editar
          </button>
          <button
            onClick={() => setFiltro('delete')}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              filtro === 'delete' 
                ? 'bg-red-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Eliminar
          </button>
        </div>
      </div>

      {/* Lista de Actividades */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {actividadesFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No hay actividades registradas</p>
            <p className="text-sm text-slate-400 mt-1">
              {filtro !== 'all' ? 'Prueba con otro filtro' : 'Las actividades aparecerán aquí'}
            </p>
          </div>
        ) : (
          actividadesFiltradas.map((actividad) => (
            <div
              key={actividad.id}
              className={`border rounded-lg p-3 ${getColorByTipo(actividad.tipo)}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {getIconByTipo(actividad.tipo)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-slate-800">{actividad.accion}</p>
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {formatFecha(actividad.fecha)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{actividad.descripcion}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Por: <span className="text-slate-700">{actividad.usuario}</span>
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Stats */}
      {actividadesFiltradas.length > 0 && (
        <div className="bg-white border-t border-slate-200 p-3">
          <p className="text-xs text-center text-slate-500">
            Mostrando {actividadesFiltradas.length} de {actividades.length} actividades
          </p>
        </div>
      )}
    </div>
  );
}
