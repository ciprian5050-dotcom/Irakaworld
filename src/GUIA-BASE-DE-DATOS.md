# 📚 Guía de Base de Datos - Irakaworld

## 🎯 ¡Tu aplicación ahora usa una base de datos REAL!

Tu aplicación Irakaworld ha sido conectada a **Supabase**, una base de datos real y profesional. Esto significa que:

✅ **Todos los datos se guardan permanentemente**
✅ **Múltiples usuarios pueden trabajar simultáneamente**
✅ **Autenticación y seguridad real**
✅ **Sin pérdida de información al recargar**

---

## 🚀 Primer Uso - Configuración Inicial

### Paso 1: Pantalla de Bienvenida

La primera vez que abres la aplicación, verás la **Pantalla de Configuración Inicial**.

Esta pantalla te permite:
1. Crear tu primer usuario administrador
2. Opcionalmente, cargar datos de ejemplo (clientes y productos de prueba)

### Paso 2: Crear Usuario Admin

Haz clic en **"Iniciar Configuración"** y la app automáticamente creará:

```
📧 Email: admin@irakaworld.com
🔒 Contraseña: Iraka2025
👤 Rol: Administrador
```

### Paso 3: ¡Listo para Usar!

Después de la configuración, serás redirigido a la **pantalla de login** donde puedes entrar con las credenciales creadas.

---

## 🔐 Sistema de Autenticación

### Login

**Credenciales por defecto:**
- **Email:** `admin@irakaworld.com`
- **Contraseña:** `Iraka2025`

### Crear Nuevos Usuarios

Como **Administrador**, puedes crear nuevos usuarios:

1. Ve a la pantalla **"Usuarios"** (ícono de engranaje con persona)
2. Haz clic en **"Nuevo Usuario"**
3. Llena el formulario:
   - **Email** (servirá como usuario de login)
   - **Nombre completo**
   - **Contraseña**
   - **Rol** (Admin o Vendedor)

### Roles de Usuario

**👑 Administrador (Admin):**
- Acceso completo a todas las funciones
- Puede gestionar usuarios
- Puede ver registros de actividad
- Puede crear, editar y eliminar todo

**👤 Vendedor:**
- Puede gestionar clientes
- Puede gestionar productos e inventarios
- Puede crear pedidos y facturas
- Puede usar el carrito de compras
- NO puede gestionar usuarios
- NO puede ver registros de actividad

---

## 📊 Módulos de la Aplicación

### 1. **Dashboard** 🏠
- Resumen de estadísticas
- Total de clientes, productos, pedidos
- Total de ventas en COP

### 2. **Clientes** 👥
- Crear nuevos clientes
- Editar información de clientes
- Eliminar clientes
- Ver lista completa

**Datos guardados:**
- Nombre
- Email
- Teléfono
- Dirección

### 3. **Productos** 📦
- Catálogo completo de productos
- Crear nuevos productos artesanales
- Editar precios y descripciones
- Eliminar productos

**Datos guardados:**
- Nombre del producto
- Categoría
- Precio (en COP)
- Descripción

### 4. **Inventarios** 📋
- Control de stock por producto
- Actualizar cantidades disponibles
- Ver ubicación en bodega
- Alertas de stock bajo

**Datos guardados:**
- Producto
- Cantidad disponible
- Bodega/Ubicación
- Fecha de última actualización

### 5. **Pedidos** 🛍️
- Crear nuevos pedidos
- Asignar cliente
- Registrar fecha y estado
- Ver total del pedido

**Estados de pedido:**
- Pendiente
- En proceso
- Completado
- Cancelado

### 6. **Líneas de Pedido** 📝
- Detalles de cada producto en un pedido
- Cantidad y precio unitario
- Cálculo automático de subtotales

### 7. **Facturas** 🧾
- Generar facturas profesionales
- Descargar PDF automáticamente
- Registrar pagos
- Diferentes estados (Pendiente, Pagada, Vencida)

**Generación de PDF:**
- Logo de Irakaworld
- Número de factura único
- Información del cliente
- Detalle de productos
- Subtotal, IVA y Total en COP

### 8. **Carrito de Compras** 🛒
- Agregar productos rápidamente
- Calcular totales en tiempo real
- Convertir a pedido o factura

### 9. **Usuarios** 👥 *(Solo Admin)*
- Crear nuevos empleados
- Asignar roles
- Activar/desactivar usuarios
- Ver lista de todos los usuarios

### 10. **Actividad** 📊 *(Solo Admin)*
- Registro completo de todas las acciones
- Ver quién hizo qué y cuándo
- Auditoría de cambios
- Filtros por usuario y tipo de acción

---

## 💾 ¿Cómo se Guardan los Datos?

Tu aplicación usa **Supabase** que incluye:

### Base de Datos PostgreSQL

Todos los datos se guardan en una tabla de **Key-Value Store** con prefijos:

```
cliente:timestamp       → Datos de clientes
producto:timestamp      → Datos de productos
inventario:timestamp    → Datos de inventarios
pedido:timestamp        → Datos de pedidos
linea-pedido:timestamp  → Líneas de pedido
factura:timestamp       → Facturas
user:userId             → Usuarios
actividad:timestamp     → Registro de actividad
```

### Persistencia

✅ **Los datos NO se borran** al cerrar la aplicación
✅ **Los datos NO se pierden** al recargar la página
✅ **Múltiples usuarios** pueden acceder simultáneamente
✅ **Sincronización** en tiempo real

---

## 🔧 Funciones Avanzadas

### Registro de Actividad

Cada acción importante se registra automáticamente:

- **Inicio de sesión** de usuarios
- **Creación** de clientes, productos, pedidos
- **Edición** de cualquier registro
- **Eliminación** de datos
- **Generación** de facturas

Cada registro incluye:
- Usuario que realizó la acción
- Fecha y hora exacta
- Tipo de acción
- Detalles específicos

### API del Sistema

La aplicación se comunica con el backend mediante una API REST:

**Endpoints disponibles:**
```
POST   /auth/login          → Iniciar sesión
POST   /auth/signup         → Crear usuario
GET    /auth/session        → Verificar sesión

GET    /clientes            → Listar clientes
POST   /clientes            → Crear cliente
PUT    /clientes/:id        → Actualizar cliente
DELETE /clientes/:id        → Eliminar cliente

GET    /productos           → Listar productos
POST   /productos           → Crear producto
PUT    /productos/:id       → Actualizar producto
DELETE /productos/:id       → Eliminar producto

GET    /inventarios         → Listar inventarios
POST   /inventarios         → Crear inventario
PUT    /inventarios/:id     → Actualizar inventario

GET    /pedidos             → Listar pedidos
POST   /pedidos             → Crear pedido
PUT    /pedidos/:id         → Actualizar pedido
DELETE /pedidos/:id         → Eliminar pedido

GET    /lineas-pedido       → Listar líneas
POST   /lineas-pedido       → Crear línea
PUT    /lineas-pedido/:id   → Actualizar línea
DELETE /lineas-pedido/:id   → Eliminar línea

GET    /facturas            → Listar facturas
POST   /facturas            → Crear factura
PUT    /facturas/:id        → Actualizar factura
DELETE /facturas/:id        → Eliminar factura

GET    /usuarios            → Listar usuarios (Admin)
PUT    /usuarios/:id        → Actualizar usuario (Admin)

GET    /actividad           → Registro de actividad (Admin)

GET    /dashboard/stats     → Estadísticas del dashboard
```

---

## 🛠️ Mantenimiento y Soporte

### Resetear la Configuración Inicial

Si necesitas volver a ver la pantalla de configuración:

1. Abre la **Consola del Navegador** (F12)
2. Ve a la pestaña **"Application"** o **"Aplicación"**
3. En **"Local Storage"**, busca la clave `irakaworld_setup_completed`
4. Elimínala
5. Recarga la página

### Cerrar Sesión

- Haz clic en el **ícono de logout** (puerta con flecha) en la parte superior derecha
- Serás redirigido a la pantalla de login

### Cambiar Contraseña

Actualmente debes crear un nuevo usuario con la nueva contraseña desde el panel de **Usuarios** (si eres Admin).

---

## 📱 Uso en Múltiples Dispositivos

### Sincronización

✅ Puedes usar la misma cuenta en **varios dispositivos**
✅ Los cambios se **sincronizan automáticamente**
✅ Varios vendedores pueden trabajar **simultáneamente**

### Ejemplo de Uso

```
👤 Usuario 1 (Celular): Crea un nuevo cliente
   ↓
🔄 Supabase guarda el cliente
   ↓
👤 Usuario 2 (Tablet): Recarga y ve el nuevo cliente
```

---

## ⚠️ Notas Importantes

### Seguridad

✅ **Contraseñas encriptadas** por Supabase
✅ **Tokens de sesión** seguros
✅ **Validación** en cada petición
✅ **Roles y permisos** implementados

### Limitaciones Actuales

⚠️ **No hay recuperación de contraseña** (próxima versión)
⚠️ **No se pueden eliminar usuarios** (solo desactivar)
⚠️ **Un solo workspace** (todos los usuarios ven los mismos datos)

### Datos de Prueba

Si seleccionaste **"Incluir datos de ejemplo"** durante el setup, tendrás:

**2 Clientes de ejemplo:**
- María González
- Juan Pérez

**2 Productos de ejemplo:**
- Artesanía de Barro
- Tejido Wayuu

Puedes **editarlos o eliminarlos** libremente.

---

## 🚀 Próximos Pasos

### Para Empezar a Usar:

1. ✅ Completa el setup inicial
2. 👤 Inicia sesión con el usuario admin
3. 📦 Crea tus productos reales
4. 👥 Crea tus clientes reales
5. 🛍️ Empieza a registrar pedidos
6. 🧾 Genera tus primeras facturas

### Para Equipos:

1. 👑 Login como Admin
2. 👥 Ve a **"Usuarios"**
3. ➕ Crea cuentas para tus vendedores
4. 📧 Comparte las credenciales con tu equipo
5. 🎉 ¡Todos pueden trabajar juntos!

---

## 📞 Soporte Técnico

### Debugging

Si algo no funciona:

1. Abre la **Consola del Navegador** (F12)
2. Ve a la pestaña **"Console"**
3. Busca mensajes de error en rojo
4. Los errores del servidor aparecerán con detalles

### Logs del Sistema

La aplicación registra todas las operaciones en la consola:

```
✅ Usuario admin creado exitosamente
✅ Cliente guardado: María González
✅ Factura #1001 generada
❌ Error al crear producto: nombre requerido
```

---

## 🎉 ¡Disfruta tu Aplicación!

Ahora tienes una **aplicación de ventas profesional** con:

✅ Base de datos real y persistente
✅ Múltiples usuarios y roles
✅ Generación de PDFs
✅ Registro de actividad
✅ Interfaz móvil moderna
✅ Sistema completo de comercio

**¡Irakaworld está listo para impulsar tu negocio artesanal!** 🌟
