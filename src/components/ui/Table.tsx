import type { ReactNode } from 'react';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
}

export const Table = <T,>({ data, columns, rowKey, emptyMessage = 'Sin datos para mostrar.' }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="min-w-full border-collapse">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr className="border-t border-slate-200 hover:bg-slate-50" key={rowKey(row)}>
                {columns.map((column) => (
                  <td className="px-4 py-3 text-sm text-slate-700" key={String(column.key)}>
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
