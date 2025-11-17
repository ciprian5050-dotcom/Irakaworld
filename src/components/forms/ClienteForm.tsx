import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Cliente {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  direccion?: string;
}

interface ClienteFormProps {
  onClose: () => void;
  onSave: (cliente: Omit<Cliente, 'id'>) => void;
  clienteInicial?: Cliente | null;
}

export function ClienteForm({ onClose, onSave, clienteInicial }: ClienteFormProps) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [direccion, setDireccion] = useState('');

  useEffect(() => {
    if (clienteInicial) {
      setNombre(clienteInicial.nombre);
      setEmail(clienteInicial.email);
      setTelefono(clienteInicial.telefono);
      setCiudad(clienteInicial.ciudad);
      setDireccion(clienteInicial.direccion || '');
    }
  }, [clienteInicial]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre && email && telefono && ciudad) {
      onSave({ nombre, email, telefono, ciudad, direccion });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between rounded-t-xl">
          <h3>{clienteInicial ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-amber-800 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ej: María González"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="cliente@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Teléfono</label>
            <input
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="+57 300 123 4567"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Ciudad</label>
            <input
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ej: Bogotá"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Dirección (opcional)</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Ej: Calle 123 #45-67"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              {clienteInicial ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}