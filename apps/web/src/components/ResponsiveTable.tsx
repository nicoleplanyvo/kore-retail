import type { ReactNode } from 'react';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  hideOnMobile?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
}

export function ResponsiveTable<T>({ data, columns, keyExtractor, onRowClick, emptyMessage = 'Keine Daten vorhanden.' }: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500 text-center py-8">{emptyMessage}</p>;
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map(item => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-gray-50 ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">{col.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map(item => (
          <div
            key={keyExtractor(item)}
            onClick={() => onRowClick?.(item)}
            className={`bg-white border border-gray-100 rounded-lg p-4 space-y-2 ${onRowClick ? 'cursor-pointer active:bg-gray-50' : ''}`}
          >
            {columns.filter(c => !c.hideOnMobile).map(col => (
              <div key={col.key} className="flex items-center justify-between gap-2">
                <span className="text-xs text-gray-500 font-medium">{col.header}</span>
                <span className="text-sm text-gray-900 text-right">{col.render(item)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}
