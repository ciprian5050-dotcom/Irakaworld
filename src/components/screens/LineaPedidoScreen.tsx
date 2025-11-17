import { List, Package } from 'lucide-react';
import { formatCOP } from '../../utils/currency';

const lineasPedido = [
  { id: 1, pedidoId: 1001, producto: 'Producto de Ejemplo', cantidad: 1, precio: 180000, subtotal: 180000 },
];

export function LineaPedidoScreen() {
  const pedidosUnicos = [...new Set(lineasPedido.map(l => l.pedidoId))];
  
  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <List className="w-6 h-6 text-amber-600" />
        <h2>Líneas de Pedido</h2>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Líneas Totales</p>
          <p className="text-xl text-amber-600 mt-1">{lineasPedido.length}</p>
        </div>
        <div className="bg-white rounded-lg p-3 shadow-sm">
          <p className="text-xs text-slate-500">Pedidos</p>
          <p className="text-xl text-blue-600 mt-1">{pedidosUnicos.length}</p>
        </div>
      </div>

      {/* Agrupado por Pedido */}
      {pedidosUnicos.map((pedidoId) => {
        const lineas = lineasPedido.filter(l => l.pedidoId === pedidoId);
        const totalPedido = lineas.reduce((acc, l) => acc + l.subtotal, 0);
        
        return (
          <div key={pedidoId} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header del Pedido */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm">Pedido #{pedidoId}</h3>
                <p className="text-sm">{formatCOP(totalPedido)}</p>
              </div>
            </div>

            {/* Líneas del Pedido */}
            <div className="p-3 space-y-2">
              {lineas.map((linea) => (
                <div key={linea.id} className="flex items-start gap-3 pb-2 border-b border-slate-100 last:border-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm truncate">{linea.producto}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-slate-500">
                        {linea.cantidad} x {formatCOP(linea.precio)}
                      </p>
                      <p className="text-sm text-amber-600">{formatCOP(linea.subtotal)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}