import { useState } from 'react';
import { RefreshCw, Database } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkDatabase = async () => {
    setLoading(true);
    try {
      // Intentar obtener productos
      const productos = await api.productos.getAll();
      
      setInfo({
        productos: {
          count: productos?.length || 0,
          sample: productos?.slice(0, 3) || []
        },
        timestamp: new Date().toISOString()
      });
      
      if (!productos || productos.length === 0) {
        toast.error('No hay productos en la base de datos', {
          description: 'Ejecuta el Setup para cargar los productos'
        });
      } else {
        toast.success(`Se encontraron ${productos.length} productos`);
      }
    } catch (error: any) {
      console.error('Error checking database:', error);
      toast.error('Error al consultar la base de datos', {
        description: error.message
      });
      setInfo({
        error: error.message,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors z-50"
        title="Debug Panel"
      >
        <Database className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-y-auto z-50 border-2 border-purple-600">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-purple-600 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Debug Panel
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>
      </div>

      <button
        onClick={checkDatabase}
        disabled={loading}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:bg-slate-300 flex items-center justify-center gap-2 mb-4"
      >
        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        {loading ? 'Consultando...' : 'Consultar Base de Datos'}
      </button>

      {info && (
        <div className="bg-slate-50 rounded-lg p-3 text-xs">
          <pre className="whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(info, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
