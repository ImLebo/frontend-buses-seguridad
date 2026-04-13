import React, { useState, useEffect } from 'react';
import type { Permission, Role } from '../../types';

interface RolePermissionMatrixProps {
  role: Role;
  selectedPermissions: Permission[];
  onPermissionsChange: (permissions: Permission[]) => void;
  loading?: boolean;
  availablePermissions: Permission[];
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

export const RolePermissionMatrix: React.FC<RolePermissionMatrixProps> = ({
  role,
  selectedPermissions,
  onPermissionsChange,
  loading = false,
  availablePermissions,
}) => {
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

  const handleToggle = (module: string, action: string) => {
    const newMatrix = { ...matrix };
    newMatrix[module][action] = !newMatrix[module][action];
    setMatrix(newMatrix);

    // Actualizar permisos seleccionados
    const updated = availablePermissions.filter((p) => {
      return newMatrix[p.module as string]?.[p.action as string] || false;
    });

    onPermissionsChange(updated);
  };

  return (
    <div className="mt-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Matriz de Permisos</h3>
      <p className="mb-4 text-sm text-slate-600">
        Selecciona los permisos que deseas asignar al rol "{role.name}"
      </p>

      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-900">
                Módulo
              </th>
              {ACTIONS.map((action) => (
                <th
                  key={action}
                  className="border-b border-slate-200 px-4 py-3 text-center font-semibold text-slate-900"
                >
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MODULES.map((module, moduleIndex) => (
              <tr key={module} className={moduleIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                <td className="border-b border-slate-200 px-4 py-3 font-medium text-slate-900">
                  {module}
                </td>
                {ACTIONS.map((action) => (
                  <td
                    key={`${module}-${action}`}
                    className="border-b border-slate-200 px-4 py-3 text-center"
                  >
                    <input
                      type="checkbox"
                      disabled={loading}
                      checked={matrix[module]?.[action] || false}
                      onChange={() => handleToggle(module, action)}
                      className="cursor-pointer accent-blue-600 disabled:opacity-50"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700">
        <p>
          <strong>Total de permisos seleccionados:</strong> {selectedPermissions.length}
        </p>
      </div>
    </div>
  );
};

