import { TrendingUp, DollarSign, Users, Package, FileText, ShoppingBag, Loader2, AlertCircle } from 'lucide-react';
import { formatCOP } from '../../utils/currency';
import { useEffect, useState } from 'react';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

interface DashboardStats {
  totalVentas: number;
  pedidosHoy: number;
  totalClientes: number;
  totalProductos: number;
  stockTotal: number;
  pedidosPendientes: number;
}

interface ActividadReciente {
  id: string;
  tipo: 'pedido' | 'cliente' | 'factura' | 'producto';
  descripcion: string;
  tiempo: string;
}

export function DashboardScreen() {
  const [stats, setStats] = useState<DashboardStats>({
    totalVentas: 0,
    pedidosHoy: 0,
    totalClientes: 0,
    totalProductos: 0,
    stockTotal: 0,
    pedidosPendientes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [actividades, setActividades] = useState<ActividadReciente[]>([]);

  useEffect(() => {
    cargarDashboard();
  }, []);

  const cargarDashboard = async () => {
    try {
      setLoading(true);
      
      // Cargar datos en paralelo
      const [productos, clientes, pedidos, facturas] = await Promise.all([
        api.productos.getAll().catch(() => []),
        api.clientes.getAll().catch(() => []),
        api.pedidos.getAll().catch(() => []),
        api.facturas.getAll().catch(() => []),
      ]);

      // Calcular estadísticas
      const totalProductos = productos?.length || 0;
      const stockTotal = productos?.reduce((acc: number, p: any) => acc + (Number(p.stock) || 0), 0) || 0;
      const totalClientes = clientes?.length || 0;
      
      const pedidosArray = Array.isArray(pedidos) ? pedidos : [];
      const facturasArray = Array.isArray(facturas) ? facturas : [];
      
      // Pedidos de hoy
      const hoy = new Date().toISOString().split('T')[0];
      const pedidosHoy = pedidosArray.filter((p: any) => 
        p.fecha?.startsWith(hoy)
      ).length;
      
      // Pedidos pendientes
      const pedidosPendientes = pedidosArray.filter((p: any) => 
        p.estado === 'Pendiente'
      ).length;
      
      // Total de ventas (suma de facturas)
      const totalVentas = facturasArray.reduce((acc: number, f: any) => 
        acc + (Number(f.total) || 0), 0
      );

      setStats({
        totalVentas,
        pedidosHoy,
        totalClientes,
        totalProductos,
        stockTotal,
        pedidosPendientes,
      });

      // Generar actividades recientes
      const actividadesTemp: ActividadReciente[] = [];
      
      // Últimos 3 pedidos
      const ultimosPedidos = pedidosArray.slice(0, 3);
      ultimosPedidos.forEach((pedido: any) => {
        actividadesTemp.push({
          id: pedido.id,
          tipo: 'pedido',
          descripcion: `Pedido ${pedido.id.slice(0, 8)} - ${pedido.estado}`,
          tiempo: calcularTiempoTranscurrido(pedido.fecha),
        });
      });

      setActividades(actividadesTemp);
      
    } catch (error: any) {
      console.error('Error cargando dashboard:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const calcularTiempoTranscurrido = (fecha: string) => {
    if (!fecha) return 'Hace un momento';
    
    const ahora = new Date();
    const fechaPedido = new Date(fecha);
    const diff = ahora.getTime() - fechaPedido.getTime();
    
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);
    
    if (minutos < 1) return 'Hace un momento';
    if (minutos < 60) return `Hace ${minutos} min`;
    if (horas < 24) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
  };

  const statsCards = [
    { 
      icon: DollarSign, 
      label: 'Ventas Totales', 
      value: formatCOP(stats.totalVentas), 
      color: 'from-green-500 to-green-600' 
    },
    { 
      icon: ShoppingBag, 
      label: 'Pedidos Hoy', 
      value: stats.pedidosHoy.toString(), 
      color: 'from-blue-500 to-blue-600',
      badge: stats.pedidosPendientes > 0 ? `${stats.pedidosPendientes} pendientes` : undefined
    },
    { 
      icon: Users, 
      label: 'Clientes', 
      value: stats.totalClientes.toString(), 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      icon: Package, 
      label: 'Productos', 
      value: stats.totalProductos.toString(), 
      color: 'from-amber-500 to-amber-600',
      badge: `${stats.stockTotal} en stock`
    },
  ];

  if (loading) {
    return (
      <div className="p-4 h-full flex items-center justify-center" style={{ backgroundColor: '#F4F6F8' }}>
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-amber-600 mx-auto mb-3" />
          <p className="text-sm text-slate-500">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-xl p-4 shadow-lg">
        <h2>Dashboard Irakaworld</h2>
        <p className="text-sm opacity-90 mt-1">Resumen de tu negocio artesanal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow-md`}>
              <Icon className="w-5 h-5 mb-2 opacity-80" />
              <p className="text-xs opacity-90">{stat.label}</p>
              <p className="text-xl mt-1">{stat.value}</p>
              {stat.badge && (
                <p className="text-xs opacity-75 mt-1">{stat.badge}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      {actividades.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3>Actividad Reciente</h3>
            <TrendingUp className="w-5 h-5 text-amber-600" />
          </div>
          <div className="space-y-3">
            {actividades.map((actividad) => (
              <div key={actividad.id} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0">
                <div className="w-2 h-2 bg-amber-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{actividad.descripcion}</p>
                  <p className="text-xs text-slate-500 mt-1">{actividad.tiempo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alertas */}
      {stats.totalProductos === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900">No hay productos en el inventario</p>
              <p className="text-xs text-amber-700 mt-1">Ve a la sección de Productos para cargar el catálogo Wayuu</p>
            </div>
          </div>
        </div>
      )}

      {stats.pedidosPendientes > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <ShoppingBag className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900">Tienes {stats.pedidosPendientes} pedido{stats.pedidosPendientes > 1 ? 's' : ''} pendiente{stats.pedidosPendientes > 1 ? 's' : ''}</p>
              <p className="text-xs text-blue-700 mt-1">Revisa la sección de Pedidos para gestionarlos</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
