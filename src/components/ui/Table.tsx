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
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-slate-100/80">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-secondary ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-5 py-10 text-center text-sm text-text-muted" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr className="border-t border-border transition-colors duration-200 hover:bg-slate-50/90" key={rowKey(row)}>
                {columns.map((column) => (
                  <td className={`px-5 py-3.5 text-sm text-text-secondary ${column.className ?? ''}`} key={String(column.key)}>
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
