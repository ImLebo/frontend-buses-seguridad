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
    <div className="overflow-x-auto rounded-2xl border border-white/20 bg-white/90 backdrop-blur-sm shadow-xl shadow-indigo-500/5">
      <table className="min-w-full border-collapse">
        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-indigo-700 ${column.className ?? ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="px-6 py-12 text-center text-sm text-gray-500" colSpan={columns.length}>
                <div className="flex flex-col items-center gap-2">
                  <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                className="border-t border-gray-100 transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 hover:shadow-sm"
                key={rowKey(row)}
              >
                {columns.map((column) => (
                  <td className={`px-6 py-4 text-sm text-gray-700 ${column.className ?? ''}`} key={String(column.key)}>
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
