# 🔍 DEBUG PASO A PASO - Irakaworld

## ⚠️ Error Actual: "Credenciales incorrectas"

Este error significa que el usuario **admin@irakaworld.com** NO existe aún en la base de datos.

---

## ✅ SOLUCIÓN: Sigue estos pasos EXACTAMENTE

### **PASO 1: Limpiar Todo**

Abre la **Consola del Navegador** (F12) y ejecuta:

```javascript
localStorage.clear();
console.log('✅ localStorage limpiado');
location.reload();
```

---

### **PASO 2: Verificar que Ves la Pantalla de Setup**

Después de recargar, deberías ver:
- ✅ Logo de Irakaworld
- ✅ Título "Bienvenido a Irakaworld"
- ✅ Un cuadro con las credenciales
- ✅ Botón "Iniciar Configuración"

**Si NO ves esto:**
```javascript
// Ejecuta en consola:
localStorage.removeItem('irakaworld_setup_completed');
location.reload();
```

---

### **PASO 3: Abrir DevTools para Ver Logs**

1. Presiona **F12**
2. Ve a la pestaña **"Console"**
3. **DEJA ESTA PESTAÑA ABIERTA** durante todo el proceso

---

### **PASO 4: Hacer Clic en "Iniciar Configuración"**

Haz clic en el botón y **observa la consola**.

Deberías ver estos mensajes EN ORDEN:

```
🚀 Iniciando configuración de base de datos...

PASO 1/2: Creando usuario administrador...
📝 Intentando crear usuario admin...
📝 Signup request: { email: "admin@irakaworld.com", nombre: "...", rol: "Admin" }
✅ Usuario creado exitosamente: admin@irakaworld.com
✅ Usuario admin creado exitosamente: { success: true, user: {...} }

PASO 2/2: Creando datos de ejemplo...
📊 Creando datos de ejemplo...
🔐 Haciendo login...
🔐 Intentando login con: admin@irakaworld.com
✅ Login exitoso: Administrador Irakaworld
✅ Login exitoso
👥 Creando clientes...
📦 Creando productos...
✅ Datos de ejemplo creados exitosamente

✅ ¡Base de datos inicializada correctamente!

═══════════════════════════════════════
👤 CREDENCIALES DE ACCESO:
   📧 Email: admin@irakaworld.com
   🔒 Contraseña: Iraka2025
═══════════════════════════════════════
```

---

### **PASO 5: Verificar que el Usuario se Creó**

En la consola, ejecuta:

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/users', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
})
.then(r => r.json())
.then(data => console.log('👥 Usuarios en BD:', data));
```

**Reemplaza:**
- `YOUR_PROJECT_ID` con tu ID de proyecto
- `YOUR_ANON_KEY` con tu clave pública

O simplemente:

```javascript
// Importar desde el código
import { projectId, publicAnonKey } from './utils/supabase/info';

fetch(`https://${projectId}.supabase.co/functions/v1/make-server-c94f8b91/debug/users`, {
  headers: { 'Authorization': `Bearer ${publicAnonKey}` }
})
.then(r => r.json())
.then(data => console.log('👥 Usuarios en BD:', data));
```

**Deberías ver:**
```javascript
👥 Usuarios en BD: {
  success: true,
  count: 1,
  users: [{
    email: "admin@irakaworld.com",
    nombre: "Administrador Irakaworld",
    rol: "Admin",
    activo: true
  }]
}
```

---

### **PASO 6: Intentar Login**

1. Deberías ser redirigido automáticamente a la pantalla de Login
2. Verás las credenciales en un cuadro amarillo:
   ```
   📧 Email: admin@irakaworld.com
   🔒 Contraseña: Iraka2025
   ```
3. Ingresa **exactamente** estas credenciales
4. Haz clic en "Iniciar Sesión"

---

### **PASO 7: Verificar Logs de Login**

En la consola deberías ver:

```
🔐 Intentando login con: admin@irakaworld.com
✅ Login exitoso: Administrador Irakaworld
```

Y un toast verde:
```
✅ ¡Bienvenido Administrador Irakaworld!
   Rol: Admin
```

---

## 🐛 Si Todavía Hay Error

### **Error: "Usuario no encontrado"**

**Significa:** El paso 4 falló al crear el usuario.

**Solución:**

1. Abre la consola
2. Busca mensajes de error en **ROJO**
3. Copia el error completo
4. Verifica la pestaña **Network** (Red) en DevTools:
   - Busca la petición `POST /auth/signup`
   - Haz clic en ella
   - Ve a la pestaña "Response"
   - Copia la respuesta

**Posibles causas:**
- ❌ Error de red (verifica tu conexión)
- ❌ Supabase no está conectado
- ❌ Error en el servidor

---

### **Error: "El usuario ya existe"**

**Significa:** ¡El usuario YA FUE CREADO!

**Solución:**

Simplemente intenta hacer **login** con:
- Email: `admin@irakaworld.com`
- Contraseña: `Iraka2025`

Si aún no funciona, es posible que la contraseña se haya guardado incorrectamente.

**Resetear todo y volver a empezar:**
```javascript
// Esta función eliminará TODO de la base de datos
// ÚSALA CON CUIDADO
console.log('⚠️ Esto borrará TODOS los datos');
```

---

## 🔬 Debug Avanzado

### **Ver TODOS los datos en KV Store**

No hay una forma fácil de ver todos los datos, pero puedes verificar usuarios:

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/users')
  .then(r => r.json())
  .then(data => {
    console.log('Total usuarios:', data.count);
    console.log('Usuarios:', data.users);
  });
```

### **Probar el Servidor**

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/health')
  .then(r => r.json())
  .then(data => console.log('Servidor:', data));
```

**Debería responder:**
```javascript
{ status: 'ok', message: 'Servidor Irakaworld funcionando correctamente' }
```

---

## 📊 Checklist de Verificación

Marca cada uno cuando lo completes:

- [ ] Limpiaste localStorage
- [ ] Recargaste la página
- [ ] Ves la pantalla de Setup
- [ ] Abriste la consola (F12)
- [ ] Hiciste clic en "Iniciar Configuración"
- [ ] Viste logs de creación de usuario en consola
- [ ] Viste "✅ Usuario creado exitosamente"
- [ ] Verificaste que el usuario existe con `/debug/users`
- [ ] Fuiste redirigido a Login
- [ ] Ingresaste las credenciales EXACTAS
- [ ] Viste "✅ Login exitoso" en consola
- [ ] Fuiste redirigido al Dashboard

---

## 🆘 Si NADA de Esto Funciona

### **Opción 1: Crear Usuario Manualmente (API)**

Abre la consola y ejecuta:

```javascript
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'admin@irakaworld.com',
    password: 'Iraka2025',
    nombre: 'Administrador Irakaworld',
    rol: 'Admin'
  })
})
.then(r => r.json())
.then(data => console.log('Resultado:', data))
.catch(err => console.error('Error:', err));
```

---

### **Opción 2: Verificar Logs del Servidor**

Los logs del servidor aparecen en:
1. **Supabase Dashboard**
2. **Edge Functions Logs**
3. Busca el nombre: `make-server-c94f8b91`

Deberías ver logs como:
```
📝 Signup request: { email: "admin@irakaworld.com", ... }
✅ Usuario creado exitosamente: admin@irakaworld.com
```

---

### **Opción 3: Reseteo Completo**

```javascript
// 1. Limpiar todo
localStorage.clear();
sessionStorage.clear();

// 2. Recargar
location.reload();

// 3. Esperar que cargue
// 4. Volver a hacer el setup desde cero
```

---

## 📞 Información para Reporte de Error

Si necesitas ayuda, proporciona:

```javascript
// Ejecuta esto en consola y copia el resultado:
console.log('=== INFORMACIÓN DE DEBUG ===');
console.log('URL:', window.location.href);
console.log('Setup completado:', localStorage.getItem('irakaworld_setup_completed'));
console.log('Tiene token:', !!localStorage.getItem('accessToken'));
console.log('Tiene usuario:', !!localStorage.getItem('currentUser'));
console.log('===========================');

// Luego prueba el servidor:
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/health')
  .then(r => r.json())
  .then(data => console.log('Servidor responde:', data))
  .catch(err => console.log('Servidor ERROR:', err));

// Y verifica usuarios:
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/users')
  .then(r => r.json())
  .then(data => console.log('Usuarios en BD:', data))
  .catch(err => console.log('Error obteniendo usuarios:', err));
```

---

## ✅ Resumen del Flujo Correcto

```
1. 🧹 localStorage.clear() + reload
   ↓
2. 👋 Ver pantalla "Bienvenido a Irakaworld"
   ↓
3. 🖱️ Click "Iniciar Configuración"
   ↓
4. 📝 Ver logs: "Usuario creado exitosamente"
   ↓
5. 🔄 Auto-redirigir a Login
   ↓
6. 📧 Ingresar: admin@irakaworld.com
   ↓
7. 🔒 Ingresar: Iraka2025
   ↓
8. 🚀 Click "Iniciar Sesión"
   ↓
9. ✅ Ver: "Login exitoso" en consola
   ↓
10. 🏠 Dashboard cargado
```

---

**¡Sigue estos pasos con cuidado y deberías poder entrar!** 🎯
