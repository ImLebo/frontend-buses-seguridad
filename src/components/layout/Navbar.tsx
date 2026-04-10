import { Button } from '../ui';

interface NavbarProps {
  title?: string;
  userName?: string;
  onMenuClick?: () => void;
}

export const Navbar = ({ title = 'MS Security Platform', userName = 'Operador', onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-3">
        <Button className="sm:hidden" onClick={onMenuClick} size="sm" type="button" variant="ghost">
          Menu
        </Button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Sistema institucional</p>
          <h1 className="text-base font-semibold text-text-primary sm:text-lg">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-xs text-text-muted">Sesion activa</p>
          <p className="text-sm font-semibold text-text-primary">{userName}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
          {userName.charAt(0).toUpperCase()}
        </div>
        <Button size="sm" type="button" variant="ghost">
          Logout
        </Button>
      </div>
    </header>
  );
};
