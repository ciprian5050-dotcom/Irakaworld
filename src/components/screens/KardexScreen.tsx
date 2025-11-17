import { BarChart3, Package, TrendingUp, TrendingDown, Search, Plus, History, Loader2, FileDown, FileSpreadsheet } from 'lucide-react';
import { formatCOP } from '../../utils/currency';
import { useState, useEffect } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';
import * as XLSX from 'xlsx';

interface Existencia {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  valorInventario: number;
  imagen: string;
}

interface Movimiento {
  id: string;
  productoId: string;
  productoNombre: string;
  tipo: string;
  cantidad: number;
  stockAnterior: number;
  stockNuevo: number;
  referencia: string;
  notas: string;
  usuario: string;
  fecha: string;
}

export function KardexScreen() {
  const [existencias, setExistencias] = useState<Existencia[]>([]);
  const [resumen, setResumen] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState<string | null>(null);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);
  const [mostrarFormularioMovimiento, setMostrarFormularioMovimiento] = useState(false);
  const [mostrarMenuExportar, setMostrarMenuExportar] = useState(false);

  // Cargar existencias desde la API
  useEffect(() => {
    cargarExistencias();
  }, []);

  // Cerrar menú de exportar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (mostrarMenuExportar && !target.closest('.menu-exportar-container')) {
        setMostrarMenuExportar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mostrarMenuExportar]);

  const cargarExistencias = async () => {
    try {
      setLoading(true);
      const resultado = await api.kardex.getExistencias();
      console.log('📊 Existencias cargadas:', resultado);
      
      setExistencias(resultado.existencias || []);
      setResumen(resultado.resumen || {});
    } catch (error: any) {
      console.error('Error cargando existencias:', error);
      toast.error('Error al cargar existencias');
      setExistencias([]);
      setResumen({});
    } finally {
      setLoading(false);
    }
  };

  const cargarMovimientos = async (productoId: string) => {
    try {
      setLoadingMovimientos(true);
      const movs = await api.kardex.getMovimientosPorProducto(productoId);
      console.log('📋 Movimientos cargados:', movs);
      setMovimientos(movs);
    } catch (error: any) {
      console.error('Error cargando movimientos:', error);
      toast.error('Error al cargar movimientos');
      setMovimientos([]);
    } finally {
      setLoadingMovimientos(false);
    }
  };

  const handleVerMovimientos = (productoId: string) => {
    setProductoSeleccionado(productoId);
    cargarMovimientos(productoId);
  };

  const handleCerrarMovimientos = () => {
    setProductoSeleccionado(null);
    setMovimientos([]);
  };

  const handleAgregarMovimiento = () => {
    setMostrarFormularioMovimiento(true);
  };

  // Exportar existencias a Excel
  const exportarExistenciasExcel = () => {
    try {
      // Preparar datos para Excel
      const datosExcel = existencias.map(e => ({
        'Código': e.id.split(':')[1] || e.id,
        'Producto': e.nombre,
        'Categoría': e.categoria,
        'Stock': e.stock,
        'Precio Unitario': e.precio,
        'Valor Inventario': e.valorInventario,
      }));

      // Agregar fila de totales
      datosExcel.push({
        'Código': '',
        'Producto': 'TOTALES',
        'Categoría': '',
        'Stock': resumen?.totalUnidades || 0,
        'Precio Unitario': '',
        'Valor Inventario': resumen?.valorTotal || 0,
      });

      // Crear libro y hoja
      const ws = XLSX.utils.json_to_sheet(datosExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Existencias');

      // Ajustar anchos de columna
      const colWidths = [
        { wch: 15 }, // Código
        { wch: 30 }, // Producto
        { wch: 15 }, // Categoría
        { wch: 10 }, // Stock
        { wch: 15 }, // Precio
        { wch: 18 }, // Valor
      ];
      ws['!cols'] = colWidths;

      // Generar archivo
      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Kardex_Existencias_${fecha}.xlsx`);
      
      toast.success('Archivo Excel descargado exitosamente');
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      toast.error('Error al generar archivo Excel');
    }
  };

  // Exportar movimientos completos a Excel
  const exportarMovimientosExcel = async () => {
    try {
      toast.info('Preparando reporte de movimientos...');
      
      // Obtener todos los movimientos
      const todosMovimientos = await api.kardex.getMovimientos();
      
      if (todosMovimientos.length === 0) {
        toast.warning('No hay movimientos para exportar');
        return;
      }

      // Preparar datos para Excel
      const datosExcel = todosMovimientos.map((m: Movimiento) => ({
        'Fecha': new Date(m.fecha).toLocaleString('es-CO'),
        'Producto': m.productoNombre,
        'Tipo': formatearTipo(m.tipo),
        'Cantidad': m.cantidad,
        'Stock Anterior': m.stockAnterior,
        'Stock Nuevo': m.stockNuevo,
        'Referencia': m.referencia || '-',
        'Notas': m.notas || '-',
        'Usuario': m.usuario,
      }));

      // Crear libro y hoja
      const ws = XLSX.utils.json_to_sheet(datosExcel);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Movimientos');

      // Ajustar anchos de columna
      const colWidths = [
        { wch: 18 }, // Fecha
        { wch: 30 }, // Producto
        { wch: 15 }, // Tipo
        { wch: 10 }, // Cantidad
        { wch: 12 }, // Stock Anterior
        { wch: 12 }, // Stock Nuevo
        { wch: 20 }, // Referencia
        { wch: 30 }, // Notas
        { wch: 15 }, // Usuario
      ];
      ws['!cols'] = colWidths;

      // Generar archivo
      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Kardex_Movimientos_${fecha}.xlsx`);
      
      toast.success('Archivo Excel descargado exitosamente');
    } catch (error) {
      console.error('Error exportando movimientos a Excel:', error);
      toast.error('Error al generar archivo Excel');
    }
  };

  // Exportar reporte completo (existencias + movimientos)
  const exportarReporteCompleto = async () => {
    try {
      toast.info('Generando reporte completo...');
      
      // Obtener todos los movimientos
      const todosMovimientos = await api.kardex.getMovimientos();
      
      // Preparar datos de existencias
      const datosExistencias = existencias.map(e => ({
        'Código': e.id.split(':')[1] || e.id,
        'Producto': e.nombre,
        'Categoría': e.categoria,
        'Stock': e.stock,
        'Precio Unitario': e.precio,
        'Valor Inventario': e.valorInventario,
      }));

      // Agregar fila de totales
      datosExistencias.push({
        'Código': '',
        'Producto': 'TOTALES',
        'Categoría': '',
        'Stock': resumen?.totalUnidades || 0,
        'Precio Unitario': '',
        'Valor Inventario': resumen?.valorTotal || 0,
      });

      // Preparar datos de movimientos
      const datosMovimientos = todosMovimientos.map((m: Movimiento) => ({
        'Fecha': new Date(m.fecha).toLocaleString('es-CO'),
        'Producto': m.productoNombre,
        'Tipo': formatearTipo(m.tipo),
        'Cantidad': m.cantidad,
        'Stock Anterior': m.stockAnterior,
        'Stock Nuevo': m.stockNuevo,
        'Referencia': m.referencia || '-',
        'Notas': m.notas || '-',
        'Usuario': m.usuario,
      }));

      // Crear libro con múltiples hojas
      const wb = XLSX.utils.book_new();

      // Hoja 1: Resumen
      const wsResumen = XLSX.utils.json_to_sheet([
        { 'Concepto': 'Total Productos', 'Valor': resumen?.totalProductos || 0 },
        { 'Concepto': 'Total Unidades', 'Valor': resumen?.totalUnidades || 0 },
        { 'Concepto': 'Valor Total Inventario (COP)', 'Valor': resumen?.valorTotal || 0 },
        { 'Concepto': '', 'Valor': '' },
        { 'Concepto': 'Fecha del Reporte', 'Valor': new Date().toLocaleString('es-CO') },
      ]);
      XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');

      // Hoja 2: Existencias
      const wsExistencias = XLSX.utils.json_to_sheet(datosExistencias);
      wsExistencias['!cols'] = [
        { wch: 15 }, { wch: 30 }, { wch: 15 }, 
        { wch: 10 }, { wch: 15 }, { wch: 18 }
      ];
      XLSX.utils.book_append_sheet(wb, wsExistencias, 'Existencias');

      // Hoja 3: Movimientos (si hay)
      if (datosMovimientos.length > 0) {
        const wsMovimientos = XLSX.utils.json_to_sheet(datosMovimientos);
        wsMovimientos['!cols'] = [
          { wch: 18 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, 
          { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 30 }, { wch: 15 }
        ];
        XLSX.utils.book_append_sheet(wb, wsMovimientos, 'Movimientos');
      }

      // Generar archivo
      const fecha = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Kardex_Completo_Irakaworld_${fecha}.xlsx`);
      
      toast.success('Reporte completo descargado', {
        description: datosMovimientos.length > 0 
          ? '3 hojas: Resumen, Existencias y Movimientos'
          : '2 hojas: Resumen y Existencias'
      });
    } catch (error) {
      console.error('Error generando reporte completo:', error);
      toast.error('Error al generar reporte completo');
    }
  };

  // Filtrar existencias por búsqueda
  const existenciasFiltradas = existencias.filter(e => 
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Encontrar producto seleccionado
  const productoActual = existencias.find(e => e.id === productoSeleccionado);

  // Formatear tipo de movimiento
  const formatearTipo = (tipo: string) => {
    const tipos: any = {
      'entrada': 'Entrada',
      'salida': 'Salida',
      'compra': 'Compra',
      'venta': 'Venta',
      'ajuste_entrada': 'Ajuste +',
      'ajuste_salida': 'Ajuste -',
    };
    return tipos[tipo] || tipo;
  };

  // Color según tipo de movimiento
  const colorTipo = (tipo: string) => {
    if (tipo.includes('entrada') || tipo === 'compra') return 'text-green-600';
    if (tipo.includes('salida') || tipo === 'venta') return 'text-red-600';
    return 'text-blue-600';
  };

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-amber-600" />
          <h2>Kardex de Inventario</h2>
        </div>
        <div className="flex gap-2">
          {/* Botón de exportar */}
          <div className="relative menu-exportar-container">
            <button 
              onClick={() => setMostrarMenuExportar(!mostrarMenuExportar)}
              className="bg-green-600 text-white p-2 rounded-lg shadow-md hover:bg-green-700 transition-colors"
              title="Descargar reportes"
            >
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            
            {/* Menú desplegable de exportación */}
            {mostrarMenuExportar && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-slate-200 z-50 w-56">
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      exportarReporteCompleto();
                      setMostrarMenuExportar(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-green-50 flex items-center gap-2 text-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-slate-700">Reporte Completo</p>
                      <p className="text-xs text-slate-500">Resumen + Existencias + Movimientos</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      exportarExistenciasExcel();
                      setMostrarMenuExportar(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-amber-50 flex items-center gap-2 text-sm"
                  >
                    <Package className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-slate-700">Solo Existencias</p>
                      <p className="text-xs text-slate-500">Stock actual y valores</p>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => {
                      exportarMovimientosExcel();
                      setMostrarMenuExportar(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-blue-50 flex items-center gap-2 text-sm"
                  >
                    <History className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-slate-700">Solo Movimientos</p>
                      <p className="text-xs text-slate-500">Historial completo</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleAgregarMovimiento}
            className="bg-amber-600 text-white p-2 rounded-lg shadow-md hover:bg-amber-700 transition-colors"
            title="Agregar movimiento"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Resumen de Inventario */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-4 h-4 text-blue-600" />
            <p className="text-xs text-slate-500">Productos</p>
          </div>
          <p className="text-xl text-blue-600">{resumen?.totalProductos || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <p className="text-xs text-slate-500">Unidades</p>
          </div>
          <p className="text-xl text-green-600">{resumen?.totalUnidades || 0}</p>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-4 h-4 text-amber-600" />
            <p className="text-xs text-slate-500">Valor Total</p>
          </div>
          <p className="text-sm text-amber-600">{formatCOP(resumen?.valorTotal || 0)}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar productos..." 
          className="bg-transparent w-full outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Lista de Existencias */}
      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
            <p className="text-sm text-slate-500">Cargando inventario...</p>
          </div>
        ) : existenciasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600">
              {existencias.length === 0 ? 'No hay productos en el inventario' : 'No se encontraron productos'}
            </p>
          </div>
        ) : (
          existenciasFiltradas.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleVerMovimientos(item.id)}
            >
              <div className="flex items-center gap-3">
                {/* Imagen del producto */}
                <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {item.imagen && item.imagen.startsWith('http') ? (
                    <ImageWithFallback
                      src={item.imagen}
                      alt={item.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : item.imagen ? (
                    <div className="text-2xl">{item.imagen}</div>
                  ) : (
                    <Package className="w-8 h-8 text-amber-300" />
                  )}
                </div>

                {/* Info del producto */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm line-clamp-1">{item.nombre}</h3>
                  <p className="text-xs text-slate-500">{item.categoria}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-600">
                      Stock: <span className={item.stock > 10 ? 'text-green-600' : item.stock > 0 ? 'text-amber-600' : 'text-red-600'}>
                        {item.stock} uds
                      </span>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-600">{formatCOP(item.precio)}</span>
                  </div>
                </div>

                {/* Valor total */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-500">Valor</p>
                  <p className="text-sm text-amber-600">{formatCOP(item.valorInventario)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Movimientos */}
      {productoSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  <h3 className="text-sm">Historial de Movimientos</h3>
                </div>
                <button onClick={handleCerrarMovimientos} className="p-1 hover:bg-amber-800 rounded-lg transition-colors">
                  <span className="text-xl leading-none">&times;</span>
                </button>
              </div>
              {productoActual && (
                <div>
                  <p className="text-sm opacity-90">{productoActual.nombre}</p>
                  <p className="text-xs opacity-75">Stock actual: {productoActual.stock} unidades</p>
                </div>
              )}
            </div>

            {/* Lista de movimientos */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {loadingMovimientos ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-amber-600 mb-2" />
                  <p className="text-sm text-slate-500">Cargando movimientos...</p>
                </div>
              ) : movimientos.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No hay movimientos registrados</p>
                </div>
              ) : (
                movimientos.map((mov) => (
                  <div key={mov.id} className="bg-slate-50 rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {mov.tipo.includes('entrada') || mov.tipo === 'compra' ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          )}
                          <span className={`text-sm ${colorTipo(mov.tipo)}`}>
                            {formatearTipo(mov.tipo)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          Cantidad: <span className={colorTipo(mov.tipo)}>{mov.cantidad} uds</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {mov.stockAnterior} → {mov.stockNuevo} unidades
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        {new Date(mov.fecha).toLocaleDateString('es-CO', { 
                          day: '2-digit', 
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    {mov.referencia && (
                      <p className="text-xs text-slate-500">
                        <span className="text-slate-400">Ref:</span> {mov.referencia}
                      </p>
                    )}
                    
                    {mov.notas && (
                      <p className="text-xs text-slate-500 italic">
                        "{mov.notas}"
                      </p>
                    )}
                    
                    <p className="text-xs text-slate-400">
                      Por: {mov.usuario}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200">
              <button
                onClick={handleCerrarMovimientos}
                className="w-full py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar movimiento */}
      {mostrarFormularioMovimiento && (
        <FormularioMovimiento
          productos={existencias}
          onClose={() => setMostrarFormularioMovimiento(false)}
          onSave={async (movimiento) => {
            try {
              await api.kardex.crearMovimiento(movimiento);
              toast.success('Movimiento registrado exitosamente');
              setMostrarFormularioMovimiento(false);
              await cargarExistencias();
              if (productoSeleccionado) {
                await cargarMovimientos(productoSeleccionado);
              }
            } catch (error: any) {
              toast.error(error.message || 'Error al registrar movimiento');
            }
          }}
        />
      )}
    </div>
  );
}

// Componente de formulario para agregar movimientos
interface FormularioMovimientoProps {
  productos: Existencia[];
  onClose: () => void;
  onSave: (movimiento: any) => void;
}

function FormularioMovimiento({ productos, onClose, onSave }: FormularioMovimientoProps) {
  const [productoId, setProductoId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [cantidad, setCantidad] = useState('');
  const [referencia, setReferencia] = useState('');
  const [notas, setNotas] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productoId || !tipo || !cantidad) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    onSave({
      productoId,
      tipo,
      cantidad: parseInt(cantidad),
      referencia,
      notas,
      usuario: currentUser.nombre || 'Usuario',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-4 flex items-center justify-between rounded-t-xl">
          <h3 className="text-sm">Registrar Movimiento</h3>
          <button onClick={onClose} className="p-1 hover:bg-amber-800 rounded-lg transition-colors">
            <span className="text-xl leading-none">&times;</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-slate-700 mb-1">Producto *</label>
            <select
              value={productoId}
              onChange={(e) => setProductoId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            >
              <option value="">Selecciona un producto</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} (Stock: {p.stock})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Tipo de movimiento *</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              required
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="compra">Compra</option>
              <option value="venta">Venta</option>
              <option value="ajuste_entrada">Ajuste de Entrada</option>
              <option value="ajuste_salida">Ajuste de Salida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Cantidad *</label>
            <input
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="10"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Referencia (opcional)</label>
            <input
              type="text"
              value={referencia}
              onChange={(e) => setReferencia(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
              placeholder="Ej: Pedido #123, Factura #456"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-700 mb-1">Notas (opcional)</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm resize-none"
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm"
            >
              Registrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}