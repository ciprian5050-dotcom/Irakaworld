# 📱 Irakaworld - Instalación Móvil PWA

## 🎯 ¿Qué es esto?

Tu aplicación **Irakaworld** ahora funciona como una **Progressive Web App (PWA)**, lo que significa que se puede instalar en tu celular como una app nativa de Android o iOS.

---

## 🚀 Instalación Rápida

### 📱 Android (Chrome)

1. Abre la app en **Chrome** en tu Android
2. Verás un banner que dice **"Instalar Irakaworld"**
3. Toca **"Instalar"**
4. ✅ ¡Listo! Búscala en tu pantalla de inicio

**O manualmente:**
- Menú (⋮) → **"Agregar a pantalla de inicio"**

### 📱 iPhone (Safari)

1. Abre la app en **Safari** (solo funciona en Safari)
2. Toca el botón **Compartir** (□↑)
3. Selecciona **"Agregar a pantalla de inicio"**
4. Toca **"Agregar"**
5. ✅ ¡Lista!

---

## ✨ Beneficios

| Característica | Web Normal | PWA Instalada |
|----------------|------------|---------------|
| 📱 Ícono en inicio | ❌ | ✅ |
| 🖥️ Pantalla completa | ❌ | ✅ |
| ⚡ Carga rápida | Normal | Instantánea |
| 💾 Funciona offline | ❌ | ✅ |
| 🎨 Experiencia nativa | ❌ | ✅ |

---

## 🔐 Credenciales de Acceso

**Administrador:**
```
Usuario: Ciprian5050
Contraseña: Iraka2025
```

**Vendedor:**
```
Usuario: maria.gomez
Contraseña: maria123
```

---

## 📊 Funcionalidades

### ✅ Todos los Usuarios
- 📊 Dashboard con estadísticas
- 👥 Gestión de Clientes
- 📦 Catálogo de Productos
- 📋 Control de Inventarios
- 🛍️ Creación de Pedidos
- 📄 Generación de Facturas con PDF
- 🛒 Carrito de Compras

### 👑 Solo Administradores
- 👤 Gestión de Usuarios
- 📝 Registro de Actividad

---

## 🎨 Diseño

- **Tema:** Artesanal con colores ámbar/naranja
- **Logo:** Irakaworld presente en todas las pantallas
- **Formato:** Optimizado para móviles (375x812px)
- **Navegación:** Menú inferior intuitivo

---

## 📄 Generación de PDFs

Las facturas se pueden descargar como PDF profesional:
- ✅ Logo de Irakaworld
- ✅ Información completa de la empresa
- ✅ Tabla de productos
- ✅ Cálculos (Subtotal, IVA 19%, Total)
- ✅ Formato A4 listo para imprimir
- ✅ Precios en pesos colombianos (COP)

---

## 🔧 Archivos PWA Implementados

```
/public/
  ├── manifest.json          # Configuración de la PWA
  └── service-worker.js      # Cache y funcionamiento offline

/components/
  ├── PWAInstallPrompt.tsx   # Banner de instalación
  └── PWAHead.tsx            # Meta tags dinámicos
```

---

## 💡 Características Técnicas

- **Service Worker:** Cachea recursos para uso offline
- **Manifest:** Define nombre, íconos y comportamiento
- **Meta Tags:** Optimización para iOS y Android
- **Theme Color:** Ámbar (#d97706) - color de marca

---

## 🆘 Problemas Comunes

**❓ No veo el banner de instalación**
- Usa el menú manual: Chrome → ⋮ → "Agregar a pantalla"

**❓ No funciona en iPhone**
- IMPORTANTE: Solo funciona en Safari, no en Chrome iOS

**❓ La app no funciona offline**
- Abre DevTools → Application → Service Workers
- Verifica que esté "Activated and running"

---

## 📞 Instrucciones Completas

Para instrucciones detalladas, consulta: **INSTRUCCIONES_PWA.md**

---

## ✅ Checklist Post-Instalación

- [ ] Ícono visible en pantalla de inicio
- [ ] Al abrir, se muestra en pantalla completa
- [ ] Login funciona correctamente
- [ ] Puedes navegar por todas las secciones
- [ ] PDFs de facturas se descargan correctamente
- [ ] Funciona sin conexión (después del primer uso)

---

## 🎉 ¡Todo Listo!

Tu aplicación Irakaworld está lista para usarse como una app móvil profesional. Disfruta de la experiencia nativa en tu celular.

**Características implementadas:**
- ✅ Sistema de login con validación
- ✅ Multi-usuario (Admin/Vendedor)
- ✅ Gestión completa de ventas
- ✅ PDFs profesionales de facturas
- ✅ Control de permisos por rol
- ✅ Registro de actividad de usuarios
- ✅ PWA instalable en móviles
- ✅ Funcionamiento offline

---

**Desarrollado para Irakaworld** 🎨
*Productos Artesanales de Calidad*
