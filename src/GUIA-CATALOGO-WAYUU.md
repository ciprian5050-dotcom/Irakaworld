# 🚀 GUÍA RÁPIDA - CATÁLOGO WAYUU IRAKAWORLD

## ✅ ¿QUÉ SE ACTUALIZÓ?

Tu aplicación Irakaworld ahora tiene un **catálogo completo de 29 productos artesanales Wayuu auténticos** con imágenes reales de productos colombianos.

---

## 📱 CÓMO VER LOS PRODUCTOS WAYUU

### **Opción 1: Configuración Inicial (Recomendado)**

Si es tu primera vez usando la app:

1. **Abre la aplicación**
2. Verás la pantalla de **configuración inicial**
3. **Marca el checkbox** "Incluir 29 productos Wayuu auténticos con imágenes reales"
4. Haz clic en **"Iniciar Configuración"**
5. Espera a que se complete (verás los mensajes de progreso)
6. **Inicia sesión** con:
   - 📧 Email: `admin@irakaworld.com`
   - 🔒 Contraseña: `Iraka2025`
7. Ve a la sección **"Productos"** en el menú inferior
8. ¡Verás tu catálogo de 29 productos Wayuu con imágenes reales! 🎉

---

### **Opción 2: Si Ya Tienes la App Configurada**

Si ya creaste el usuario admin antes:

1. **Abre la consola del navegador** (F12 o Ctrl+Shift+I)
2. **Pega este código:**

```javascript
// Importar funciones
import { api } from './utils/api';
import { crearDatosEjemplo } from './utils/init-database';

// Hacer login
await api.auth.login('admin@irakaworld.com', 'Iraka2025');

// Crear productos Wayuu
await crearDatosEjemplo();

console.log('✅ ¡29 productos Wayuu creados exitosamente!');
```

3. Presiona **Enter**
4. Espera a que termine (verás mensajes en la consola)
5. **Recarga la página**
6. Ve a **"Productos"** y verás el catálogo actualizado

---

## 🎨 LO QUE VERÁS

### **En la Pantalla de Productos:**
- ✅ **29 productos Wayuu** organizados en 6 categorías
- ✅ **Imágenes reales** de artesanía colombiana (no emojis)
- ✅ **Precios realistas** en pesos colombianos (COP)
- ✅ **Stock disponible** para cada producto
- ✅ **Tarjetas visuales** con gradientes ámbar/naranja

### **En el Carrito de Compras:**
- ✅ Productos Wayuu con **imágenes reales**
- ✅ Ejemplos: Mochila Grande, Manillas, Bolsos
- ✅ Precios y cálculos de totales actualizados

### **En el Formulario de Productos:**
- ✅ Selector de **categorías Wayuu** (Mochilas, Bolsos, Accesorios, etc.)
- ✅ Galería de **imágenes reales** para seleccionar
- ✅ 10 opciones de imágenes (7 fotos + 3 emojis)

---

## 📦 LAS 6 CATEGORÍAS DISPONIBLES

| Categoría | Productos | Ejemplos |
|-----------|-----------|----------|
| 🎒 **Mochilas** | 6 | Grande, Mediana, Pequeña, Premium, Mini, XL |
| 👜 **Bolsos** | 5 | Bolso de Mano, Clutch, Cartera, Tote, Morral |
| 💍 **Accesorios** | 8 | Manillas, Collares, Aretes, Cinturón, Diadema |
| 👟 **Calzado** | 3 | Sandalias, Alpargatas, Sandalias Premium |
| 🏠 **Hogar** | 5 | Chinchorro, Tapetes, Cojines, Manteles, Tapiz |
| ⭐ **Especiales** | 2 | Edición Limitada, Set Regalo Premium |

---

## 💰 RANGOS DE PRECIOS

- 💵 **Económico:** $32.000 - $65.000 (Accesorios)
- 💵💵 **Medio:** $75.000 - $180.000 (Mochilas, Bolsos)
- 💵💵💵 **Premium:** $250.000 - $450.000 (Edición Limitada, Chinchorros)

---

## 🔍 CÓMO AGREGAR MÁS PRODUCTOS

### **Desde la App (UI):**
1. Ve a **"Productos"**
2. Haz clic en el botón **"+"** (arriba a la derecha)
3. Llena el formulario:
   - Nombre del producto
   - Selecciona categoría Wayuu
   - Precio en COP
   - Stock inicial
   - Selecciona imagen (fotos reales disponibles)
4. Haz clic en **"Guardar"**

### **Desde el Código:**
Edita el archivo `/utils/init-database.ts` y agrega más productos en la función `crearDatosEjemplo()`:

```typescript
await api.productos.create({
  nombre: 'Tu Producto Wayuu',
  categoria: 'Mochilas', // O cualquier categoría
  precio: 150000,
  descripcion: 'Descripción detallada del producto',
  stock: 10,
  imagen: imgMochila // O cualquier URL de imagen
});
```

---

## 🖼️ IMÁGENES DISPONIBLES

El sistema incluye 7 imágenes reales de productos Wayuu:

1. **imgMochila** - Mochilas coloridas tejidas a mano
2. **imgBolso** - Bolsos tradicionales
3. **imgAccesorios** - Collares y accesorios
4. **imgBracelet** - Manillas y pulseras
5. **imgTextil** - Textiles y tapetes
6. **imgHamaca** - Chinchorros (hamacas)
7. **imgClutch** - Clutches elegantes

Todas las imágenes vienen de Unsplash y son de alta calidad.

---

## ⚠️ SOLUCIÓN DE PROBLEMAS

### **No veo imágenes, solo emojis**
- Verifica que tu conexión a internet esté activa
- Las imágenes vienen de Unsplash y requieren internet
- Si no cargan, el sistema automáticamente usa emojis como fallback

### **Los productos no aparecen**
1. Asegúrate de haber ejecutado la configuración inicial
2. Verifica en la consola si hay errores
3. Intenta hacer logout y login de nuevo
4. Verifica que estés en la sección "Productos" del menú

### **Error al crear productos**
1. Asegúrate de estar autenticado (login activo)
2. Verifica la consola del navegador para ver errores específicos
3. Intenta hacer login de nuevo:
   ```javascript
   await api.auth.login('admin@irakaworld.com', 'Iraka2025');
   ```

---

## 🎯 PRÓXIMOS PASOS SUGERIDOS

Ahora que tienes el catálogo, puedes:

1. ✅ **Crear pedidos** con los productos Wayuu
2. ✅ **Agregar productos al carrito** y generar facturas
3. ✅ **Gestionar inventario** con stock realista
4. ✅ **Asignar productos a clientes** en pedidos
5. ✅ **Generar PDFs** de facturas con productos Wayuu
6. ✅ **Crear más usuarios** vendedores para tu equipo

---

## 📚 DOCUMENTACIÓN COMPLETA

Para más detalles técnicos, consulta:
- 📄 **CATALOGO-WAYUU.md** - Lista completa de productos
- 📄 **GUIA-RAPIDA-INICIO.md** - Guía general de la app
- 📄 **GUIA-BASE-DE-DATOS.md** - Información del backend

---

## ✨ ¡DISFRUTA TU CATÁLOGO WAYUU!

Tu aplicación Irakaworld ahora tiene productos auténticos, imágenes reales y está lista para gestionar ventas de artesanía colombiana.

**¿Preguntas? Revisa la documentación o abre la consola del navegador para ver logs detallados.**

🎨 Inspirado en **@zeta.wayuu** - Artesanía Wayuu Auténtica
