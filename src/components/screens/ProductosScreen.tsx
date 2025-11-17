import { Package, Plus, Search, Loader2, Trash2 } from 'lucide-react';
import { formatCOP } from '../../utils/currency';
import { useState, useEffect } from 'react';
import { ProductoForm } from '../forms/ProductoForm';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';
import { inicializarProductosWayuu } from '../../utils/init-productos-wayuu';

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  imagen: string;
  descripcion?: string;
  iva?: number; // Porcentaje de IVA
}

export function ProductosScreen() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingCatalogo, setLoadingCatalogo] = useState(false);
  const [loadingLimpiar, setLoadingLimpiar] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar productos desde la API
  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const resultado = await api.productos.getAll();
      console.log('📦 Productos cargados:', resultado);
      
      // Si resultado es undefined o null, usar array vacío
      if (!resultado || !Array.isArray(resultado)) {
        console.log('⚠️ No se recibieron productos, usando array vacío');
        setProductos([]);
      } else {
        setProductos(resultado);
      }
    } catch (error: any) {
      console.error('Error cargando productos:', error);
      console.error('Error detallado:', error.message);
      
      // Si es error de autenticación, mostrar mensaje específico
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        toast.error('Sesión expirada. Por favor inicia sesión nuevamente.');
      } else {
        toast.error('Error al cargar productos. Verifica tu conexión.');
      }
      
      // Usar array vacío si hay error
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarProducto = async (nuevoProducto: Omit<Producto, 'id'>) => {
    try {
      await api.productos.create(nuevoProducto);
      toast.success('Producto agregado exitosamente');
      await cargarProductos(); // Recargar lista
      setMostrarFormulario(false);
    } catch (error) {
      console.error('Error agregando producto:', error);
      toast.error('Error al agregar producto');
    }
  };

  const handleLimpiarTodo = async () => {
    // Confirmar acción
    const confirmar = window.confirm(
      `⚠️ ADVERTENCIA\n\n¿Estás seguro de que deseas eliminar TODOS los productos (${productos.length})?\n\nEsta acción NO se puede deshacer.`
    );

    if (!confirmar) return;

    setLoadingLimpiar(true);
    
    try {
      console.log('🗑️ Iniciando limpieza de productos...');
      
      const resultado = await api.productos.limpiarTodo();
      
      console.log('✅ Productos eliminados:', resultado);
      
      toast.success('Base de datos limpiada exitosamente', {
        description: `Se eliminaron ${resultado.eliminados} productos`
      });
      
      // Recargar la lista (ahora vacía)
      await cargarProductos();
    } catch (error: any) {
      console.error('❌ Error limpiando productos:', error);
      toast.error('Error al limpiar la base de datos', {
        description: error.message || 'Intenta nuevamente'
      });
    } finally {
      setLoadingLimpiar(false);
    }
  };

  const handleCargarCatalogoWayuu = async () => {
    setLoadingCatalogo(true);
    
    try {
      console.log('🚀 Iniciando carga del catálogo Wayuu...');
      
      // Verificar que hay un token de sesión
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Debes iniciar sesión primero', {
          description: 'Cierra sesión y vuelve a entrar para cargar productos'
        });
        setLoadingCatalogo(false);
        return;
      }
      
      toast.info('Cargando 63 productos Wayuu...', {
        description: 'Esto puede tomar unos segundos'
      });
      
      const resultado = await inicializarProductosWayuu();
      
      console.log('✅ Catálogo cargado:', resultado);
      
      if (resultado.exitosos > 0) {
        toast.success(`¡Catálogo cargado exitosamente! 🎉`, {
          description: `${resultado.exitosos} productos Wayuu agregados`
        });
        
        // Recargar la lista de productos
        await cargarProductos();
      } else {
        toast.error('No se pudo cargar el catálogo', {
          description: 'Verifica la conexión con el servidor'
        });
      }
    } catch (error: any) {
      console.error('❌ Error cargando catálogo:', error);
      toast.error('Error al cargar el catálogo', {
        description: error.message || 'Verifica tu conexión'
      });
    } finally {
      setLoadingCatalogo(false);
    }
  };

  const handleEliminarProductosSinFoto = async () => {
    // Filtrar productos sin foto
    const productosSinFoto = productos.filter(p => 
      !p.imagen || 
      p.imagen === '' || 
      p.imagen === 'sin-imagen' ||
      (!p.imagen.startsWith('http') && !p.imagen.startsWith('data:') && p.imagen.length < 5)
    );

    if (productosSinFoto.length === 0) {
      toast.info('No hay productos sin foto', {
        description: 'Todos los productos tienen imágenes'
      });
      return;
    }

    // Confirmar acción
    const confirmar = window.confirm(
      `🖼️ ELIMINAR PRODUCTOS SIN FOTO\n\nSe encontraron ${productosSinFoto.length} productos sin imagen:\n\n${productosSinFoto.slice(0, 5).map(p => `• ${p.nombre}`).join('\n')}${productosSinFoto.length > 5 ? `\n...y ${productosSinFoto.length - 5} más` : ''}\n\n¿Deseas eliminarlos?`
    );

    if (!confirmar) return;

    setLoading(true);

    try {
      let eliminados = 0;
      
      for (const producto of productosSinFoto) {
        try {
          await api.productos.delete(producto.id);
          eliminados++;
        } catch (error) {
          console.error(`Error eliminando ${producto.nombre}:`, error);
        }
      }

      toast.success(`✅ ${eliminados} productos eliminados`, {
        description: 'Productos sin foto eliminados correctamente'
      });

      // Recargar productos
      await cargarProductos();
    } catch (error: any) {
      console.error('Error eliminando productos sin foto:', error);
      toast.error('Error al eliminar productos', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular categorías únicas
  const categorias = new Set(productos.map(p => p.categoria));

  // Calcular total de stock con validación
  const totalStock = productos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0);

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-amber-600" />
          <h2>Productos</h2>
        </div>
        <div className="flex gap-2">
          {productos.length > 0 && (
            <button 
              onClick={handleLimpiarTodo}
              disabled={loadingLimpiar}
              className="bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Limpiar todos los productos"
            >
              {loadingLimpiar ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          )}
          <button 
            onClick={() => setMostrarFormulario(true)}
            className="bg-amber-600 text-white p-2 rounded-lg shadow-md hover:bg-amber-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Formulario Modal */}
      {mostrarFormulario && (
        <ProductoForm
          onClose={() => setMostrarFormulario(false)}
          onSave={handleAgregarProducto}
        />
      )}

      {/* Search */}
      <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-sm">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar productos artesanales..." 
          className="bg-transparent w-full outline-none text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white rounded-lg p-2 shadow-sm text-center">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-lg text-amber-600">{productos.length}</p>
        </div>
        <div className="bg-white rounded-lg p-2 shadow-sm text-center">
          <p className="text-xs text-slate-500">En Stock</p>
          <p className="text-lg text-green-600">{totalStock}</p>
        </div>
        <div className="bg-white rounded-lg p-2 shadow-sm text-center">
          <p className="text-xs text-slate-500">Categorías</p>
          <p className="text-lg text-blue-600">{categorias.size}</p>
        </div>
      </div>

      {/* Botón para eliminar productos sin foto */}
      {productos.length > 0 && (
        <button
          onClick={handleEliminarProductosSinFoto}
          className="w-full bg-orange-100 border border-orange-300 text-orange-700 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors text-sm flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Limpiar Productos sin Foto
        </button>
      )}

      {/* Productos Grid */}
      <div className="grid grid-cols-2 gap-3">
        {loading ? (
          <div className="col-span-2 flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
            <p className="text-sm text-slate-500">Cargando productos...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="col-span-2 bg-white rounded-lg p-8 text-center space-y-4">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 mb-2">
              {productos.length === 0 ? 'No hay productos en el inventario' : 'No se encontraron productos'}
            </p>
            {productos.length === 0 && (
              <>
                <p className="text-xs text-slate-500 mb-4">
                  Carga el catálogo completo de productos Wayuu o agrega productos manualmente
                </p>
                
                {/* Botón destacado para cargar catálogo */}
                <button
                  onClick={handleCargarCatalogoWayuu}
                  disabled={loadingCatalogo}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                >
                  {loadingCatalogo ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Cargando catálogo...
                    </>
                  ) : (
                    <>
                      <Package className="w-5 h-5" />
                      Cargar 63 Productos Wayuu
                    </>
                  )}
                </button>
                
                <div className="text-xs text-slate-400">
                  ó
                </div>
                
                <button
                  onClick={() => setMostrarFormulario(true)}
                  className="bg-white border-2 border-amber-600 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-50 transition-colors text-sm"
                >
                  Agregar Producto Manualmente
                </button>
              </>
            )}
          </div>
        ) : (
          productosFiltrados.map((producto) => (
            <div key={producto.id} className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-full aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden mb-3">
                {producto.imagen && producto.imagen.startsWith('http') ? (
                  <ImageWithFallback
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : producto.imagen ? (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {producto.imagen}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-amber-300" />
                  </div>
                )}
              </div>
              <h3 className="text-sm line-clamp-2 min-h-[2.5rem]">{producto.nombre}</h3>
              <p className="text-xs text-slate-500 mt-1">{producto.categoria}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-amber-600">{formatCOP(Number(producto.precio) || 0)}</span>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded">Stock: {Number(producto.stock) || 0}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}