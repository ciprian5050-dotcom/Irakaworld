import { Package, AlertTriangle, TrendingUp, TrendingDown, Loader2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  descripcion?: string;
}

export function InventariosScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      setLoading(true);
      const resultado = await api.productos.getAll();
      
      if (Array.isArray(resultado)) {
        setProductos(resultado);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error('Error cargando inventario:', error);
      toast.error('Error al cargar inventario');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular estadísticas
  const stockBajo = productos.filter(item => item.stock < 10); // Alerta cuando hay menos de 10 unidades
  const stockTotal = productos.reduce((acc, item) => acc + (Number(item.stock) || 0), 0);
  const sinStock = productos.filter(item => item.stock === 0).length;

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-amber-600';
    return 'text-green-600';
  };

  const getStockLabel = (stock: number) => {
    if (stock === 0) return 'Sin Stock';
    if (stock < 10) return 'Stock Bajo';
    return 'Stock OK';
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <Package className="w-6 h-6 text-amber-600" />
        <h2>Inventario</h2>
      </div>

      {/* Alertas */}
      {stockBajo.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-amber-900">{stockBajo.length} producto(s) con stock bajo</p>
            <p className="text-xs text-amber-700 mt-1">Se recomienda reabastecer</p>
          </div>
        </div>
      )}

      {sinStock > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-red-900">{sinStock} producto(s) sin stock</p>
            <p className="text-xs text-red-700 mt-1">No disponibles para venta</p>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar en inventario..."
          className="bg-transparent w-full outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Stock Total</p>
          <p className="text-xl text-amber-600 mt-1">{stockTotal}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Productos</p>
          <p className="text-xl text-blue-600 mt-1">{productos.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Alerta</p>
          <p className="text-xl text-red-600 mt-1">{stockBajo.length}</p>
        </div>
      </div>

      {/* Inventario List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
          <p className="text-sm text-slate-500">Cargando inventario...</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">
            {productos.length === 0 ? 'No hay productos en el inventario' : 'No se encontraron productos'}
          </p>
          {productos.length === 0 && (
            <p className="text-xs text-slate-400 mt-2">Agrega productos desde la sección Productos</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {productosFiltrados.map((item) => {
            const isBajo = item.stock < 10;
            const sinStock = item.stock === 0;

            return (
              <div 
                key={item.id} 
                className={`bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow ${
                  sinStock ? 'border-2 border-red-200' : isBajo ? 'border-2 border-amber-200' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Imagen del Producto */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.imagen && item.imagen.startsWith('http') ? (
                      <ImageWithFallback
                        src={item.imagen}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-amber-300" />
                      </div>
                    )}
                  </div>

                  {/* Información del Producto */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm line-clamp-1">{item.nombre}</h3>
                        <p className="text-xs text-slate-500 mt-1">{item.categoria}</p>
                      </div>
                      
                      {/* Badge de Stock */}
                      <div className={`ml-2 flex-shrink-0 ${
                        sinStock ? 'bg-red-100 text-red-700' :
                        isBajo ? 'bg-amber-100 text-amber-700' :
                        'bg-green-100 text-green-700'
                      } px-2 py-1 rounded-full text-xs flex items-center gap-1`}>
                        {sinStock ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : isBajo ? (
                          <TrendingDown className="w-3 h-3" />
                        ) : (
                          <TrendingUp className="w-3 h-3" />
                        )}
                        <span>{getStockLabel(item.stock)}</span>
                      </div>
                    </div>

                    {/* Stock y Ubicación */}
                    <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-xs text-slate-500">Stock Actual</p>
                          <p className={`text-lg ${getStockColor(item.stock)}`}>
                            {item.stock}
                          </p>
                        </div>
                        <div className="h-8 w-px bg-slate-200"></div>
                        <div>
                          <p className="text-xs text-slate-500">Stock Mínimo</p>
                          <p className="text-lg text-slate-600">10</p>
                        </div>
                      </div>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="mt-3">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            sinStock ? 'bg-red-600' :
                            isBajo ? 'bg-amber-600' :
                            'bg-green-600'
                          }`}
                          style={{
                            width: `${Math.min((item.stock / 50) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.stock > 50 ? 'Stock excelente' : 
                         item.stock > 10 ? 'Stock normal' : 
                         item.stock > 0 ? 'Necesita reabastecimiento' : 
                         'Sin disponibilidad'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
