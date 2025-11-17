# 📱 Instalar Irakaworld como PWA (App Móvil)

Tu aplicación Irakaworld ahora está lista para funcionar como una **Progressive Web App (PWA)**, lo que significa que puedes instalarla en tu celular y usarla como una app nativa.

## ✨ Beneficios de la PWA

- 📲 **Instalar en pantalla de inicio** - Aparece como cualquier otra app
- 🚀 **Acceso rápido** - Abre directamente sin navegador
- 💾 **Funciona offline** - Cachea datos para trabajo sin conexión
- 🔔 **Experiencia nativa** - Pantalla completa, sin barras del navegador
- ⚡ **Más rápida** - Carga instantánea después de la primera vez

## 📲 Cómo Instalar en Android

### Opción 1: Chrome (Recomendado)

1. **Abre la aplicación** en Chrome desde tu celular Android
2. Verás un **banner emergente** en la parte inferior que dice "Instalar Irakaworld"
3. Toca **"Instalar"**
4. Confirma tocando **"Instalar"** nuevamente
5. ✅ ¡Listo! La app aparecerá en tu pantalla de inicio

### Opción 2: Menú Manual

Si no ves el banner automático:

1. Abre la app en Chrome
2. Toca el **menú de tres puntos** (⋮) en la esquina superior derecha
3. Selecciona **"Agregar a pantalla de inicio"** o **"Instalar aplicación"**
4. Escribe "Irakaworld" como nombre
5. Toca **"Agregar"**
6. ✅ ¡Instalada!

## 📱 Cómo Instalar en iPhone (iOS)

### Safari (Único navegador compatible en iOS)

1. **Abre la aplicación** en Safari desde tu iPhone
2. Toca el botón de **Compartir** (□ con flecha hacia arriba) en la parte inferior
3. Desplázate hacia abajo y selecciona **"Agregar a pantalla de inicio"**
4. Edita el nombre si deseas (deja "Irakaworld")
5. Toca **"Agregar"** en la esquina superior derecha
6. ✅ ¡Lista para usar!

**Nota:** En iOS, la instalación PWA solo funciona desde Safari, no desde Chrome u otros navegadores.

## 🖥️ Características Técnicas Implementadas

### ✅ Manifest (manifest.json)
- Nombre de la app: "Irakaworld - Gestión de Ventas"
- Íconos: 192x192 y 512x512
- Tema: Ámbar (#d97706) - colores de Irakaworld
- Modo: Standalone (pantalla completa)
- Orientación: Portrait (vertical)

### ✅ Service Worker (service-worker.js)
- Cache de recursos estáticos
- Funcionamiento offline
- Actualizaciones automáticas
- Estrategia: Cache First, Network Fallback

### ✅ Meta Tags
- Theme color: Ámbar (#d97706)
- Apple Mobile Web App compatible
- Viewport optimizado para móviles
- Barra de estado iOS en negro translúcido

### ✅ Componentes PWA
- **PWAInstallPrompt**: Banner de instalación personalizado
- **PWAHead**: Inyección dinámica de meta tags
- **Service Worker**: Registrado automáticamente al cargar

## 🎯 Cómo Usar la App Instalada

1. **Busca el ícono** de Irakaworld en tu pantalla de inicio
2. **Toca para abrir** - Se abrirá en pantalla completa
3. **Inicia sesión** con las credenciales:
   - Usuario: `Ciprian5050`
   - Contraseña: `Iraka2025`
4. **¡Disfruta!** Navega por todas las pantallas como una app nativa

## 🔧 Funcionalidades Disponibles Offline

Una vez instalada, estas funciones estarán disponibles sin conexión:

- ✅ **Login** - Autenticación local
- ✅ **Dashboard** - Visualización de datos cacheados
- ✅ **Clientes** - Lista de clientes
- ✅ **Productos** - Catálogo de productos
- ✅ **Inventarios** - Gestión de stock
- ✅ **Pedidos** - Historial y creación
- ✅ **Facturas** - Visualización y descarga de PDFs
- ✅ **Carrito** - Carrito de compras
- ✅ **Usuarios** (Admin) - Gestión de empleados
- ✅ **Actividad** (Admin) - Registro de acciones

## 🎨 Diseño Móvil Optimizado

- **Formato móvil**: 375x812px (iPhone X/11/12)
- **Maqueta Android**: Diseño con marco de teléfono
- **Navegación inferior**: Menú de 5 + 4 opciones
- **Tema artesanal**: Colores ámbar/naranja de Irakaworld
- **Logo**: Presente en todas las pantallas

## 📊 Generación de PDFs

- **Facturas en PDF**: Descarga directa usando jsPDF
- **Diseño profesional**: Con logo y datos de la empresa
- **Formato**: A4, listo para imprimir
- **Incluye**: Productos, subtotales, IVA 19%, total en COP

## 🔐 Sistema de Usuarios

### Credenciales de Prueba

**Admin:**
- Usuario: `Ciprian5050`
- Contraseña: `Iraka2025`
- Permisos: Acceso completo

**Vendedor:**
- Usuario: `maria.gomez`
- Contraseña: `maria123`
- Permisos: Sin acceso a Usuarios ni Actividad

## 🆘 Solución de Problemas

### El banner de instalación no aparece

**Causa:** El navegador puede haber bloqueado el prompt automático

**Solución:** Usa el método manual del menú (tres puntos → Agregar a pantalla)

### La app no funciona offline

**Causa:** El Service Worker no se registró correctamente

**Solución:**
1. Abre las DevTools (F12)
2. Ve a Application → Service Workers
3. Verifica que esté "Activated and running"
4. Recarga la página

### Los íconos no se ven

**Causa:** Los archivos de íconos pueden faltar

**Solución:**
- Los íconos se generan automáticamente
- Asegúrate de que `/public/icon-192.png` y `/public/icon-512.png` existan
- Puedes usar el logo de Irakaworld como ícono

### En iOS no puedo instalar

**Causa:** iOS solo permite PWA desde Safari

**Solución:**
1. Abre la app específicamente en **Safari** (no Chrome)
2. Sigue los pasos de instalación para iOS mencionados arriba

## 📱 Diferencias entre Web y PWA Instalada

| Característica | Web (Navegador) | PWA Instalada |
|----------------|-----------------|---------------|
| Pantalla completa | ❌ | ✅ |
| Ícono en inicio | ❌ | ✅ |
| Offline | Parcial | ✅ |
| Rendimiento | Bueno | Excelente |
| Notificaciones* | ❌ | ✅ |
| Updates automáticos | ✅ | ✅ |

*Las notificaciones push requieren implementación adicional

## 🚀 Próximos Pasos (Opcional)

Para mejorar aún más la PWA, podrías agregar:

- 🔔 **Push Notifications** - Alertas de pedidos nuevos
- 🔄 **Background Sync** - Sincronización en segundo plano
- 📸 **Camera API** - Escaneo de códigos de barras
- 📍 **Geolocation** - Ubicación de clientes
- 💳 **Payment Request API** - Pagos integrados

## ✅ Checklist de Instalación

- [ ] Aplicación abierta en Chrome (Android) o Safari (iOS)
- [ ] Banner de instalación visible (o usar menú manual)
- [ ] Toca "Instalar" y confirma
- [ ] Ícono de Irakaworld en pantalla de inicio
- [ ] Abre la app desde el ícono
- [ ] Login exitoso con credenciales
- [ ] Navega por las diferentes pantallas
- [ ] Descarga un PDF de factura
- [ ] ¡Todo funcionando!

---

## 📞 Soporte

Si tienes problemas con la instalación, verifica:

1. **Navegador actualizado** - Chrome 80+ o Safari 13+
2. **HTTPS** - La PWA requiere conexión segura (automático en Figma Make)
3. **Manifest válido** - Verifica en DevTools → Application → Manifest
4. **Service Worker activo** - DevTools → Application → Service Workers

¡Disfruta de tu nueva app móvil Irakaworld! 🎉
