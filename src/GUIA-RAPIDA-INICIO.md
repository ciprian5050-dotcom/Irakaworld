# 🚀 Guía Rápida de Inicio - Irakaworld

## ✅ SOLUCIÓN SIMPLE - 2 Pasos

El sistema ahora es mucho más simple. Ya NO necesitas hacer un setup previo.

---

## 📱 PASO 1: Abrir la Aplicación

1. Abre la aplicación en tu navegador
2. Verás la **Pantalla de Login**

---

## 🔨 PASO 2: Crear Usuario Admin (Solo la primera vez)

En la pantalla de login verás un botón verde:

```
🔨 Crear Usuario Admin
```

### **Haz clic en este botón**

Esto creará automáticamente:
- 📧 Email: `admin@irakaworld.com`
- 🔒 Contraseña: `Iraka2025`
- 👤 Rol: Administrador

### **Qué esperar:**

1. **Haces clic** en "🔨 Crear Usuario Admin"
2. **Verás en consola** (F12):
   ```
   🔨 Creando usuario admin manualmente...
   📝 Intentando crear usuario admin...
   ✅ Usuario creado exitosamente
   ```
3. **Aparece toast verde**: "¡Usuario creado!"
4. **Los campos se auto-completan** con el email y contraseña

---

## 🔐 PASO 3: Iniciar Sesión

Después de crear el usuario (o si ya existe):

1. **Email:** `admin@irakaworld.com` (ya pre-completado)
2. **Contraseña:** `Iraka2025` (ya pre-completado)
3. **Click:** "Iniciar Sesión"

### **Qué esperar:**

```
🔐 Intentando login con: admin@irakaworld.com
✅ Login exitoso: Administrador Irakaworld
```

Y verás el toast:
```
✅ ¡Bienvenido Administrador Irakaworld!
   Rol: Admin
```

---

## 🎉 ¡Listo!

Ya estás dentro. Ahora puedes:
- ✅ Ver el Dashboard
- ✅ Crear clientes
- ✅ Agregar productos
- ✅ Gestionar inventarios
- ✅ Hacer pedidos
- ✅ Generar facturas
- ✅ Crear más usuarios (solo Admin)

---

## ⚠️ Si Hay Problemas

### **Problema: "Error al crear usuario"**

**Causa:** Puede ser un error de red o el servidor no responde.

**Solución:**
1. Abre la **Consola** (F12)
2. Busca mensajes en **ROJO**
3. Verifica tu conexión a internet
4. Intenta de nuevo

---

### **Problema: "Usuario ya existe"**

**Causa:** El usuario ya fue creado antes.

**Solución:**
¡Esto NO es un problema! Simplemente:
1. Los campos ya están pre-completados
2. Haz clic en "Iniciar Sesión"

---

### **Problema: "Credenciales incorrectas"**

**Causa:** El usuario no fue creado, o hay un error en la contraseña.

**Solución:**

**Opción A - Verificar si el usuario existe:**
```javascript
// Abre la consola (F12) y ejecuta:
fetch('TU_URL_SUPABASE/functions/v1/make-server-c94f8b91/debug/users')
  .then(r => r.json())
  .then(data => console.log('Usuarios:', data));
```

**Opción B - Crear usuario manualmente vía API:**
```javascript
// En la consola (F12):
fetch('TU_URL_SUPABASE/functions/v1/make-server-c94f8b91/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@irakaworld.com',
    password: 'Iraka2025',
    nombre: 'Administrador Irakaworld',
    rol: 'Admin'
  })
})
.then(r => r.json())
.then(data => console.log('Resultado:', data));
```

**Opción C - Limpiar todo y empezar de nuevo:**
```javascript
localStorage.clear();
location.reload();
```

---

## 🔍 Debug Rápido

### **Ver estado actual:**
```javascript
// En consola (F12):
console.log('Setup:', localStorage.getItem('irakaworld_setup_completed'));
console.log('Token:', localStorage.getItem('accessToken'));
console.log('Usuario:', localStorage.getItem('currentUser'));
```

### **Probar el servidor:**
```javascript
fetch('TU_URL_SUPABASE/functions/v1/make-server-c94f8b91/health')
  .then(r => r.json())
  .then(data => console.log('Servidor:', data));
```

**Debería responder:**
```javascript
{ status: 'ok', message: 'Servidor Irakaworld funcionando correctamente' }
```

---

## 📊 Flujo Completo

```
1. 📱 Abrir app
   ↓
2. 👀 Ver pantalla de Login
   ↓
3. 🔨 Click "Crear Usuario Admin" (solo 1ra vez)
   ↓
4. ✅ Ver toast "¡Usuario creado!"
   ↓
5. 📧 Campos pre-completados automáticamente
   ↓
6. 🚀 Click "Iniciar Sesión"
   ↓
7. ✅ Ver toast "¡Bienvenido Administrador!"
   ↓
8. 🏠 Dashboard cargado
   ↓
9. 🎉 ¡A trabajar!
```

---

## 💡 Ventajas de Este Nuevo Sistema

✅ **Más Simple** - Solo 1 clic para crear admin
✅ **Más Rápido** - No necesitas pantalla de setup separada
✅ **Más Claro** - Todo en la pantalla de login
✅ **Auto-completado** - Los campos se llenan solos
✅ **Más Robusto** - Maneja errores mejor

---

## 🎯 Siguiente Paso

Una vez que entres como **Admin**, puedes:

### **Crear Más Usuarios:**
1. Ve a **"Usuarios"** (ícono de engranaje)
2. Click **"Nuevo Usuario"**
3. Llena el formulario:
   - Email (para login)
   - Nombre
   - Contraseña
   - Rol (Admin o Vendedor)
4. Click **"Guardar"**

### **Cargar tus Datos:**
1. Ve a **"Productos"** y crea tus artesanías
2. Ve a **"Clientes"** y agrega tus clientes
3. Ve a **"Inventarios"** y registra tu stock

### **Empezar a Vender:**
1. Usa el **"Carrito"** para agregar productos
2. Crea **"Pedidos"** para tus clientes
3. Genera **"Facturas"** y descarga PDFs

---

## ✅ Checklist de Inicio

Marca cuando completes cada paso:

- [ ] Abrí la aplicación
- [ ] Vi la pantalla de Login
- [ ] Hice clic en "🔨 Crear Usuario Admin"
- [ ] Vi el toast "¡Usuario creado!"
- [ ] Los campos se auto-completaron
- [ ] Hice clic en "Iniciar Sesión"
- [ ] Vi "✅ Login exitoso" en consola
- [ ] Entré al Dashboard
- [ ] ¡Estoy listo para usar Irakaworld!

---

**¡Eso es todo! Mucho más simple que antes.** 🚀

Si tienes problemas, abre la consola (F12) y mira los mensajes.
Todo está diseñado para ser claro y fácil de depurar.
