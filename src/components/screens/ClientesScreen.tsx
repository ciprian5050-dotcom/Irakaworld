import { Users, Phone, Mail, MapPin, Plus, Search, Loader2, Edit2, Trash2 } from 'lucide-react';
import { formatCOP } from '../../utils/currency';
import { useState, useEffect } from 'react';
import { ClienteForm } from '../forms/ClienteForm';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  direccion?: string;
}

export function ClientesScreen() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditar, setClienteEditar] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const resultado = await api.clientes.getAll();
      
      if (Array.isArray(resultado)) {
        setClientes(resultado);
      } else {
        setClientes([]);
      }
    } catch (error: any) {
      console.error('Error cargando clientes:', error);
      
      if (error.message.includes('401')) {
        toast.error('Sesión expirada. Inicia sesión nuevamente.');
      } else {
        toast.error('Error al cargar clientes');
      }
      
      setClientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarCliente = async (nuevoCliente: Omit<Cliente, 'id'>) => {
    try {
      if (clienteEditar) {
        // Actualizar cliente existente
        await api.clientes.update(clienteEditar.id, nuevoCliente);
        toast.success('Cliente actualizado exitosamente');
      } else {
        // Crear nuevo cliente
        await api.clientes.create(nuevoCliente);
        toast.success('Cliente agregado exitosamente');
      }
      
      await cargarClientes();
      setMostrarFormulario(false);
      setClienteEditar(null);
    } catch (error: any) {
      console.error('Error guardando cliente:', error);
      toast.error(clienteEditar ? 'Error al actualizar cliente' : 'Error al agregar cliente');
    }
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setClienteEditar(cliente);
    setMostrarFormulario(true);
  };

  const handleEliminarCliente = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) {
      return;
    }

    try {
      await api.clientes.delete(id);
      toast.success('Cliente eliminado exitosamente');
      await cargarClientes();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
      toast.error('Error al eliminar cliente');
    }
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setClienteEditar(null);
  };

  // Filtrar clientes por búsqueda
  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefono.includes(searchTerm) ||
    c.ciudad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-amber-600" />
          <h2>Clientes</h2>
        </div>
        <button
          onClick={() => {
            setClienteEditar(null);
            setMostrarFormulario(true);
          }}
          className="bg-amber-600 text-white p-2 rounded-lg shadow-md hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Formulario Modal */}
      {mostrarFormulario && (
        <ClienteForm
          onClose={handleCerrarFormulario}
          onSave={handleAgregarCliente}
          clienteInicial={clienteEditar}
        />
      )}

      {/* Search */}
      <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar clientes..."
          className="bg-transparent w-full outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Total Clientes</p>
          <p className="text-2xl text-amber-600 mt-1">{clientes.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Clientes Activos</p>
          <p className="text-2xl text-green-600 mt-1">{clientes.length}</p>
        </div>
      </div>

      {/* Clientes List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
          <p className="text-sm text-slate-500">Cargando clientes...</p>
        </div>
      ) : clientesFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-4">
            {clientes.length === 0 ? 'No hay clientes registrados' : 'No se encontraron clientes'}
          </p>
          {clientes.length === 0 && (
            <button
              onClick={() => setMostrarFormulario(true)}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Agregar Primer Cliente
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {clientesFiltrados.map((cliente) => (
            <div key={cliente.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm">{cliente.nombre}</h3>
                    <p className="text-xs text-slate-500 mt-1">ID: {cliente.id.slice(0, 8)}</p>
                  </div>
                </div>
                
                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditarCliente(cliente)}
                    className="text-blue-600 hover:text-blue-700 transition-colors p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEliminarCliente(cliente.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Mail className="w-3 h-3" />
                  <span>{cliente.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone className="w-3 h-3" />
                  <span>{cliente.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <MapPin className="w-3 h-3" />
                  <span>{cliente.ciudad}</span>
                </div>
                {cliente.direccion && (
                  <p className="text-xs text-slate-500 mt-1">{cliente.direccion}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
