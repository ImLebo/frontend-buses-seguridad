import type { UserFilters as UserFiltersValues, UserStatus } from '../../types';
import { Input } from '../ui';

interface UserFiltersProps {
  value: UserFiltersValues;
  onChange: (value: UserFiltersValues) => void;
}

const roleOptions: Array<string | 'all'> = ['all', 'admin', 'operator', 'viewer'];
const statusOptions: Array<UserStatus | 'all'> = ['all', 'active', 'inactive'];

export const UserFilters = ({ value, onChange }: UserFiltersProps) => {
  return (
    <section className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-3">
      <Input
        id="search"
        label="Buscar"
        onChange={(event) => onChange({ ...value, search: event.target.value })}
        placeholder="Nombre o correo"
        value={value.search}
      />

      <label className="space-y-1.5 text-sm font-medium text-slate-700" htmlFor="role-filter">
        Rol
        <select
          className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="role-filter"
          onChange={(event) => onChange({ ...value, role: event.target.value as string | 'all' })}
          value={value.role}
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-1.5 text-sm font-medium text-slate-700" htmlFor="status-filter">
        Estado
        <select
          className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          id="status-filter"
          onChange={(event) => onChange({ ...value, status: event.target.value as UserStatus | 'all' })}
          value={value.status}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
    </section>
  );
};
