import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { toast } from "sonner@2.0.3";

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevenir que el mini-infobar aparezca en mobile
      e.preventDefault();
      // Guardar el evento para poder mostrarlo después
      setDeferredPrompt(e);
      // Mostrar nuestro propio prompt de instalación
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Para iOS Safari
      if (isIOS() && !isInStandaloneMode()) {
        toast.info('Instalar Irakaworld', {
          description: 'Toca el botón de compartir y luego "Agregar a pantalla de inicio"',
          duration: 8000
        });
        return;
      }
      return;
    }

    // Mostrar el prompt de instalación
    deferredPrompt.prompt();

    // Esperar a que el usuario responda al prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      toast.success('¡Irakaworld instalada!', {
        description: 'La aplicación se ha agregado a tu pantalla de inicio'
      });
    }

    // Limpiar el prompt
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Guardar en localStorage que el usuario cerró el prompt
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Verificar si ya fue cerrado antes
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed === 'true') {
      setShowInstallPrompt(false);
    }
  }, []);

  // No mostrar si ya está instalada o en modo standalone
  if (isInStandaloneMode()) {
    return null;
  }

  if (!showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <div className="bg-white rounded-lg shadow-2xl border-2 border-amber-500 p-4 max-w-md mx-auto">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Download className="w-5 h-5 text-amber-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-slate-800 mb-1">Instalar Irakaworld</h3>
            <p className="text-sm text-slate-600 mb-3">
              Instala la app en tu dispositivo para acceso rápido y trabajo sin conexión
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstallClick}
                className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors text-sm"
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Detectar si es iOS
function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Detectar si ya está en modo standalone (instalada)
function isInStandaloneMode() {
  return ('standalone' in window.navigator && (window.navigator as any).standalone) || 
         window.matchMedia('(display-mode: standalone)').matches;
}
