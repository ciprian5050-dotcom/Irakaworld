import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Función para hashear contraseñas de forma simple (para demo)
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Función para verificar contraseña
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};

// Función para generar token simple
const generateToken = (): string => {
  return crypto.randomUUID();
};

// ============================================
// AUTENTICACIÓN
// ============================================

// Registro de usuarios
app.post('/make-server-c94f8b91/auth/signup', async (c) => {
  try {
    const { email, password, nombre, rol } = await c.req.json();

    console.log('📝 Signup request:', { email, nombre, rol });

    // Verificar si el usuario ya existe
    const existingUsers = await kv.getByPrefix('user:');
    const userExists = existingUsers.find((u: any) => u.email === email);
    
    if (userExists) {
      console.log('❌ Usuario ya existe:', email);
      return c.json({ error: 'El usuario ya existe' }, 400);
    }

    // Hashear contraseña
    const passwordHash = await hashPassword(password);
    
    // Generar ID único
    const userId = crypto.randomUUID();
    
    // Guardar usuario en KV usando el email como clave
    await kv.set(`user:${email}`, {
      id: userId,
      email,
      passwordHash,
      nombre,
      rol,
      activo: true,
      fechaCreacion: new Date().toISOString()
    });

    console.log('✅ Usuario creado exitosamente:', email);

    return c.json({ 
      success: true, 
      user: { id: userId, email, nombre, rol }
    });
  } catch (error) {
    console.log('❌ Error en signup:', error);
    return c.json({ error: 'Error al crear usuario' }, 500);
  }
});

// Login
app.post('/make-server-c94f8b91/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    console.log('🔐 Login request:', email);

    // Buscar usuario por email
    const userData = await kv.get(`user:${email}`);

    if (!userData) {
      console.log('❌ Usuario no encontrado:', email);
      
      // Mostrar usuarios disponibles para debug
      const allUsers = await kv.getByPrefix('user:');
      console.log('📋 Usuarios disponibles:', allUsers.map((u: any) => u.email || u.usuario));
      
      return c.json({ error: 'Credenciales incorrectas' }, 401);
    }

    console.log('✅ Usuario encontrado:', email);

    // Verificar si el usuario está activo
    if (!userData.activo) {
      console.log('❌ Usuario inactivo:', email);
      return c.json({ error: 'Usuario inactivo' }, 401);
    }

    // Verificar contraseña
    const isValidPassword = await verifyPassword(password, userData.passwordHash);
    
    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta para:', email);
      return c.json({ error: 'Credenciales incorrectas' }, 401);
    }

    // Generar token
    const token = generateToken();
    
    // Guardar sesión
    await kv.set(`session:${token}`, {
      userId: userData.id,
      email: userData.email,
      createdAt: new Date().toISOString()
    });

    console.log('✅ Login exitoso:', email);

    // Registrar actividad
    await kv.set(`actividad:${Date.now()}`, {
      usuario: userData.id,
      usuarioNombre: userData.nombre,
      accion: 'Inicio de sesión',
      detalle: `${userData.nombre} inició sesión`,
      fecha: new Date().toISOString()
    });

    // Retornar sin el hash de contraseña
    const { passwordHash, ...userWithoutPassword } = userData;

    return c.json({
      success: true,
      accessToken: token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.log('❌ Error en login:', error);
    return c.json({ error: 'Error al iniciar sesión' }, 500);
  }
});

// Verificar sesión
app.get('/make-server-c94f8b91/auth/session', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: 'No autorizado' }, 401);
    }

    // Buscar sesión
    const session = await kv.get(`session:${accessToken}`);
    
    if (!session) {
      return c.json({ error: 'Sesión inválida' }, 401);
    }

    // Obtener datos del usuario
    const userData = await kv.get(`user:${session.email}`);
    
    if (!userData || !userData.activo) {
      return c.json({ error: 'Usuario no encontrado o inactivo' }, 401);
    }

    // Retornar sin el hash de contraseña
    const { passwordHash, ...userWithoutPassword } = userData;

    return c.json({ success: true, user: userWithoutPassword });
  } catch (error) {
    console.log('Error verificando sesión:', error);
    return c.json({ error: 'Error al verificar sesión' }, 500);
  }
});

// ============================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================

const requireAuth = async (c: any, next: any) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (!accessToken) {
    return c.json({ error: 'No autorizado' }, 401);
  }

  const session = await kv.get(`session:${accessToken}`);
  
  if (!session) {
    return c.json({ error: 'Sesión inválida' }, 401);
  }

  c.set('userId', session.userId);
  c.set('userEmail', session.email);
  await next();
};

// ============================================
// CLIENTES
// ============================================

app.get('/make-server-c94f8b91/clientes', async (c) => {
  try {
    console.log('👥 Obteniendo clientes...');
    const clientes = await kv.getByPrefix('cliente:');
    console.log(`✅ Se encontraron ${clientes.length} clientes`);
    return c.json({ success: true, clientes });
  } catch (error) {
    console.log('❌ Error obteniendo clientes:', error);
    return c.json({ error: 'Error al obtener clientes' }, 500);
  }
});

app.post('/make-server-c94f8b91/clientes', async (c) => {
  try {
    const cliente = await c.req.json();
    const id = `cliente:${Date.now()}`;
    
    const nuevoCliente = {
      ...cliente,
      id,
      fechaCreacion: new Date().toISOString()
    };

    await kv.set(id, nuevoCliente);

    console.log('✅ Cliente creado:', nuevoCliente.nombre);

    return c.json({ success: true, cliente: nuevoCliente });
  } catch (error) {
    console.log('❌ Error creando cliente:', error);
    return c.json({ error: 'Error al crear cliente' }, 500);
  }
});

app.put('/make-server-c94f8b91/clientes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const clienteExistente = await kv.get(id);
    if (!clienteExistente) {
      return c.json({ error: 'Cliente no encontrado' }, 404);
    }

    const clienteActualizado = { ...clienteExistente, ...updates };
    await kv.set(id, clienteActualizado);

    console.log('✅ Cliente actualizado:', clienteActualizado.nombre);

    return c.json({ success: true, cliente: clienteActualizado });
  } catch (error) {
    console.log('❌ Error actualizando cliente:', error);
    return c.json({ error: 'Error al actualizar cliente' }, 500);
  }
});

app.delete('/make-server-c94f8b91/clientes/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const cliente = await kv.get(id);
    if (!cliente) {
      return c.json({ error: 'Cliente no encontrado' }, 404);
    }

    await kv.del(id);

    console.log('✅ Cliente eliminado:', cliente.nombre);

    return c.json({ success: true });
  } catch (error) {
    console.log('❌ Error eliminando cliente:', error);
    return c.json({ error: 'Error al eliminar cliente' }, 500);
  }
});

// ============================================
// PRODUCTOS
// ============================================

// GET productos - Público (no requiere autenticación)
app.get('/make-server-c94f8b91/productos', async (c) => {
  try {
    console.log('📦 Obteniendo productos...');
    console.log('📦 Headers recibidos:', c.req.header());
    const productos = await kv.getByPrefix('producto:');
    console.log(`✅ Se encontraron ${productos.length} productos`);
    return c.json({ success: true, productos });
  } catch (error) {
    console.log('❌ Error obteniendo productos:', error);
    return c.json({ error: 'Error al obtener productos' }, 500);
  }
});

// DELETE todos los productos (limpiar base de datos)
app.delete('/make-server-c94f8b91/productos/limpiar-todo', async (c) => {
  try {
    console.log('🗑️ Limpiando todos los productos...');
    const productos = await kv.getByPrefix('producto:');
    
    // Eliminar cada producto
    for (const producto of productos) {
      await kv.del(producto.id);
    }
    
    console.log(`✅ Se eliminaron ${productos.length} productos`);
    return c.json({ success: true, eliminados: productos.length });
  } catch (error) {
    console.log('❌ Error limpiando productos:', error);
    return c.json({ error: 'Error al limpiar productos' }, 500);
  }
});

app.post('/make-server-c94f8b91/productos', async (c) => {
  try {
    const producto = await c.req.json();
    const id = `producto:${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    const nuevoProducto = {
      ...producto,
      id,
      fechaCreacion: new Date().toISOString()
    };

    await kv.set(id, nuevoProducto);

    console.log('✅ Producto creado:', nuevoProducto.nombre);

    return c.json({ success: true, producto: nuevoProducto });
  } catch (error) {
    console.log('❌ Error creando producto:', error);
    return c.json({ error: 'Error al crear producto' }, 500);
  }
});

app.put('/make-server-c94f8b91/productos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const productoExistente = await kv.get(id);
    if (!productoExistente) {
      return c.json({ error: 'Producto no encontrado' }, 404);
    }

    const productoActualizado = { ...productoExistente, ...updates };
    await kv.set(id, productoActualizado);

    console.log('✅ Producto actualizado:', productoActualizado.nombre);

    return c.json({ success: true, producto: productoActualizado });
  } catch (error) {
    console.log('❌ Error actualizando producto:', error);
    return c.json({ error: 'Error al actualizar producto' }, 500);
  }
});

app.delete('/make-server-c94f8b91/productos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const producto = await kv.get(id);
    if (!producto) {
      return c.json({ error: 'Producto no encontrado' }, 404);
    }

    await kv.del(id);

    console.log('✅ Producto eliminado:', producto.nombre);

    return c.json({ success: true });
  } catch (error) {
    console.log('❌ Error eliminando producto:', error);
    return c.json({ error: 'Error al eliminar producto' }, 500);
  }
});

// ============================================
// INVENTARIOS
// ============================================

app.get('/make-server-c94f8b91/inventarios', requireAuth, async (c) => {
  try {
    const inventarios = await kv.getByPrefix('inventario:');
    return c.json({ success: true, inventarios });
  } catch (error) {
    console.log('Error obteniendo inventarios:', error);
    return c.json({ error: 'Error al obtener inventarios' }, 500);
  }
});

app.post('/make-server-c94f8b91/inventarios', requireAuth, async (c) => {
  try {
    const inventario = await c.req.json();
    const id = `inventario:${Date.now()}`;
    
    const nuevoInventario = {
      ...inventario,
      id,
      fechaCreacion: new Date().toISOString()
    };

    await kv.set(id, nuevoInventario);

    // Registrar actividad
    const userId = c.get('userId');
    await kv.set(`actividad:${Date.now()}`, {
      usuario: userId,
      accion: 'Actualizar Inventario',
      detalle: `Producto: ${inventario.producto}`,
      fecha: new Date().toISOString()
    });

    return c.json({ success: true, inventario: nuevoInventario });
  } catch (error) {
    console.log('Error creando inventario:', error);
    return c.json({ error: 'Error al crear inventario' }, 500);
  }
});

app.put('/make-server-c94f8b91/inventarios/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const inventarioExistente = await kv.get(id);
    if (!inventarioExistente) {
      return c.json({ error: 'Inventario no encontrado' }, 404);
    }

    const inventarioActualizado = { ...inventarioExistente, ...updates };
    await kv.set(id, inventarioActualizado);

    return c.json({ success: true, inventario: inventarioActualizado });
  } catch (error) {
    console.log('Error actualizando inventario:', error);
    return c.json({ error: 'Error al actualizar inventario' }, 500);
  }
});

// ============================================
// PEDIDOS
// ============================================

app.get('/make-server-c94f8b91/pedidos', async (c) => {
  try {
    console.log('📋 Obteniendo pedidos...');
    const pedidos = await kv.getByPrefix('pedido:');
    console.log(`✅ Se encontraron ${pedidos.length} pedidos`);
    return c.json({ success: true, pedidos });
  } catch (error) {
    console.log('❌ Error obteniendo pedidos:', error);
    return c.json({ error: 'Error al obtener pedidos' }, 500);
  }
});

app.post('/make-server-c94f8b91/pedidos', async (c) => {
  try {
    const pedido = await c.req.json();
    const id = `pedido:${Date.now()}`;
    
    const nuevoPedido = {
      ...pedido,
      id,
      fechaCreacion: new Date().toISOString()
    };

    await kv.set(id, nuevoPedido);

    console.log('✅ Pedido creado:', id);

    return c.json({ success: true, pedido: nuevoPedido });
  } catch (error) {
    console.log('❌ Error creando pedido:', error);
    return c.json({ error: 'Error al crear pedido' }, 500);
  }
});

app.put('/make-server-c94f8b91/pedidos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const pedidoExistente = await kv.get(id);
    if (!pedidoExistente) {
      return c.json({ error: 'Pedido no encontrado' }, 404);
    }

    const pedidoActualizado = { ...pedidoExistente, ...updates };
    await kv.set(id, pedidoActualizado);

    console.log('✅ Pedido actualizado:', id);

    return c.json({ success: true, pedido: pedidoActualizado });
  } catch (error) {
    console.log('❌ Error actualizando pedido:', error);
    return c.json({ error: 'Error al actualizar pedido' }, 500);
  }
});

app.delete('/make-server-c94f8b91/pedidos/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const pedido = await kv.get(id);
    if (!pedido) {
      return c.json({ error: 'Pedido no encontrado' }, 404);
    }

    await kv.del(id);

    console.log('✅ Pedido eliminado:', id);

    return c.json({ success: true });
  } catch (error) {
    console.log('❌ Error eliminando pedido:', error);
    return c.json({ error: 'Error al eliminar pedido' }, 500);
  }
});

// ============================================
// LÍNEAS DE PEDIDO
// ============================================

// GET todas las líneas de pedido - Público
app.get('/make-server-c94f8b91/lineas-pedido', async (c) => {
  try {
    const lineasPedido = await kv.getByPrefix('lineapedido:');
    return c.json({ success: true, lineasPedido });
  } catch (error) {
    return c.json({ error: 'Error al obtener líneas de pedido' }, 500);
  }
});

// GET líneas de un pedido específico - Público
app.get('/make-server-c94f8b91/lineas-pedido/pedido/:pedidoId', async (c) => {
  try {
    const pedidoId = c.req.param('pedidoId');
    const todasLasLineas = await kv.getByPrefix('lineapedido:');
    const lineasPedido = todasLasLineas.filter((l: any) => l.pedidoId === pedidoId);
    return c.json({ success: true, lineasPedido });
  } catch (error) {
    return c.json({ error: 'Error al obtener líneas del pedido' }, 500);
  }
});

app.post('/make-server-c94f8b91/lineas-pedido', async (c) => {
  try {
    const linea = await c.req.json();
    const id = `lineapedido:${Date.now()}`;
    
    const nuevaLinea = {
      ...linea,
      id,
      fechaCreacion: new Date().toISOString()
    };

    await kv.set(id, nuevaLinea);

    console.log('✅ Línea de pedido creada:', id);

    return c.json({ success: true, linea: nuevaLinea });
  } catch (error) {
    console.log('❌ Error creando línea de pedido:', error);
    return c.json({ error: 'Error al crear línea de pedido' }, 500);
  }
});

app.put('/make-server-c94f8b91/lineas-pedido/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const lineaExistente = await kv.get(id);
    if (!lineaExistente) {
      return c.json({ error: 'Línea de pedido no encontrada' }, 404);
    }

    const lineaActualizada = { ...lineaExistente, ...updates };
    await kv.set(id, lineaActualizada);

    console.log('✅ Línea de pedido actualizada:', id);

    return c.json({ success: true, linea: lineaActualizada });
  } catch (error) {
    console.log('❌ Error actualizando línea de pedido:', error);
    return c.json({ error: 'Error al actualizar línea de pedido' }, 500);
  }
});

app.delete('/make-server-c94f8b91/lineas-pedido/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const linea = await kv.get(id);
    if (!linea) {
      return c.json({ error: 'Línea de pedido no encontrada' }, 404);
    }

    await kv.del(id);

    console.log('✅ Línea de pedido eliminada:', id);

    return c.json({ success: true });
  } catch (error) {
    console.log('❌ Error eliminando línea de pedido:', error);
    return c.json({ error: 'Error al eliminar línea de pedido' }, 500);
  }
});

// ============================================
// KARDEX DE INVENTARIO
// ============================================

// GET todos los movimientos de kardex
app.get('/make-server-c94f8b91/kardex', async (c) => {
  try {
    console.log('📊 Obteniendo movimientos de kardex...');
    const movimientos = await kv.getByPrefix('kardex:');
    console.log(`✅ Se encontraron ${movimientos.length} movimientos`);
    return c.json({ success: true, movimientos });
  } catch (error) {
    console.log('❌ Error obteniendo kardex:', error);
    return c.json({ error: 'Error al obtener movimientos de kardex' }, 500);
  }
});

// GET movimientos de kardex por producto
app.get('/make-server-c94f8b91/kardex/producto/:productoId', async (c) => {
  try {
    const productoId = c.req.param('productoId');
    console.log('📊 Obteniendo kardex del producto:', productoId);
    
    const todosLosMovimientos = await kv.getByPrefix('kardex:');
    const movimientos = todosLosMovimientos.filter((m: any) => m.productoId === productoId);
    
    // Ordenar por fecha descendente
    movimientos.sort((a: any, b: any) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    
    console.log(`✅ Se encontraron ${movimientos.length} movimientos para el producto`);
    return c.json({ success: true, movimientos });
  } catch (error) {
    console.log('❌ Error obteniendo kardex del producto:', error);
    return c.json({ error: 'Error al obtener kardex del producto' }, 500);
  }
});

// POST crear movimiento de kardex
app.post('/make-server-c94f8b91/kardex', async (c) => {
  try {
    const datos = await c.req.json();
    console.log('📝 Creando movimiento de kardex:', datos);
    
    const { productoId, tipo, cantidad, referencia, notas, usuario } = datos;
    
    if (!productoId || !tipo || !cantidad) {
      return c.json({ error: 'Faltan campos requeridos' }, 400);
    }
    
    // Obtener producto actual
    const producto = await kv.get(productoId);
    if (!producto) {
      return c.json({ error: 'Producto no encontrado' }, 404);
    }
    
    // Calcular nuevo stock según el tipo de movimiento
    let nuevoStock = Number(producto.stock) || 0;
    const cantidadNum = Number(cantidad);
    
    if (tipo === 'entrada' || tipo === 'compra' || tipo === 'ajuste_entrada') {
      nuevoStock += cantidadNum;
    } else if (tipo === 'salida' || tipo === 'venta' || tipo === 'ajuste_salida') {
      nuevoStock -= cantidadNum;
      if (nuevoStock < 0) {
        return c.json({ error: 'Stock insuficiente' }, 400);
      }
    }
    
    // Crear movimiento de kardex
    const movimiento = {
      id: `kardex:${Date.now()}-${crypto.randomUUID()}`,
      productoId,
      productoNombre: producto.nombre,
      tipo, // 'entrada', 'salida', 'compra', 'venta', 'ajuste_entrada', 'ajuste_salida'
      cantidad: cantidadNum,
      stockAnterior: producto.stock,
      stockNuevo: nuevoStock,
      referencia: referencia || '',
      notas: notas || '',
      usuario: usuario || 'Sistema',
      fecha: new Date().toISOString(),
    };
    
    // Guardar movimiento
    await kv.set(movimiento.id, movimiento);
    
    // Actualizar stock del producto
    await kv.set(productoId, {
      ...producto,
      stock: nuevoStock,
    });
    
    console.log('✅ Movimiento de kardex creado:', movimiento.id);
    return c.json({ success: true, movimiento });
  } catch (error) {
    console.log('❌ Error creando movimiento de kardex:', error);
    return c.json({ error: 'Error al crear movimiento de kardex' }, 500);
  }
});

// GET resumen de existencias (todos los productos con su stock actual)
app.get('/make-server-c94f8b91/kardex/existencias', async (c) => {
  try {
    console.log('📊 Obteniendo resumen de existencias...');
    
    const productos = await kv.getByPrefix('producto:');
    
    // Mapear productos con información relevante para kardex
    const existencias = productos.map((p: any) => ({
      id: p.id,
      nombre: p.nombre,
      categoria: p.categoria,
      stock: Number(p.stock) || 0,
      precio: Number(p.precio) || 0,
      valorInventario: (Number(p.stock) || 0) * (Number(p.precio) || 0),
      imagen: p.imagen,
    }));
    
    // Calcular totales
    const totalProductos = existencias.length;
    const totalUnidades = existencias.reduce((sum: number, p: any) => sum + p.stock, 0);
    const valorTotal = existencias.reduce((sum: number, p: any) => sum + p.valorInventario, 0);
    
    console.log(`✅ Resumen: ${totalProductos} productos, ${totalUnidades} unidades, valor: ${valorTotal}`);
    
    return c.json({ 
      success: true, 
      existencias,
      resumen: {
        totalProductos,
        totalUnidades,
        valorTotal,
      }
    });
  } catch (error) {
    console.log('❌ Error obteniendo existencias:', error);
    return c.json({ error: 'Error al obtener existencias' }, 500);
  }
});

// ============================================
// FACTURAS
// ============================================

app.get('/make-server-c94f8b91/facturas', async (c) => {
  try {
    console.log('💰 Obteniendo facturas...');
    const facturas = await kv.getByPrefix('factura:');
    console.log(`✅ Se encontraron ${facturas.length} facturas`);
    return c.json({ success: true, facturas });
  } catch (error) {
    console.log('❌ Error obteniendo facturas:', error);
    return c.json({ error: 'Error al obtener facturas' }, 500);
  }
});

app.post('/make-server-c94f8b91/facturas', async (c) => {
  try {
    const factura = await c.req.json();
    const id = `factura:${Date.now()}`;
    
    const nuevaFactura = {
      ...factura,
      id,
      fechaCreacion: new Date().toISOString()
    };

    await kv.set(id, nuevaFactura);

    console.log('✅ Factura creada:', id);

    return c.json({ success: true, factura: nuevaFactura });
  } catch (error) {
    console.log('❌ Error creando factura:', error);
    return c.json({ error: 'Error al crear factura' }, 500);
  }
});

app.put('/make-server-c94f8b91/facturas/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const facturaExistente = await kv.get(id);
    if (!facturaExistente) {
      return c.json({ error: 'Factura no encontrada' }, 404);
    }

    const facturaActualizada = { ...facturaExistente, ...updates };
    await kv.set(id, facturaActualizada);

    console.log('✅ Factura actualizada:', id);

    return c.json({ success: true, factura: facturaActualizada });
  } catch (error) {
    console.log('❌ Error actualizando factura:', error);
    return c.json({ error: 'Error al actualizar factura' }, 500);
  }
});

app.delete('/make-server-c94f8b91/facturas/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    const factura = await kv.get(id);
    if (!factura) {
      return c.json({ error: 'Factura no encontrada' }, 404);
    }

    await kv.del(id);

    console.log('✅ Factura eliminada:', id);

    return c.json({ success: true });
  } catch (error) {
    console.log('❌ Error eliminando factura:', error);
    return c.json({ error: 'Error al eliminar factura' }, 500);
  }
});

// ============================================
// USUARIOS (Solo Admin)
// ============================================

app.get('/make-server-c94f8b91/usuarios', requireAuth, async (c) => {
  try {
    const usuarios = await kv.getByPrefix('user:');
    
    // Ocultar contraseñas y datos sensibles
    const usuariosSeguros = usuarios.map((u: any) => ({
      id: u.id,
      email: u.email,
      nombre: u.nombre,
      rol: u.rol,
      activo: u.activo,
      fechaCreacion: u.fechaCreacion
    }));

    return c.json({ success: true, usuarios: usuariosSeguros });
  } catch (error) {
    console.log('Error obteniendo usuarios:', error);
    return c.json({ error: 'Error al obtener usuarios' }, 500);
  }
});

app.put('/make-server-c94f8b91/usuarios/:id', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    
    const usuarioExistente = await kv.get(`user:${id}`);
    if (!usuarioExistente) {
      return c.json({ error: 'Usuario no encontrado' }, 404);
    }

    const usuarioActualizado = { ...usuarioExistente, ...updates };
    await kv.set(`user:${id}`, usuarioActualizado);

    // Registrar actividad
    const userId = c.get('userId');
    await kv.set(`actividad:${Date.now()}`, {
      usuario: userId,
      accion: 'Actualizar Usuario',
      detalle: `Usuario: ${usuarioActualizado.nombre}`,
      fecha: new Date().toISOString()
    });

    return c.json({ success: true, usuario: usuarioActualizado });
  } catch (error) {
    console.log('Error actualizando usuario:', error);
    return c.json({ error: 'Error al actualizar usuario' }, 500);
  }
});

// ============================================
// ACTIVIDAD
// ============================================

app.get('/make-server-c94f8b91/actividad', requireAuth, async (c) => {
  try {
    const actividades = await kv.getByPrefix('actividad:');
    
    // Ordenar por fecha descendente
    actividades.sort((a: any, b: any) => 
      new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    );

    return c.json({ success: true, actividades });
  } catch (error) {
    console.log('Error obteniendo actividades:', error);
    return c.json({ error: 'Error al obtener actividades' }, 500);
  }
});

// ============================================
// DASHBOARD STATS
// ============================================

app.get('/make-server-c94f8b91/dashboard/stats', requireAuth, async (c) => {
  try {
    const clientes = await kv.getByPrefix('cliente:');
    const productos = await kv.getByPrefix('producto:');
    const pedidos = await kv.getByPrefix('pedido:');
    const facturas = await kv.getByPrefix('factura:');

    // Calcular totales
    const totalVentas = facturas.reduce((sum: number, f: any) => sum + (f.total || 0), 0);
    const pedidosPendientes = pedidos.filter((p: any) => p.estado === 'Pendiente').length;

    return c.json({
      success: true,
      stats: {
        totalClientes: clientes.length,
        totalProductos: productos.length,
        totalPedidos: pedidos.length,
        totalFacturas: facturas.length,
        totalVentas,
        pedidosPendientes
      }
    });
  } catch (error) {
    console.log('Error obteniendo estadísticas:', error);
    return c.json({ error: 'Error al obtener estadísticas' }, 500);
  }
});

// Ruta de prueba
app.get('/make-server-c94f8b91/health', (c) => {
  return c.json({ status: 'ok', message: 'Servidor Irakaworld funcionando correctamente' });
});

// ============================================
// INICIALIZACIÓN - Crear usuario admin si no existe
// ============================================

app.post('/make-server-c94f8b91/init/admin', async (c) => {
  try {
    console.log('🔧 Inicializando usuario admin...');
    
    const email = 'admin@irakaworld.com';
    const password = 'Iraka2025';
    
    // Verificar si ya existe
    const existingUser = await kv.get(`user:${email}`);
    
    if (existingUser) {
      console.log('✅ Usuario admin ya existe');
      return c.json({ 
        success: true, 
        message: 'Usuario admin ya existe',
        user: {
          email: existingUser.email,
          nombre: existingUser.nombre,
          rol: existingUser.rol
        }
      });
    }
    
    // Crear usuario admin
    const passwordHash = await hashPassword(password);
    const userId = crypto.randomUUID();
    
    await kv.set(`user:${email}`, {
      id: userId,
      email,
      passwordHash,
      nombre: 'Administrador Principal',
      rol: 'Admin',
      activo: true,
      fechaCreacion: new Date().toISOString()
    });
    
    console.log('✅ Usuario admin creado exitosamente');
    
    return c.json({ 
      success: true, 
      message: 'Usuario admin creado exitosamente',
      user: { id: userId, email, nombre: 'Administrador Principal', rol: 'Admin' }
    });
  } catch (error) {
    console.log('❌ Error inicializando admin:', error);
    return c.json({ error: 'Error al inicializar admin' }, 500);
  }
});

// ============================================
// DEBUG ROUTES
// ============================================

// Ruta de DEBUG - Ver todos los usuarios (solo para debugging)
app.get('/make-server-c94f8b91/debug/users', async (c) => {
  try {
    const users = await kv.getByPrefix('user:');
    console.log('📋 Total de usuarios en BD:', users.length);
    
    // Ocultar contraseñas
    const usersWithoutPasswords = users.map((u: any) => ({
      email: u.email,
      nombre: u.nombre,
      rol: u.rol,
      activo: u.activo
    }));
    
    return c.json({ 
      success: true, 
      count: users.length,
      users: usersWithoutPasswords 
    });
  } catch (error) {
    console.log('Error obteniendo usuarios debug:', error);
    return c.json({ error: 'Error' }, 500);
  }
});

// Ruta de DEBUG - Ver usuario específico con hash (SOLO PARA DEBUG)
app.get('/make-server-c94f8b91/debug/user/:email', async (c) => {
  try {
    const email = c.req.param('email');
    console.log('🔍 Buscando usuario:', email);
    
    const userData = await kv.get(`user:${email}`);
    
    if (!userData) {
      return c.json({ error: 'Usuario no encontrado', email, keyUsed: `user:${email}` }, 404);
    }
    
    // Mostrar TODO (incluido hash para debug)
    return c.json({ 
      success: true, 
      user: {
        email: userData.email,
        nombre: userData.nombre,
        rol: userData.rol,
        activo: userData.activo,
        passwordHash: userData.passwordHash, // SOLO PARA DEBUG
        id: userData.id,
        fechaCreacion: userData.fechaCreacion
      }
    });
  } catch (error) {
    console.log('Error obteniendo usuario:', error);
    return c.json({ error: 'Error' }, 500);
  }
});

// Ruta de DEBUG - Test de login con detalles
app.post('/make-server-c94f8b91/debug/test-login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    console.log('🧪 TEST LOGIN para:', email);
    
    // Buscar usuario
    const userData = await kv.get(`user:${email}`);
    
    if (!userData) {
      return c.json({ 
        success: false,
        error: 'Usuario no encontrado',
        keySearched: `user:${email}`,
        allKeys: (await kv.getByPrefix('user:')).map((u: any) => u.email)
      });
    }
    
    // Calcular hash de la contraseña ingresada
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Comparar
    const matches = passwordHash === userData.passwordHash;
    
    return c.json({
      success: matches,
      details: {
        email,
        userFound: true,
        userActive: userData.activo,
        passwordMatches: matches,
        inputPasswordHash: passwordHash,
        storedPasswordHash: userData.passwordHash,
        hashesMatch: passwordHash === userData.passwordHash
      }
    });
  } catch (error) {
    console.log('Error en test login:', error);
    return c.json({ error: 'Error' }, 500);
  }
});

// Iniciar servidor
Deno.serve(app.fetch);