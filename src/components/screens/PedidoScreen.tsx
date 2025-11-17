import { ShoppingBag, Clock, CheckCircle, XCircle, AlertCircle, Plus, Loader2, Eye, Trash2, Edit2 } from 'lucide-react';
import { formatCOP } from '../../utils/currency';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface Pedido {
  id: string;
  clienteId: string;
  fecha: string;
  estado: string;
  total: number;
}

interface Cliente {
  id: string;
  nombre: string;
}

interface LineaPedido {
  id: string;
  pedidoId: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface Producto {
  id: string;
  nombre: string;
  precio: number;
}

const estadoConfig = {
  'Pendiente': { icon: Clock, color: 'bg-amber-100 text-amber-700', label: 'Pendiente' },
  'Completado': { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Completado' },
  'Enviado': { icon: AlertCircle, color: 'bg-blue-100 text-blue-700', label: 'Enviado' },
  'Cancelado': { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Cancelado' },
};

interface PedidoConDetalles extends Pedido {
  clienteNombre: string;
  cantidadItems: number;
}

export function PedidoScreen() {
  const [pedidos, setPedidos] = useState<PedidoConDetalles[]>([]);
  const [loading, setLoading] = useState(true);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<string | null>(null);
  const [lineasPedido, setLineasPedido] = useState<LineaPedido[]>([]);
  const [productos, setProductos] = useState<Map<string, Producto>>(new Map());

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      
      // Cargar datos en paralelo
      const [pedidosData, clientesData, productosData, lineasData] = await Promise.all([
        api.pedidos.getAll().catch(() => []),
        api.clientes.getAll().catch(() => []),
        api.productos.getAll().catch(() => []),
        api.lineasPedido.getAll().catch(() => []),
      ]);

      // Crear mapa de clientes
      const clientesMap = new Map<string, string>();
      if (Array.isArray(clientesData)) {
        clientesData.forEach((c: Cliente) => {
          clientesMap.set(c.id, c.nombre);
        });
      }

      // Crear mapa de productos
      const productosMap = new Map<string, Producto>();
      if (Array.isArray(productosData)) {
        productosData.forEach((p: Producto) => {
          productosMap.set(p.id, p);
        });
      }
      setProductos(productosMap);

      // Contar items por pedido
      const itemsPorPedido = new Map<string, number>();
      if (Array.isArray(lineasData)) {
        lineasData.forEach((linea: LineaPedido) => {
          itemsPorPedido.set(
            linea.pedidoId,
            (itemsPorPedido.get(linea.pedidoId) || 0) + linea.cantidad
          );
        });
      }

      // Combinar datos
      const pedidosConDetalles: PedidoConDetalles[] = [];
      if (Array.isArray(pedidosData)) {
        pedidosData.forEach((pedido: Pedido) => {
          pedidosConDetalles.push({
            ...pedido,
            clienteNombre: clientesMap.get(pedido.clienteId) || 'Cliente Desconocido',
            cantidadItems: itemsPorPedido.get(pedido.id) || 0,
          });
        });
      }

      // Ordenar por fecha (más recientes primero)
      pedidosConDetalles.sort((a, b) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );

      setPedidos(pedidosConDetalles);
      
    } catch (error) {
      console.error('Error cargando pedidos:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const cargarDetallesPedido = async (pedidoId: string) => {
    try {
      const lineas = await api.lineasPedido.getByPedido(pedidoId);
      
      if (Array.isArray(lineas)) {
        setLineasPedido(lineas);
      } else {
        setLineasPedido([]);
      }
      
      setPedidoSeleccionado(pedidoId);
    } catch (error) {
      console.error('Error cargando detalles del pedido:', error);
      toast.error('Error al cargar detalles del pedido');
    }
  };

  const cambiarEstado = async (pedidoId: string, nuevoEstado: string) => {
    try {
      await api.pedidos.update(pedidoId, { estado: nuevoEstado });
      toast.success('Estado actualizado');
      await cargarDatos();
    } catch (error) {
      console.error('Error actualizando estado:', error);
      toast.error('Error al actualizar estado');
    }
  };

  const eliminarPedido = async (pedidoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) {
      return;
    }

    try {
      await api.pedidos.delete(pedidoId);
      toast.success('Pedido eliminado');
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando pedido:', error);
      toast.error('Error al eliminar pedido');
    }
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'Sin fecha';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const contarPorEstado = (estado: string) => {
    return pedidos.filter(p => p.estado === estado).length;
  };

  // Modal de detalles del pedido
  if (pedidoSeleccionado) {
    const pedido = pedidos.find(p => p.id === pedidoSeleccionado);
    
    return (
      <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
        <button
          onClick={() => setPedidoSeleccionado(null)}
          className="text-amber-600 text-sm hover:text-amber-700 transition-colors"
        >
          ← Volver a Pedidos
        </button>

        {pedido && (
          <>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <h3 className="text-sm mb-2">Pedido #{pedido.id.slice(0, 8)}</h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-slate-500">Cliente:</span> {pedido.clienteNombre}</p>
                <p><span className="text-slate-500">Fecha:</span> {formatearFecha(pedido.fecha)}</p>
                <p><span className="text-slate-500">Estado:</span> {pedido.estado}</p>
                <p><span className="text-slate-500">Total:</span> <span className="text-amber-600">{formatCOP(pedido.total)}</span></p>
              </div>
              
              {/* Cambiar Estado */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 mb-2">Cambiar Estado:</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(estadoConfig).map(([estado, config]) => (
                    <button
                      key={estado}
                      onClick={() => cambiarEstado(pedido.id, estado)}
                      className={`${config.color} px-3 py-2 rounded-lg text-xs hover:opacity-80 transition-opacity`}
                      disabled={pedido.estado === estado}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md">
              <h4 className="text-sm mb-3">Productos del Pedido</h4>
              <div className="space-y-2">
                {lineasPedido.map((linea) => {
                  const producto = productos.get(linea.productoId);
                  return (
                    <div key={linea.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm">{producto?.nombre || 'Producto Desconocido'}</p>
                        <p className="text-xs text-slate-500">Cantidad: {linea.cantidad} x {formatCOP(linea.precioUnitario)}</p>
                      </div>
                      <p className="text-sm text-amber-600">{formatCOP(linea.subtotal)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-amber-600" />
        <h2>Pedidos</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-white rounded-lg p-2 shadow-sm text-center">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-lg text-amber-600">{pedidos.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-2 shadow-sm text-center">
          <p className="text-xs text-green-600">OK</p>
          <p className="text-lg text-green-700">{contarPorEstado('Completado')}</p>
        </div>
        <div className="bg-amber-50 rounded-lg p-2 shadow-sm text-center">
          <p className="text-xs text-amber-600">Pend.</p>
          <p className="text-lg text-amber-700">{contarPorEstado('Pendiente')}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 shadow-sm text-center">
          <p className="text-xs text-blue-600">Env.</p>
          <p className="text-lg text-blue-700">{contarPorEstado('Enviado')}</p>
        </div>
      </div>

      {/* Pedidos List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
          <p className="text-sm text-slate-500">Cargando pedidos...</p>
        </div>
      ) : pedidos.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md">
          <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-2">No hay pedidos registrados</p>
          <p className="text-xs text-slate-400">Los pedidos se crean desde el Carrito de Compras</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pedidos.map((pedido) => {
            const config = estadoConfig[pedido.estado as keyof typeof estadoConfig] || estadoConfig['Pendiente'];
            const Icon = config.icon;
            
            return (
              <div key={pedido.id} className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm">Pedido #{pedido.id.slice(0, 8)}</h3>
                    <p className="text-xs text-slate-500 mt-1 truncate">{pedido.clienteNombre}</p>
                  </div>
                  <div className={`${config.color} px-2 py-1 rounded-full flex items-center gap-1 flex-shrink-0 ml-2`}>
                    <Icon className="w-3 h-3" />
                    <span className="text-xs">{config.label}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="text-xs text-slate-600">
                    <p>{formatearFecha(pedido.fecha)}</p>
                    <p className="mt-1">{pedido.cantidadItems} artículo(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-amber-600">{formatCOP(pedido.total)}</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => cargarDetallesPedido(pedido.id)}
                    className="flex-1 bg-amber-50 text-amber-600 py-2 rounded-lg text-xs hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    Ver Detalles
                  </button>
                  <button
                    onClick={() => eliminarPedido(pedido.id)}
                    className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-xs hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
