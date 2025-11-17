# 🔧 Solución de Errores - Irakaworld

## ✅ Problema Resuelto: Error de Login

### ❌ Error Anterior:
```
Error en login: Error: Credenciales incorrectas
```

### ✅ Solución Implementada:

He reconfigurado completamente el sistema de autenticación para usar un enfoque más simple y directo:

#### **Cambios Realizados:**

1. **Sistema de Autenticación Simplificado**
   - ❌ **Antes:** Usaba Supabase Auth (complejo, requería configuración adicional)
   - ✅ **Ahora:** Sistema propio con KV store (simple, directo, funciona inmediatamente)

2. **Contraseñas Hasheadas**
   - Las contraseñas se guardan con SHA-256
   - Nunca se almacenan en texto plano
   - Verificación segura en cada login

3. **Tokens de Sesión**
   - Se genera un UUID único en cada login
   - Se guarda en KV store como `session:token`
   - Se valida en cada petición al servidor

4. **Mejor Logging**
   - Emojis en logs del servidor: ✅ ❌ 🔐 📝
   - Mensajes claros en consola del navegador
   - Errores descriptivos

---

## 🧪 Cómo Probar la Solución

### **Paso 1: Resetear Setup (Si es necesario)**

Si ya intentaste configurar antes, resetea:

1. Abre **DevTools** (F12)
2. Consola → Ejecuta:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### **Paso 2: Configuración Inicial**

1. **Deberías ver:** Pantalla de "Bienvenido a Irakaworld"
2. **Haz clic en:** "Iniciar Configuración"
3. **Espera:** Verás mensajes toast:
   - "Creando usuario administrador..."
   - "Creando datos de ejemplo..."
   - "¡Configuración completada!"

### **Paso 3: Verificar en Consola**

En la consola del navegador deberías ver:

```
📝 Signup request: { email: "admin@irakaworld.com", nombre: "...", rol: "Admin" }
✅ Usuario creado exitosamente: admin@irakaworld.com
```

### **Paso 4: Login**

1. **Serás redirigido** a la pantalla de Login
2. **Verás las credenciales** en un recuadro amarillo:
   ```
   📧 Email: admin@irakaworld.com
   🔒 Contraseña: Iraka2025
   ```
3. **Ingresa las credenciales** (puedes copiar/pegar)
4. **Haz clic en** "Iniciar Sesión"

### **Paso 5: Verificar Login Exitoso**

En la consola deberías ver:

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

## 🔍 Debugging: Qué Buscar en Consola

### **Consola del Navegador (F12 → Console)**

#### ✅ **Login Exitoso:**
```
🔐 Intentando login con: admin@irakaworld.com
✅ Login exitoso: Administrador Irakaworld
```

#### ❌ **Error de Credenciales:**
```
🔐 Intentando login con: admin@irakaworld.com
❌ Error en login: { error: "Credenciales incorrectas" }
```

#### ❌ **Usuario No Existe:**
```
🔐 Intentando login con: admin@irakaworld.com
❌ Error en login: { error: "Credenciales incorrectas" }
```

**Solución:** Vuelve a ejecutar el setup.

### **Logs del Servidor (En la consola del navegador, pestaña Network)**

1. **F12 → Network**
2. **Busca la petición:** `POST /make-server-c94f8b91/auth/login`
3. **Haz clic** en ella
4. **Ve a "Response"** para ver la respuesta del servidor

#### ✅ **Respuesta Exitosa:**
```json
{
  "success": true,
  "accessToken": "abc-123-def-456",
  "user": {
    "id": "...",
    "email": "admin@irakaworld.com",
    "nombre": "Administrador Irakaworld",
    "rol": "Admin",
    "activo": true
  }
}
```

#### ❌ **Error:**
```json
{
  "error": "Credenciales incorrectas"
}
```

---

## 🛠️ Problemas Comunes y Soluciones

### **1. "Usuario no encontrado"**

**Causa:** El setup no se completó correctamente.

**Solución:**
```javascript
// En la consola del navegador:
localStorage.clear();
location.reload();
// Luego vuelve a hacer el setup
```

### **2. "El usuario ya existe"**

**Causa:** Ya ejecutaste el setup antes.

**Síntoma:** Al hacer clic en "Iniciar Configuración", aparece "El usuario ya existe".

**Solución:** ¡Esto está bien! Significa que el usuario ya fue creado. Solo haz clic en "OK" y serás redirigido al login.

### **3. Pantalla de Setup no aparece**

**Causa:** El flag `irakaworld_setup_completed` ya existe en localStorage.

**Solución:**
```javascript
localStorage.removeItem('irakaworld_setup_completed');
location.reload();
```

### **4. Error de red / CORS**

**Causa:** El servidor de Supabase no está respondiendo.

**Síntomas:**
- Error en consola: `Failed to fetch`
- Error en consola: `CORS error`

**Solución:**
- Verifica tu conexión a internet
- Asegúrate de que Supabase esté conectado
- Recarga la página

### **5. Token inválido después de login**

**Causa:** El token no se guardó correctamente.

**Verificación:**
```javascript
// En la consola:
console.log(localStorage.getItem('accessToken'));
console.log(localStorage.getItem('currentUser'));
```

**Debería mostrar:**
- `accessToken`: Un UUID largo
- `currentUser`: Un objeto JSON con tus datos

**Solución si están vacíos:**
```javascript
localStorage.clear();
location.reload();
// Vuelve a hacer login
```

---

## 📝 Comandos Útiles para Debugging

### **Ver datos guardados:**
```javascript
// Ver token actual
console.log('Token:', localStorage.getItem('accessToken'));

// Ver usuario actual
console.log('Usuario:', JSON.parse(localStorage.getItem('currentUser')));

// Ver si se completó el setup
console.log('Setup completado:', localStorage.getItem('irakaworld_setup_completed'));
```

### **Limpiar y empezar de nuevo:**
```javascript
// Borrar TODO
localStorage.clear();
location.reload();
```

### **Solo borrar autenticación (mantener setup):**
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('currentUser');
location.reload();
```

### **Solo borrar setup (mantener autenticación):**
```javascript
localStorage.removeItem('irakaworld_setup_completed');
location.reload();
```

---

## 🎯 Flujo Correcto Completo

```
1. 🌟 Primera visita
   ↓
2. 👋 Pantalla "Bienvenido a Irakaworld"
   ↓
3. 🖱️ Click "Iniciar Configuración"
   ↓
4. ⏳ "Creando usuario administrador..."
   ↓
5. 📊 "Creando datos de ejemplo..."
   ↓
6. ✅ "¡Configuración completada!"
   ↓
7. 🔐 Pantalla de Login
   ↓
8. 📧 Ingresa: admin@irakaworld.com
   ↓
9. 🔒 Ingresa: Iraka2025
   ↓
10. 🚀 Click "Iniciar Sesión"
    ↓
11. ✅ "¡Bienvenido Administrador Irakaworld!"
    ↓
12. 🏠 Dashboard cargado
```

---

## 🔒 Verificar que la Autenticación Funciona

### **Después de Login Exitoso:**

1. **Abre DevTools** (F12)
2. **Application → Local Storage**
3. **Deberías ver:**
   - `accessToken`: Un UUID (ej: `123e4567-e89b-12d3-a456-426614174000`)
   - `currentUser`: JSON con tus datos
   - `irakaworld_setup_completed`: `"true"`

### **Prueba una Petición Autenticada:**

En la consola del navegador:
```javascript
// Probar obtener clientes
fetch('https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/clientes', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Clientes:', data));
```

**Deberías ver:**
```javascript
Clientes: { success: true, clientes: [...] }
```

---

## ✅ Checklist de Verificación

Marca cada paso cuando funcione:

- [ ] Pantalla de setup aparece al abrir la app
- [ ] Click "Iniciar Configuración" muestra mensajes toast
- [ ] Se crea el usuario admin sin errores
- [ ] Redirige automáticamente al login
- [ ] Las credenciales son visibles en pantalla
- [ ] Login con admin@irakaworld.com funciona
- [ ] Toast muestra "¡Bienvenido Administrador Irakaworld!"
- [ ] Dashboard se carga correctamente
- [ ] `localStorage` tiene `accessToken` y `currentUser`
- [ ] La navegación entre pantallas funciona

---

## 🆘 Si Nada Funciona

### **Reseteo Total:**

```javascript
// 1. Abrir DevTools (F12)
// 2. Ir a Console
// 3. Ejecutar:

console.log('🔄 Reseteando aplicación...');

// Limpiar localStorage
localStorage.clear();

// Limpiar sessionStorage
sessionStorage.clear();

// Limpiar cookies (opcional)
document.cookie.split(";").forEach(function(c) { 
  document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
});

console.log('✅ Limpieza completa');
console.log('🔄 Recargando...');

// Recargar
location.reload();
```

Luego:
1. Espera que cargue
2. Deberías ver la pantalla de setup
3. Completa el setup de nuevo
4. Intenta login

---

## 📞 Información de Debug para Soporte

Si sigues teniendo problemas, proporciona esta información:

```javascript
// Copia esto en la consola y comparte el resultado:
console.log('=== DEBUG INFO ===');
console.log('URL:', window.location.href);
console.log('localStorage:', Object.keys(localStorage).map(k => `${k}: ${localStorage.getItem(k)?.substring(0, 50)}...`));
console.log('Setup completed:', localStorage.getItem('irakaworld_setup_completed'));
console.log('Has token:', !!localStorage.getItem('accessToken'));
console.log('Has user:', !!localStorage.getItem('currentUser'));
console.log('User role:', JSON.parse(localStorage.getItem('currentUser') || '{}').rol);
console.log('==================');
```

---

## 🎉 ¡Todo Listo!

Si seguiste todos los pasos y ves:
- ✅ Dashboard cargado
- ✅ Token en localStorage
- ✅ Usuario en localStorage
- ✅ Navegación funciona

**¡Tu aplicación está lista para usar con base de datos real!** 🚀

Ahora puedes empezar a crear clientes, productos, pedidos y facturas reales.
