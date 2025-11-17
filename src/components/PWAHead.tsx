import { useEffect } from 'react';

export function PWAHead() {
  useEffect(() => {
    // Agregar meta tags para PWA
    const metaTags = [
      { name: 'theme-color', content: '#d97706' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: 'Irakaworld' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'application-name', content: 'Irakaworld' },
      { name: 'msapplication-TileColor', content: '#d97706' },
      { name: 'msapplication-tap-highlight', content: 'no' },
    ];

    metaTags.forEach(({ name, content }) => {
      const existing = document.querySelector(`meta[name="${name}"]`);
      if (!existing) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });

    // Agregar link al manifest
    const manifestLink = document.querySelector('link[rel="manifest"]');
    if (!manifestLink) {
      const link = document.createElement('link');
      link.rel = 'manifest';
      link.href = '/manifest.json';
      document.head.appendChild(link);
    }

    // Agregar viewport si no existe
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(meta);
    }

    // Actualizar el título
    document.title = 'Irakaworld - Gestión de Ventas';
  }, []);

  return null;
}
