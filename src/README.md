# 🌟 Irakaworld - Sistema de Ventas Artesanales

![Irakaworld Logo](https://img.shields.io/badge/Irakaworld-Artesanía_Digital-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green?style=flat-square&logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Enabled-purple?style=flat-square)

**Un mundo inspirado en la artesanía** 🎨

Aplicación móvil de ventas con gestión completa de clientes, productos, inventarios, pedidos y facturas. Diseñada específicamente para negocios artesanales colombianos.

---

## ✨ Características Principales

### 📱 **Aplicación Móvil Nativa (PWA)**
- Instalable en Android e iOS
- Funciona offline
- Experiencia nativa de app móvil
- Diseño responsive optimizado para celulares

### 💼 **Gestión Comercial Completa**
- 👥 Administración de clientes
- 📦 Catálogo de productos artesanales
- 📋 Control de inventarios
- 🛍️ Sistema de pedidos
- 🧾 Generación de facturas profesionales en PDF
- 🛒 Carrito de compras integrado

### 🔐 **Sistema Multi-Usuario**
- Autenticación segura con Supabase
- Roles: Administrador y Vendedor
- Permisos diferenciados por rol
- Múltiples usuarios simultáneos
- Registro de actividad completo

### 💾 **Base de Datos Real**
- Conectado a Supabase
- Datos persistentes
- Sincronización en tiempo real
- Sin pérdida de información

### 💵 **Manejo de Moneda Colombiana**
- Todos los precios en **Pesos Colombianos (COP)**
- Formato correcto: $45.000 COP
- Cálculos automáticos de totales
- IVA incluido en facturas

### 🎨 **Diseño Irakaworld**
- Logo personalizado en todas las pantallas
- Colores ámbar/naranja corporativos
- Tema artesanal consistente
- Interfaz intuitiva y moderna

---

## 🚀 Inicio Rápido

### 1. **Abrir la Aplicación**

Al abrir la aplicación, verás la **Pantalla de Login**.

### 2. **Crear Usuario Admin (Solo la Primera Vez)**

Haz clic en el botón verde:
```
🔨 Crear Usuario Admin
```

Esto creará automáticamente el usuario administrador con estas credenciales:
```
📧 Email: admin@irakaworld.com
🔒 Contraseña: Iraka2025
👤 Rol: Administrador
```

### 3. **Iniciar Sesión**

Los campos se auto-completarán. Solo haz clic en **"Iniciar Sesión"** y ¡listo!

---

## 📚 Documentación

### 📖 **Guías Disponibles:**

1. **[GUIA-BASE-DE-DATOS.md](./GUIA-BASE-DE-DATOS.md)**
   - Cómo funciona la base de datos
   - Gestión de usuarios
   - API y endpoints
   - Solución de problemas

2. **[GUIA-INSTALACION-PWA.md](./GUIA-INSTALACION-PWA.md)** *(si existe)*
   - Instalar en Android
   - Instalar en iPhone
   - Problemas comunes

---

## 🖼️ Pantallas de la Aplicación

### 🏠 **Dashboard**
Vista general con estadísticas:
- Total de clientes
- Total de productos
- Pedidos activos
- Ventas totales en COP

### 👥 **Clientes**
- Lista completa de clientes
- Crear nuevos clientes
- Editar información
- Datos: nombre, email, teléfono, dirección

### 📦 **Productos**
- Catálogo de artesanías
- Crear productos con:
  - Nombre
  - Categoría
  - Precio (COP)
  - Descripción
- Editar y eliminar

### 📋 **Inventarios**
- Stock por producto
- Ubicación en bodega
- Alertas de stock bajo
- Actualización de cantidades

### 🛍️ **Pedidos**
- Crear pedidos para clientes
- Estados: Pendiente, En proceso, Completado, Cancelado
- Fecha y total
- Asignar productos (líneas de pedido)

### 📝 **Líneas de Pedido**
- Detalle de cada producto en pedidos
- Cantidad y precio unitario
- Cálculos automáticos

### 🧾 **Facturas**
- Generar facturas profesionales
- **Descarga automática de PDF** con:
  - Logo Irakaworld
  - Número de factura único
  - Datos del cliente
  - Tabla de productos
  - Subtotal, IVA, Total (COP)
- Estados: Pendiente, Pagada, Vencida

### 🛒 **Carrito de Compras**
- Agregar productos rápidamente
- Calcular totales
- Convertir a pedido o factura

### 👤 **Usuarios** *(Solo Admin)*
- Crear nuevos empleados
- Asignar roles (Admin/Vendedor)
- Activar/desactivar usuarios

### 📊 **Actividad** *(Solo Admin)*
- Registro completo de acciones
- Auditoría: quién, qué, cuándo
- Filtros por tipo y usuario

---

## 🛠️ Tecnologías Utilizadas

### **Frontend**
- ⚛️ **React 18** - Framework de UI
- 📘 **TypeScript** - Tipado estático
- 🎨 **Tailwind CSS** - Estilos utility-first
- 🧩 **shadcn/ui** - Componentes de UI
- 📄 **jsPDF** - Generación de PDFs
- 🔔 **Sonner** - Notificaciones toast
- 🎯 **Lucide React** - Iconos

### **Backend**
- 🟢 **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Edge Functions
  - Key-Value Store
- 🦕 **Deno** - Runtime del servidor
- 🔥 **Hono** - Framework web ligero

### **PWA**
- 📱 **Service Worker** - Funcionamiento offline
- 📲 **Web App Manifest** - Instalación en dispositivos
- 🔄 **Cache API** - Almacenamiento local

---

## 📂 Estructura del Proyecto

```
irakaworld/
├── components/
│   ├── screens/              # Pantallas principales
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── ClientesScreen.tsx
│   │   ├── ProductosScreen.tsx
│   │   ├── InventariosScreen.tsx
│   │   ├── PedidoScreen.tsx
│   │   ├── LineaPedidoScreen.tsx
│   │   ├── FacturaScreen.tsx
│   │   ├── CarritoScreen.tsx
│   │   ├── UsuariosScreen.tsx
│   │   └── ActividadScreen.tsx
│   ├── forms/                # Formularios
│   ├── shared/               # Componentes compartidos
│   ├── ui/                   # Componentes shadcn
│   ├── AndroidMockup.tsx     # Shell de la app móvil
│   ├── SetupScreen.tsx       # Configuración inicial
│   ├── PWAHead.tsx           # Meta tags PWA
│   └── PWAInstallPrompt.tsx  # Prompt de instalación
├── utils/
│   ├── api.ts                # Cliente API
│   ├── auth.ts               # Autenticación
│   ├── users.ts              # Gestión de usuarios
│   ├── currency.ts           # Formato de moneda
│   ├── activity.ts           # Registro de actividad
│   └── init-database.ts      # Script de inicialización
├── supabase/
│   └── functions/
│       └── server/
│           ├── index.tsx     # API REST completa
│           └── kv_store.tsx  # Base de datos (protegido)
├── styles/
│   └── globals.css           # Estilos globales
├── public/
│   ├── manifest.json         # PWA manifest
│   └── service-worker.js     # Service worker
├── App.tsx                   # Componente raíz
├── README.md                 # Este archivo
└── GUIA-BASE-DE-DATOS.md    # Documentación de BD
```

---

## 🔐 Seguridad

### **Autenticación**
✅ Tokens JWT seguros
✅ Sesiones persistentes
✅ Validación en cada request
✅ Contraseñas encriptadas

### **Autorización**
✅ Roles y permisos
✅ Rutas protegidas
✅ Middleware de autenticación
✅ Validación server-side

### **Datos**
✅ Sanitización de inputs
✅ Prevención de SQL injection
✅ CORS configurado
✅ HTTPS obligatorio

---

## 👥 Roles y Permisos

### 👑 **Administrador**
- ✅ Acceso total a todas las funciones
- ✅ Gestión de usuarios
- ✅ Ver registro de actividad
- ✅ Crear, editar, eliminar todo
- ✅ Configurar sistema

### 👤 **Vendedor**
- ✅ Gestionar clientes
- ✅ Gestionar productos
- ✅ Controlar inventarios
- ✅ Crear pedidos y facturas
- ✅ Usar carrito de compras
- ❌ NO puede gestionar usuarios
- ❌ NO puede ver actividad

---

## 📊 API Endpoints

### **Autenticación**
```
POST   /auth/login           # Iniciar sesión
POST   /auth/signup          # Registrar usuario
GET    /auth/session         # Verificar sesión
```

### **Clientes**
```
GET    /clientes             # Listar todos
POST   /clientes             # Crear nuevo
PUT    /clientes/:id         # Actualizar
DELETE /clientes/:id         # Eliminar
```

### **Productos**
```
GET    /productos            # Listar todos
POST   /productos            # Crear nuevo
PUT    /productos/:id        # Actualizar
DELETE /productos/:id        # Eliminar
```

### **Inventarios**
```
GET    /inventarios          # Listar todos
POST   /inventarios          # Crear registro
PUT    /inventarios/:id      # Actualizar
```

### **Pedidos**
```
GET    /pedidos              # Listar todos
POST   /pedidos              # Crear nuevo
PUT    /pedidos/:id          # Actualizar
DELETE /pedidos/:id          # Eliminar
```

### **Facturas**
```
GET    /facturas             # Listar todas
POST   /facturas             # Crear nueva
PUT    /facturas/:id         # Actualizar
DELETE /facturas/:id         # Eliminar
```

### **Usuarios** *(Admin)*
```
GET    /usuarios             # Listar todos
PUT    /usuarios/:id         # Actualizar
```

### **Dashboard**
```
GET    /dashboard/stats      # Estadísticas generales
```

---

## 🔄 Flujo de Trabajo Típico

### **Vendedor Diario:**

1. 📱 Inicia sesión
2. 👥 Revisa lista de clientes
3. 📦 Verifica productos disponibles
4. 🛒 Agrega productos al carrito
5. 🛍️ Crea pedido para cliente
6. 🧾 Genera factura
7. 📄 Descarga PDF de factura
8. 📧 Envía PDF al cliente (fuera de la app)
9. 💰 Marca factura como "Pagada"
10. 📋 Actualiza inventario

### **Administrador:**

1. 📱 Inicia sesión
2. 📊 Revisa dashboard con estadísticas
3. 👥 Crea nuevos usuarios vendedores
4. 📦 Agrega nuevos productos artesanales
5. 📋 Actualiza inventarios
6. 📈 Revisa actividad del equipo
7. 🧾 Verifica facturas pendientes
8. 💵 Calcula ventas totales

---

## 🌍 Uso Multi-Dispositivo

### **Sincronización**
✅ Usa la misma cuenta en varios dispositivos
✅ Cambios sincronizados en tiempo real
✅ Varios usuarios trabajando simultáneamente

### **Ejemplo:**
```
👤 Vendedor 1 (Celular) → Crea cliente nuevo
                            ↓
                    🔄 Supabase sincroniza
                            ↓
👤 Vendedor 2 (Tablet)  → Ve el cliente nuevo
```

---

## 🐛 Solución de Problemas

### **No puedo iniciar sesión**
1. Verifica que completaste el setup inicial
2. Usa: `admin@irakaworld.com` / `Iraka2025`
3. Verifica conexión a internet
4. Revisa la consola del navegador (F12)

### **Los datos no se guardan**
1. Verifica conexión a Supabase
2. Revisa permisos de usuario
3. Mira la consola para errores
4. Verifica que estés autenticado

### **No puedo crear usuarios**
1. Asegúrate de ser **Administrador**
2. Los vendedores NO pueden crear usuarios
3. Ve a la pantalla "Usuarios"

### **El PDF no se genera**
1. Verifica que la factura tenga productos
2. Verifica que haya datos de cliente
3. Revisa la consola para errores
4. Intenta recargar la página

### **Resetear configuración**
1. Abre DevTools (F12)
2. Application → Local Storage
3. Elimina `irakaworld_setup_completed`
4. Recarga la página

---

## 📈 Roadmap Futuro

### **Próximas Funcionalidades:**
- 📧 Envío automático de facturas por email
- 🔐 Recuperación de contraseña
- 📊 Reportes avanzados y gráficos
- 📸 Fotos de productos
- 🎨 Personalización de colores y logo
- 💳 Integración con pasarelas de pago
- 📱 Notificaciones push
- 🌐 Multi-idioma (Español/Inglés)
- 📦 Código QR en facturas
- 🔄 Sincronización con sistemas contables

---

## 🤝 Contribuciones

Este proyecto fue desarrollado para **Irakaworld** como una solución completa de gestión de ventas artesanales.

### **Personalización:**
El código es completamente modificable. Puedes:
- Cambiar colores y tema
- Agregar nuevas funcionalidades
- Modificar flujos de trabajo
- Integrar con otros sistemas
- Adaptar a tu negocio específico

---

## 📄 Licencia

Proyecto privado desarrollado para Irakaworld.

---

## 📞 Soporte

### **Debugging:**
- Abre DevTools (F12)
- Pestaña "Console" para logs
- Pestaña "Network" para requests
- Los errores se muestran con detalles

### **Logs del Sistema:**
```
✅ Operación exitosa
ℹ️ Información
⚠️ Advertencia
❌ Error con detalles
```

---

## 🎉 ¡Disfruta Irakaworld!

Tu aplicación de ventas artesanales está lista para:

✅ Gestionar tu negocio completo
✅ Trabajar en equipo
✅ Generar facturas profesionales
✅ Controlar inventarios
✅ Aumentar tus ventas

**Un mundo inspirado en la artesanía** 🌟

---

## 📊 Estadísticas del Proyecto

- **Pantallas:** 11
- **Componentes:** 30+
- **Líneas de código:** ~5,000
- **Tecnologías:** 15+
- **Funcionalidades:** 50+

---

**Desarrollado con ❤️ para Irakaworld**

*Impulsando la artesanía colombiana con tecnología moderna*