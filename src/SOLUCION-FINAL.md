# 🔧 SOLUCIÓN FINAL - Debug de Login

## 📊 Situación Actual

```
✅ Usuario existe: "admin@irakaworld.com"
❌ Login falla: "Credenciales incorrectas"
```

Esto significa que el problema está en la **comparación de contraseñas**.

---

## 🧪 PASO 1: Usar el Test de Login

Abre la **Consola del Navegador** (F12) y ejecuta esto:

```javascript
// Reemplaza TU_PROJECT_ID y TU_ANON_KEY con tus valores reales
fetch('https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/test-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TU_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'admin@irakaworld.com',
    password: 'Iraka2025'
  })
})
.then(r => r.json())
.then(data => {
  console.log('🧪 RESULTADO DEL TEST:');
  console.log('=====================');
  console.log('Contraseña coincide?', data.success);
  if (data.details) {
    console.log('Hash ingresado:', data.details.inputPasswordHash);
    console.log('Hash guardado:', data.details.storedPasswordHash);
    console.log('Son iguales?', data.details.hashesMatch);
  }
  console.log('=====================');
});
```

### **Resultado Esperado:**

Si **TODO ESTÁ BIEN:**
```javascript
🧪 RESULTADO DEL TEST:
=====================
Contraseña coincide? true
Hash ingresado: abc123def456...
Hash guardado: abc123def456...
Son iguales? true
=====================
```

Si **HAY UN PROBLEMA:**
```javascript
🧪 RESULTADO DEL TEST:
=====================
Contraseña coincide? false
Hash ingresado: abc123def456...
Hash guardado: xyz789ghi012...  ← DIFERENTE!
Son iguales? false
=====================
```

---

## 🔍 PASO 2: Ver el Usuario en la Base de Datos

```javascript
fetch('https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/user/admin@irakaworld.com', {
  headers: {
    'Authorization': 'Bearer TU_ANON_KEY'
  }
})
.then(r => r.json())
.then(data => {
  console.log('👤 DATOS DEL USUARIO:');
  console.log('=====================');
  console.log('Email:', data.user.email);
  console.log('Nombre:', data.user.nombre);
  console.log('Rol:', data.user.rol);
  console.log('Activo:', data.user.activo);
  console.log('Hash:', data.user.passwordHash);
  console.log('=====================');
});
```

---

## 💡 PASO 3: Soluciones Según el Resultado

### **Si el Hash NO Coincide**

Significa que la contraseña se guardó con un valor diferente. **SOLUCIÓN:**

#### **Opción A: Borrar y Recrear el Usuario**

1. **Borrar el usuario antiguo:**
   
   No hay forma fácil de borrar por API, así que necesitas:
   - Ir al Dashboard de Supabase
   - Table Editor → `kv_store_c94f8b91`
   - Buscar la fila con key = `user:admin@irakaworld.com`
   - Eliminarla

2. **Crear usuario nuevo:**
   
   En la pantalla de login, click en "🔨 Crear Usuario Admin"

#### **Opción B: Calcular el Hash Correcto y Actualizarlo**

Si sabes que la contraseña es `Iraka2025`, puedes calcular su hash y actualizarlo:

```javascript
// 1. Calcular el hash de "Iraka2025"
async function calcularHash(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 2. Calcular y mostrar
calcularHash('Iraka2025').then(hash => {
  console.log('🔐 Hash correcto de "Iraka2025":', hash);
});
```

Luego, necesitarías actualizar manualmente en Supabase o crear un endpoint para actualizar la contraseña.

---

### **Si el Hash SÍ Coincide**

Pero el login aún falla, entonces hay un problema en:
1. El flujo del login
2. La forma en que se busca el usuario
3. La comparación en el servidor

**SOLUCIÓN:** Verifica los logs del servidor en Supabase:
- Ve a Supabase Dashboard
- Edge Functions → Logs
- Busca `make-server-c94f8b91`
- Ve los logs cuando intentas hacer login

---

## 🚨 PASO 4: Solución Nuclear (Empezar de Cero)

Si nada funciona, **resetea TODO**:

### **1. Limpiar Frontend**

```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### **2. Limpiar Base de Datos**

Necesitas ir a Supabase Dashboard:
1. **Table Editor**
2. Tabla: `kv_store_c94f8b91`
3. **Eliminar TODAS las filas** que empiecen con:
   - `user:`
   - `session:`
   - `actividad:`

### **3. Recrear Usuario**

1. Recargar la app
2. Click en "🔨 Crear Usuario Admin"
3. Inmediatamente después, ejecutar el test:
   ```javascript
   // Test inmediato
   fetch('https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/test-login', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer TU_ANON_KEY'
     },
     body: JSON.stringify({
       email: 'admin@irakaworld.com',
       password: 'Iraka2025'
     })
   })
   .then(r => r.json())
   .then(data => console.log('Test después de crear:', data));
   ```

---

## 📝 PASO 5: Compartir Resultados

Para que pueda ayudarte mejor, comparte:

### **Ejecuta esto y copia la salida:**

```javascript
console.log('=== DIAGNÓSTICO COMPLETO ===');

// 1. Info del navegador
console.log('URL:', window.location.href);
console.log('LocalStorage setup:', localStorage.getItem('irakaworld_setup_completed'));

// 2. Test del servidor
fetch('https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/health')
  .then(r => r.json())
  .then(data => console.log('Servidor responde:', data))
  .catch(err => console.log('Servidor ERROR:', err));

// 3. Ver usuarios
fetch('https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/users')
  .then(r => r.json())
  .then(data => console.log('Usuarios en BD:', data))
  .catch(err => console.log('Error usuarios:', err));

// 4. Ver usuario específico
fetch('https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/user/admin@irakaworld.com')
  .then(r => r.json())
  .then(data => console.log('Usuario admin:', data))
  .catch(err => console.log('Error admin:', err));

// 5. Test de login
fetch('https://TU_PROJECT_ID.supabase.co/functions/v1/make-server-c94f8b91/debug/test-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer TU_ANON_KEY'
  },
  body: JSON.stringify({
    email: 'admin@irakaworld.com',
    password: 'Iraka2025'
  })
})
.then(r => r.json())
.then(data => console.log('Test de login:', data))
.catch(err => console.log('Error test:', err));

console.log('=== FIN DIAGNÓSTICO ===');
```

---

## ✅ Checklist de Debugging

Marca cuando completes:

- [ ] Ejecuté el test de login y vi los hashes
- [ ] Verifiqué si los hashes coinciden
- [ ] Si NO coinciden, borré y recreé el usuario
- [ ] Ejecuté el test nuevamente después de recrear
- [ ] Verifiqué los logs del servidor en Supabase
- [ ] Compartí los resultados del diagnóstico completo

---

## 🎯 Resumen

**El problema:** Usuario existe pero login falla = **Hash de contraseña no coincide**

**La solución más probable:**
1. Borrar usuario existente
2. Crear nuevo usuario
3. Probar login inmediatamente

**Si sigue fallando:**
- Verificar logs del servidor
- Compartir diagnóstico completo
- Puede ser problema de red o config de Supabase

---

**IMPORTANTE:** Reemplaza `TU_PROJECT_ID` y `TU_ANON_KEY` con tus valores reales de `/utils/supabase/info.tsx`

O para hacerlo más fácil, ejecuta primero:

```javascript
import { projectId, publicAnonKey } from './utils/supabase/info';
console.log('Project ID:', projectId);
console.log('Anon Key:', publicAnonKey.substring(0, 20) + '...');
```
