import { Battery, Wifi, Signal, Home, Users, Package, ShoppingBag, FileText, ShoppingCart, List, Archive, UserCog, Activity, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { ClientesScreen } from './screens/ClientesScreen';
import { ProductosScreen } from './screens/ProductosScreen';
import { InventariosScreen } from './screens/InventariosScreen';
import { PedidoScreen } from './screens/PedidoScreen';
import { LineaPedidoScreen } from './screens/LineaPedidoScreen';
import { FacturaScreen } from './screens/FacturaScreen';
import { CarritoScreen } from './screens/CarritoScreen';
import { UsuariosScreen } from './screens/UsuariosScreen';
import { ActividadScreen } from './screens/ActividadScreen';
import { KardexScreen } from './screens/KardexScreen';
import { AppHeader } from './shared/AppHeader';
import { Toaster } from './ui/sonner';
import { getCurrentUser } from '../utils/auth';
import { PWAInstallPrompt } from './PWAInstallPrompt';
import { PWAHead } from './PWAHead';
import { SetupScreen } from './SetupScreen';
import { DebugPanel } from './DebugPanel';

type Screen = 'login' | 'dashboard' | 'clientes' | 'productos' | 'inventarios' | 'pedido' | 'lineapedido' | 'factura' | 'carrito' | 'usuarios' | 'actividad' | 'kardex';

export function AndroidMockup() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  // Obtener el usuario actual para verificar permisos
  const currentUser = currentScreen !== 'login' ? getCurrentUser() : null;
  const isAdmin = currentUser?.rol === 'Admin';

  const menuItems = [
    { id: 'dashboard' as Screen, icon: Home, label: 'Inicio', title: 'Dashboard' },
    { id: 'clientes' as Screen, icon: Users, label: 'Clientes', title: 'Clientes' },
    { id: 'productos' as Screen, icon: Package, label: 'Productos', title: 'Productos' },
    { id: 'kardex' as Screen, icon: BarChart3, label: 'Kardex', title: 'Kardex de Inventario' },
    { id: 'inventarios' as Screen, icon: Archive, label: 'Inventario', title: 'Inventarios' },
    { id: 'pedido' as Screen, icon: ShoppingBag, label: 'Pedidos', title: 'Pedidos' },
    { id: 'lineapedido' as Screen, icon: List, label: 'Líneas', title: 'Líneas de Pedido' },
    { id: 'factura' as Screen, icon: FileText, label: 'Facturas', title: 'Facturas' },
    { id: 'carrito' as Screen, icon: ShoppingCart, label: 'Carrito', title: 'Carrito de Compra' },
    // Solo mostrar estas opciones a Admins
    ...(isAdmin ? [
      { id: 'usuarios' as Screen, icon: UserCog, label: 'Usuarios', title: 'Gestión de Usuarios' },
      { id: 'actividad' as Screen, icon: Activity, label: 'Actividad', title: 'Registro de Actividad' },
    ] : []),
  ];

  const getCurrentTitle = () => {
    const current = menuItems.find(item => item.id === currentScreen);
    return current?.title || 'Irakaworld';
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('dashboard')} />;
      case 'dashboard':
        return <DashboardScreen />;
      case 'clientes':
        return <ClientesScreen />;
      case 'productos':
        return <ProductosScreen />;
      case 'kardex':
        return <KardexScreen />;
      case 'inventarios':
        return <InventariosScreen />;
      case 'pedido':
        return <PedidoScreen />;
      case 'lineapedido':
        return <LineaPedidoScreen />;
      case 'factura':
        return <FacturaScreen />;
      case 'carrito':
        return <CarritoScreen />;
      case 'usuarios':
        return <UsuariosScreen />;
      case 'actividad':
        return <ActividadScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-8">
      {/* Phone Frame */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[3rem] shadow-2xl p-3">
        {/* Phone Border */}
        <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden flex flex-col">
          {/* Status Bar */}
          <div className="bg-white px-6 py-2 flex items-center justify-between flex-shrink-0 z-10">
            <span className="text-sm">9:41</span>
            <div className="flex items-center gap-1">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Header - Solo mostrar si NO está en login o setup */}
          {currentScreen !== 'login' && (
            <AppHeader title={getCurrentTitle()} onLogout={handleLogout} />
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-hidden">
            {renderScreen()}
          </div>

          {/* Bottom Navigation - Solo mostrar si NO está en login o setup */}
          {currentScreen !== 'login' && (
            <div className="flex-shrink-0 bg-white border-t border-slate-200 shadow-lg">
              <div className="grid grid-cols-5 gap-1 px-2 py-2">
                {menuItems.slice(0, 5).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentScreen(item.id)}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                        isActive ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* Second Row Navigation */}
              <div className="grid grid-cols-4 gap-1 px-2 pb-2">
                {menuItems.slice(5).map((item) => {
                  const Icon = item.icon;
                  const isActive = currentScreen === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentScreen(item.id)}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-colors ${
                        isActive ? 'text-amber-600 bg-amber-50' : 'text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Camera Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl"></div>
      </div>
      
      {/* Toast Notifications */}
      <Toaster position="top-center" richColors />
      {/* PWA Install Prompt - Comentado temporalmente para evitar problemas */}
      {/* <PWAInstallPrompt /> */}
      {/* PWA Head */}
      <PWAHead />
      
      {/* Debug Panel - Solo visible cuando NO estás en login */}
      {currentScreen !== 'login' && <DebugPanel />}
    </div>
  );
}