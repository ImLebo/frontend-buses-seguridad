import { useMemo, useState, useEffect, type FormEvent } from 'react';
import type { CreateRoleInput, Role, Permission } from '../../types';
import { Button, Input } from '../ui';

interface RoleFormProps {
  mode: 'create' | 'edit';
  initialValues?: Role;
  submitting?: boolean;
  onSubmit: (values: CreateRoleInput) => Promise<void> | void;
  onCancel: () => void;
  availablePermissions?: Permission[];
  selectedPermissions?: Permission[];
  onPermissionsChange?: (permissions: Permission[]) => void;
}

const MODULES = [
  'USUARIOS',
  'BUSES',
  'RUTAS',
  'PROGRAMACIONES',
  'REPORTES',
  'INCIDENTES',
  'MENSAJES',
  'ROLES',
  'PERMISOS',
];

const ACTIONS = ['READ', 'CREATE', 'UPDATE', 'DELETE'];

// Colores para las acciones
const ACTION_COLORS: Record<string, string> = {
  READ: 'bg-blue-100 text-blue-700 border-blue-300',
  CREATE: 'bg-green-100 text-green-700 border-green-300',
  UPDATE: 'bg-orange-100 text-orange-700 border-orange-300',
  DELETE: 'bg-red-100 text-red-700 border-red-300',
};

export const RoleForm = ({
  mode,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
  availablePermissions = [],
  selectedPermissions = [],
  onPermissionsChange,
}: RoleFormProps) => {
  const [values, setValues] = useState<CreateRoleInput>({
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
  });
  const [touched, setTouched] = useState({ name: false, description: false });
  const [matrix, setMatrix] = useState<{ [key: string]: { [key: string]: boolean } }>({});

  useEffect(() => {
    // Inicializar matriz basada en permisos seleccionados
    const newMatrix: { [key: string]: { [key: string]: boolean } } = {};

    MODULES.forEach((module) => {
      newMatrix[module] = {};
      ACTIONS.forEach((action) => {
        const hasPermission = selectedPermissions.some(
          (p) => p.module === module && p.action === action
        );
        newMatrix[module][action] = hasPermission;
      });
    });

    setMatrix(newMatrix);
  }, [selectedPermissions]);

  const errors = useMemo(() => {
    return {
      name: values.name.trim() ? '' : 'El nombre es obligatorio.',
      description: values.description.trim() ? '' : 'La descripción es obligatoria.',
    };
  }, [values]);

  const isValid = Object.values(errors).every((error) => error.length === 0);

  const handleToggle = (module: string, action: string) => {
    const newMatrix = { ...matrix };
    newMatrix[module][action] = !newMatrix[module][action];
    setMatrix(newMatrix);

    // Actualizar permisos seleccionados
    const updated = availablePermissions.filter((p) => {
      return newMatrix[p.module as string]?.[p.action as string] || false;
    });

    onPermissionsChange?.(updated);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, description: true });

    if (!isValid) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      {/* Sección 1: Información Básica */}
      <div className="space-y-1">
        <div>
          <h3 className="mb-1 flex items-center gap-1 text-xs font-semibold text-slate-900">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-blue-600 text-xs font-bold text-white">
              1
            </span>
            Información del Rol
          </h3>
        </div>

        <div className="space-y-1 rounded-lg bg-slate-50 p-2">
          <Input
            error={touched.name ? errors.name : undefined}
            id="role-name"
            label="Nombre"
            onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
            onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
            placeholder="Administrador..."
            value={values.name}
          />

          <Input
            error={touched.description ? errors.description : undefined}
            id="role-description"
            label="Descripción"
            onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
            onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
            placeholder="Rol para administradores..."
            value={values.description}
          />
        </div>
      </div>

      {/* Sección 2: Matriz de Permisos */}
      <div className="space-y-1 border-t border-slate-200 pt-2">
        <h3 className="flex items-center gap-1 text-xs font-semibold text-slate-900">
          <span className="flex h-4 w-4 items-center justify-center rounded bg-green-600 text-xs font-bold text-white">
            2
          </span>
          Permisos
        </h3>

        {/* Leyenda de acciones - muy compacta */}
        <div className="mb-1 grid grid-cols-4 gap-0.5 rounded-lg bg-slate-50 p-1">
          {ACTIONS.map((action) => (
            <div key={action} className="flex items-center gap-0.5">
              <div className={`h-1.5 w-1.5 rounded border ${ACTION_COLORS[action]}`}></div>
              <span className="text-xs font-medium text-slate-600">{action[0]}</span>
            </div>
          ))}
        </div>

        {/* Tabla de permisos - muy compacta */}
        <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-xs">
            <thead className="sticky top-0">
              <tr className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
                <th className="px-1 py-1 text-left font-semibold text-slate-900">Módulo</th>
                {ACTIONS.map((action) => (
                  <th
                    key={action}
                    className={`px-0.5 py-1 text-center font-semibold text-slate-900 ${ACTION_COLORS[action]}`}
                  >
                    {action[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MODULES.map((module, moduleIndex) => (
                <tr
                  key={module}
                  className={`border-b border-slate-100 hover:bg-blue-50 ${
                    moduleIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="px-1 py-0.5 font-medium text-slate-900">{module}</td>
                  {ACTIONS.map((action) => {
                    const isChecked = matrix[module]?.[action] || false;
                    return (
                      <td
                        key={`${module}-${action}`}
                        className="px-0.5 py-0.5 text-center"
                      >
                        <input
                          type="checkbox"
                          disabled={submitting}
                          checked={isChecked}
                          onChange={() => handleToggle(module, action)}
                          className="h-3 w-3 rounded border-slate-300 accent-blue-600 disabled:opacity-50"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen de permisos - muy compacto */}
        <div className="grid grid-cols-3 gap-1">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-1">
            <p className="text-xs font-semibold text-blue-900">Sel.</p>
            <p className="text-sm font-bold text-blue-600">{selectedPermissions.length}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-1">
            <p className="text-xs font-semibold text-slate-900">Disp.</p>
            <p className="text-sm font-bold text-slate-600">{MODULES.length * ACTIONS.length}</p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-1">
            <p className="text-xs font-semibold text-green-900">Cob.</p>
            <p className="text-sm font-bold text-green-600">
              {Math.round((selectedPermissions.length / (MODULES.length * ACTIONS.length)) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-1 border-t border-slate-200 pt-2">
        <Button
          onClick={onCancel}
          type="button"
          variant="ghost"
          className="text-xs py-1 px-2"
        >
          Cancelar
        </Button>
        <Button
          disabled={!isValid || submitting}
          loading={submitting}
          type="submit"
          className="text-xs py-1 px-3"
        >
          {mode === 'create' ? 'Crear' : 'Guardar'}
        </Button>
      </div>
    </form>
  );
};
