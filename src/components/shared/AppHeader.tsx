import { LogOut, Menu } from 'lucide-react';
import logoIrakaworld from 'figma:asset/95c19a5ca5cd7a987b45131d4fca3837e0919929.png';
import { getCurrentUser, clearCurrentUser } from '../../utils/auth';
import { addActivityLog } from '../../utils/activity';

interface AppHeaderProps {
  title: string;
  onLogout?: () => void;
  showMenu?: boolean;
}

export function AppHeader({ title, onLogout, showMenu = true }: AppHeaderProps) {
  const handleLogout = () => {
    const user = getCurrentUser();
    if (user) {
      // Registrar logout en actividad
      addActivityLog(
        user.id,
        user.nombre,
        'Cierre de sesión',
        `${user.nombre} (@${user.usuario}) cerró sesión`,
        'logout'
      );
      clearCurrentUser();
    }
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-4 py-3 shadow-lg flex-shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showMenu && <Menu className="w-5 h-5" />}
          <img
            src={logoIrakaworld}
            alt="Irakaworld"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg leading-tight">{title}</h2>
            <p className="text-xs opacity-90">Irakaworld</p>
          </div>
        </div>
        {onLogout && (
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-amber-800 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}