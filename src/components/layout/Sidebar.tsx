import { cn } from '../../utils/cn';

export interface NavItem {
  id: string;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  items: NavItem[];
}

export const Sidebar = ({ items }: SidebarProps) => {
  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 md:h-full md:w-64 md:border-b-0 md:border-r">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Navegacion</p>
      <nav>
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                className={cn(
                  'w-full rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  item.active ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100',
                )}
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
