import { Button } from '../ui';

interface NavbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export const Navbar = ({ title = 'User Management', onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <Button className="sm:hidden" onClick={onMenuClick} size="sm" type="button" variant="ghost">
          Menu
        </Button>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      <Button size="sm" type="button" variant="secondary">
        Nuevo usuario
      </Button>
    </header>
  );
};
