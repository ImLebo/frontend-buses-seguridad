import { Button } from '../ui';

interface NavbarProps {
  title?: string;
  userName?: string;
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export const Navbar = ({ title = 'MS Security Platform', userName = 'Operador', onMenuClick, onLogout }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Button
            className="lg:hidden"
            onClick={onMenuClick}
            size="sm"
            type="button"
            variant="ghost"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">Sistema de Seguridad</p>
              <h1 className="text-sm font-semibold text-gray-900 sm:text-base">{title}</h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="text-xs text-gray-500">Sesión activa</p>
            <p className="text-sm font-semibold text-gray-900">{userName}</p>
          </div>

          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-sm font-semibold text-white shadow-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white"></div>
          </div>

          <Button
            onClick={onLogout}
            size="sm"
            type="button"
            variant="ghost"
            className="text-gray-600 hover:text-gray-900"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};
