import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Package, Search, Loader2, ArrowLeft, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatCOP } from '../../utils/currency';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { api } from '../../utils/api';
import { toast } from 'sonner@2.0.3';

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

interface CarritoItem {
  producto: Producto;
  cantidad: number;
}

export function CarritoScreen() {
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [procesandoPedido, setProcesandoPedido] = useState(false);
  const [costoEnvio, setCostoEnvio] = useState('0'); // Envío manual

  useEffect(() => {
    cargarProductos();
    cargarCarritoLocalStorage();
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem('carrito', JSON.stringify(carrito));
    } else {
      localStorage.removeItem('carrito');
    }
  }, [carrito]);

  const cargarCarritoLocalStorage = () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error('Error cargando carrito:', error);
      }
    }
  };

  const cargarProductos = async () => {
    try {
      setLoading(true);
      const resultado = await api.productos.getAll();
      
      if (Array.isArray(resultado)) {
        // Filtrar solo productos con stock disponible
        setProductos(resultado.filter((p: Producto) => p.stock > 0));
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
      toast.error('Error al cargar productos');
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const agregarAlCarrito = (producto: Producto) => {
    const itemExistente = carrito.find(item => item.producto.id === producto.id);
    
    if (itemExistente) {
      // Verificar stock disponible
      if (itemExistente.cantidad >= producto.stock) {
        toast.error('Stock insuficiente', {
          description: `Solo hay ${producto.stock} unidades disponibles`
        });
        return;
      }
      
      setCarrito(carrito.map(item =>
        item.producto.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
      toast.success('Cantidad actualizada');
    } else {
      setCarrito([...carrito, { producto, cantidad: 1 }]);
      toast.success('Producto agregado al carrito');
    }
  };

  const actualizarCantidad = (productoId: string, delta: number) => {
    setCarrito(carrito.map(item => {
      if (item.producto.id === productoId) {
        const nuevaCantidad = Math.max(1, Math.min(item.cantidad + delta, item.producto.stock));
        
        if (nuevaCantidad === item.producto.stock && delta > 0) {
          toast.error('Stock máximo alcanzado');
        }
        
        return { ...item, cantidad: nuevaCantidad };
      }
      return item;
    }));
  };

  const eliminarItem = (productoId: string) => {
    setCarrito(carrito.filter(item => item.producto.id !== productoId));
    toast.success('Producto eliminado del carrito');
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    toast.success('Carrito vaciado');
  };

  const finalizarCompra = async () => {
    if (carrito.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    setProcesandoPedido(true);

    try {
      // Obtener clientes para usar uno por defecto
      const clientes = await api.clientes.getAll();
      
      if (!Array.isArray(clientes) || clientes.length === 0) {
        toast.error('No hay clientes registrados', {
          description: 'Registra un cliente primero en la sección Clientes'
        });
        setProcesandoPedido(false);
        return;
      }

      // Crear pedido
      const nuevoPedido = {
        clienteId: clientes[0].id, // Usar primer cliente por defecto
        fecha: new Date().toISOString(),
        estado: 'Pendiente',
        total: totalConIva,
      };

      const pedidoCreado = await api.pedidos.create(nuevoPedido);
      
      // Crear líneas de pedido
      for (const item of carrito) {
        await api.lineasPedido.create({
          pedidoId: pedidoCreado.id,
          productoId: item.producto.id,
          cantidad: item.cantidad,
          precioUnitario: item.producto.precio,
          subtotal: item.producto.precio * item.cantidad,
        });
      }

      // Crear factura
      await api.facturas.create({
        pedidoId: pedidoCreado.id,
        clienteId: clientes[0].id,
        fecha: new Date().toISOString(),
        subtotal: subtotalSinIva,
        iva: totalIva,
        envio: envio, // Incluir costo de envío
        total: totalConIva,
        estado: 'Pagada',
      });

      toast.success('¡Pedido creado exitosamente! 🎉', {
        description: `Pedido #${pedidoCreado.id.slice(0, 8)} por ${formatCOP(totalConIva)}`
      });

      // Vaciar carrito
      setCarrito([]);
      
    } catch (error: any) {
      console.error('Error finalizando compra:', error);
      toast.error('Error al procesar el pedido', {
        description: error.message || 'Intenta nuevamente'
      });
    } finally {
      setProcesandoPedido(false);
    }
  };

  // Calcular subtotal sin IVA
  const subtotalSinIva = carrito.reduce((acc, item) => {
    const precioBase = item.producto.precio;
    const ivaPercent = item.producto.iva || 0;
    // Si el precio incluye IVA, extraerlo. Si no, usar precio directo
    const precioSinIva = ivaPercent > 0 ? precioBase / (1 + ivaPercent / 100) : precioBase;
    return acc + (precioSinIva * item.cantidad);
  }, 0);

  // Calcular IVA total
  const totalIva = carrito.reduce((acc, item) => {
    const precioBase = item.producto.precio;
    const ivaPercent = item.producto.iva || 0;
    const precioSinIva = ivaPercent > 0 ? precioBase / (1 + ivaPercent / 100) : precioBase;
    const ivaDelProducto = precioSinIva * (ivaPercent / 100);
    return acc + (ivaDelProducto * item.cantidad);
  }, 0);

  // Total con IVA
  const subtotal = carrito.reduce((acc, item) => acc + (item.producto.precio * item.cantidad), 0);
  const envio = parseInt(costoEnvio, 10); // Convertir a número
  const totalConIva = subtotal + envio;

  // Filtrar productos por búsqueda
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (mostrarCatalogo) {
    return (
      <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
        {/* Header Catálogo */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setMostrarCatalogo(false)}
            className="flex items-center gap-2 text-amber-600"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al Carrito</span>
          </button>
          <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm">
            {carrito.length}
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

        {/* Productos Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-10 h-10 animate-spin text-amber-600 mb-3" />
            <p className="text-sm text-slate-500">Cargando productos...</p>
          </div>
        ) : productosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No hay productos disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {productosFiltrados.map((producto) => {
              const enCarrito = carrito.find(item => item.producto.id === producto.id);
              
              return (
                <div key={producto.id} className="bg-white rounded-lg p-3 shadow-md">
                  <div className="w-full aspect-square bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden mb-2">
                    {producto.imagen && producto.imagen.startsWith('http') ? (
                      <ImageWithFallback
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-12 h-12 text-amber-300" />
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-sm line-clamp-2 min-h-[2.5rem]">{producto.nombre}</h3>
                  <p className="text-xs text-slate-500 mt-1">{producto.categoria}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-amber-600">{formatCOP(producto.precio)}</span>
                    <span className="text-xs text-slate-500">Stock: {producto.stock}</span>
                  </div>
                  
                  <button
                    onClick={() => agregarAlCarrito(producto)}
                    disabled={producto.stock === 0 || (enCarrito && enCarrito.cantidad >= producto.stock)}
                    className="w-full mt-2 bg-amber-600 text-white py-2 rounded-lg text-sm hover:bg-amber-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {enCarrito ? (
                      <>
                        <Check className="w-4 h-4" />
                        En Carrito ({enCarrito.cantidad})
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Agregar
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full" style={{ backgroundColor: '#F4F6F8' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-amber-600" />
          <h2>Carrito de Compra</h2>
        </div>
        <div className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm">
          {carrito.length}
        </div>
      </div>

      {carrito.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md space-y-4">
          <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">Tu carrito está vacío</p>
          <button
            onClick={() => setMostrarCatalogo(true)}
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors shadow-md"
          >
            Ver Catálogo de Productos
          </button>
        </div>
      ) : (
        <>
          {/* Botón Agregar Más Productos */}
          <button
            onClick={() => setMostrarCatalogo(true)}
            className="w-full bg-white border-2 border-amber-600 text-amber-600 py-3 rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar Más Productos</span>
          </button>

          {/* Items del Carrito */}
          <div className="space-y-3">
            {carrito.map((item) => (
              <div key={item.producto.id} className="bg-white rounded-lg p-4 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.producto.imagen && item.producto.imagen.startsWith('http') ? (
                      <ImageWithFallback
                        src={item.producto.imagen}
                        alt={item.producto.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-amber-300" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm line-clamp-1">{item.producto.nombre}</h3>
                    <p className="text-xs text-slate-500">{item.producto.categoria}</p>
                    <p className="text-sm text-amber-600 mt-1">{formatCOP(item.producto.precio)}</p>
                    
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-slate-100 rounded-lg">
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, -1)}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm w-8 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => actualizarCantidad(item.producto.id, 1)}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                          disabled={item.cantidad >= item.producto.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      {/* Subtotal y Eliminar */}
                      <div className="flex items-center gap-3">
                        <p className="text-sm">{formatCOP(item.producto.precio * item.cantidad)}</p>
                        <button
                          onClick={() => eliminarItem(item.producto.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón Vaciar Carrito */}
          <button
            onClick={vaciarCarrito}
            className="w-full text-red-600 text-sm hover:text-red-700 transition-colors"
          >
            Vaciar Carrito
          </button>

          {/* Resumen del Pedido */}
          <div className="bg-white rounded-lg p-4 shadow-md space-y-3">
            <h3 className="text-sm">Resumen del Pedido</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({carrito.length} productos)</span>
                <span>{formatCOP(subtotal)}</span>
              </div>
              
              {/* Campo de envío editable */}
              <div className="flex justify-between items-center text-slate-600">
                <span>Costo de Envío</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">$</span>
                  <input
                    type="number"
                    value={costoEnvio}
                    onChange={(e) => setCostoEnvio(e.target.value)}
                    className="w-24 px-2 py-1 border border-slate-300 rounded text-right text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              
              <div className="flex justify-between pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-amber-600">{formatCOP(totalConIva)}</span>
              </div>
            </div>
          </div>

          {/* Checkout Button */}
          <button
            onClick={finalizarCompra}
            disabled={procesandoPedido}
            className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3 rounded-lg shadow-lg hover:from-amber-700 hover:to-amber-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {procesandoPedido ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Procesando...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Finalizar Compra</span>
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}