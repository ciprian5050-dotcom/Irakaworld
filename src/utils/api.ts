import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-c94f8b91`;

// Obtener token de localStorage
const getToken = () => {
  return localStorage.getItem('accessToken');
};

// Headers por defecto
const getHeaders = (includeAuth = true) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      // Para rutas públicas, no enviamos Authorization
      headers['Authorization'] = `Bearer ${publicAnonKey}`;
    }
  } else {
    // Para login/signup, siempre usar publicAnonKey
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  return headers;
};

// ============================================
// AUTENTICACIÓN
// ============================================

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      console.log('🔐 Intentando login con:', email);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Error en login:', error);
        throw new Error(error.error || 'Error al iniciar sesión');
      }

      const data = await response.json();
      console.log('✅ Login exitoso:', data.user?.nombre);
      
      // Guardar token
      if (data.accessToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(data.user));
      }

      return data;
    },

    signup: async (email: string, password: string, nombre: string, rol: string) => {
      console.log('📝 Intentando crear usuario:', email);
      
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: getHeaders(false),
        body: JSON.stringify({ email, password, nombre, rol }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('❌ Error en signup:', error);
        throw new Error(error.error || 'Error al crear usuario');
      }

      const data = await response.json();
      console.log('✅ Usuario creado:', data.user?.email);
      
      return data;
    },

    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('currentUser');
    },

    getSession: async () => {
      const response = await fetch(`${API_URL}/auth/session`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    },
  },

  // ============================================
  // CLIENTES
  // ============================================

  clientes: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/clientes`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        console.log('🔍 Response status clientes:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Error response clientes:', errorData);
          throw new Error(errorData.error || 'Error al obtener clientes');
        }

        const data = await response.json();
        console.log('✅ Data clientes recibida:', data);
        return data.clientes || [];
      } catch (error: any) {
        console.error('❌ Error en clientes.getAll:', error);
        throw error;
      }
    },

    create: async (cliente: any) => {
      const response = await fetch(`${API_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(cliente),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear cliente');
      }

      const data = await response.json();
      return data.cliente;
    },

    update: async (id: string, updates: any) => {
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar cliente');
      }

      const data = await response.json();
      return data.cliente;
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar cliente');
      }

      return response.json();
    },
  },

  // ============================================
  // PRODUCTOS
  // ============================================

  productos: {
    getAll: async () => {
      try {
        // Enviar publicAnonKey para que Supabase lo acepte
        const response = await fetch(`${API_URL}/productos`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        console.log('🔍 Response status productos:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('❌ Error response productos:', errorData);
          throw new Error(errorData.error || 'Error al obtener productos');
        }

        const data = await response.json();
        console.log('✅ Data productos recibida:', data);
        return data.productos || [];
      } catch (error: any) {
        console.error('❌ Error en productos.getAll:', error);
        throw error;
      }
    },

    create: async (producto: any) => {
      const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(producto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear producto');
      }

      const data = await response.json();
      return data.producto;
    },

    update: async (id: string, updates: any) => {
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar producto');
      }

      const data = await response.json();
      return data.producto;
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }

      return response.json();
    },

    // Limpiar todos los productos de la base de datos
    limpiarTodo: async () => {
      const response = await fetch(`${API_URL}/productos/limpiar-todo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al limpiar productos');
      }

      const data = await response.json();
      return data;
    },
  },

  // Kardex de inventario
  kardex: {
    // Obtener resumen de existencias
    getExistencias: async () => {
      const response = await fetch(`${API_URL}/kardex/existencias`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener existencias');
      }

      const data = await response.json();
      return data;
    },

    // Obtener todos los movimientos de kardex
    getMovimientos: async () => {
      const response = await fetch(`${API_URL}/kardex`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener movimientos');
      }

      const data = await response.json();
      return data.movimientos || [];
    },

    // Obtener movimientos de un producto específico
    getMovimientosPorProducto: async (productoId: string) => {
      const response = await fetch(`${API_URL}/kardex/producto/${productoId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener movimientos del producto');
      }

      const data = await response.json();
      return data.movimientos || [];
    },

    // Crear un nuevo movimiento de kardex
    crearMovimiento: async (movimiento: any) => {
      const response = await fetch(`${API_URL}/kardex`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(movimiento),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear movimiento');
      }

      const data = await response.json();
      return data.movimiento;
    },
  },

  // ============================================
  // PEDIDOS
  // ============================================

  pedidos: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/pedidos`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener pedidos');
        }

        const data = await response.json();
        return data.pedidos || [];
      } catch (error: any) {
        console.error('❌ Error en pedidos.getAll:', error);
        throw error;
      }
    },

    create: async (pedido: any) => {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(pedido),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear pedido');
      }

      const data = await response.json();
      return data.pedido;
    },

    update: async (id: string, updates: any) => {
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar pedido');
      }

      const data = await response.json();
      return data.pedido;
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar pedido');
      }

      return response.json();
    },
  },

  // ============================================
  // LÍNEAS DE PEDIDO
  // ============================================

  lineasPedido: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/lineas-pedido`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener líneas de pedido');
        }

        const data = await response.json();
        return data.lineas || [];
      } catch (error: any) {
        console.error('❌ Error en lineasPedido.getAll:', error);
        throw error;
      }
    },

    getByPedido: async (pedidoId: string) => {
      try {
        const response = await fetch(`${API_URL}/lineas-pedido/pedido/${pedidoId}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener líneas del pedido');
        }

        const data = await response.json();
        return data.lineas || [];
      } catch (error: any) {
        console.error('❌ Error en lineasPedido.getByPedido:', error);
        throw error;
      }
    },

    create: async (linea: any) => {
      const response = await fetch(`${API_URL}/lineas-pedido`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(linea),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear línea de pedido');
      }

      const data = await response.json();
      return data.linea;
    },

    update: async (id: string, updates: any) => {
      const response = await fetch(`${API_URL}/lineas-pedido/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar línea de pedido');
      }

      const data = await response.json();
      return data.linea;
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/lineas-pedido/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar línea de pedido');
      }

      return response.json();
    },
  },

  // ============================================
  // FACTURAS
  // ============================================

  facturas: {
    getAll: async () => {
      try {
        const response = await fetch(`${API_URL}/facturas`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al obtener facturas');
        }

        const data = await response.json();
        return data.facturas || [];
      } catch (error: any) {
        console.error('❌ Error en facturas.getAll:', error);
        throw error;
      }
    },

    create: async (factura: any) => {
      const response = await fetch(`${API_URL}/facturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(factura),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear factura');
      }

      const data = await response.json();
      return data.factura;
    },

    update: async (id: string, updates: any) => {
      const response = await fetch(`${API_URL}/facturas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar factura');
      }

      const data = await response.json();
      return data.factura;
    },

    delete: async (id: string) => {
      const response = await fetch(`${API_URL}/facturas/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar factura');
      }

      return response.json();
    },
  },

  // ============================================
  // USUARIOS
  // ============================================

  usuarios: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      return data.usuarios;
    },

    update: async (id: string, updates: any) => {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar usuario');
      }

      const data = await response.json();
      return data.usuario;
    },
  },

  // ============================================
  // ACTIVIDAD
  // ============================================

  actividad: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/actividad`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener actividad');
      }

      const data = await response.json();
      return data.actividades;
    },
  },

  // ============================================
  // DASHBOARD
  // ============================================

  dashboard: {
    getStats: async () => {
      const response = await fetch(`${API_URL}/dashboard/stats`, {
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Error al obtener estadísticas');
      }

      const data = await response.json();
      return data.stats;
    },
  },
};