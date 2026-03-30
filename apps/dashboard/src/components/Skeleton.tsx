// Base skeleton pulse block
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-kore-border/60 rounded ${className}`} />
  );
}

// Skeleton for a full card (used in overview pages)
export function CardSkeleton() {
  return (
    <div className="bg-kore-white border border-kore-border p-lg space-y-sm">
      <div className="flex items-center gap-md">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="flex-1 space-y-xs">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

// Skeleton for a table row
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-md py-md">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for a full table
export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-kore-white border border-kore-border overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-kore-border">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-md py-md text-left">
                <Skeleton className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRowSkeleton key={i} cols={cols} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton for KPI/stat cards row
export function StatCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-kore-white border border-kore-border p-xl flex items-start gap-lg">
          <Skeleton className="w-[44px] h-[44px]" />
          <div className="flex-1 space-y-xs">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton for a list page (header + stat cards + table)
export function ListPageSkeleton({ statCards = 4, tableRows = 5, tableCols = 5 }: { statCards?: number; tableRows?: number; tableCols?: number }) {
  return (
    <div className="space-y-xl">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="space-y-xs">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>
      {/* Stat cards */}
      <StatCardsSkeleton count={statCards} />
      {/* Table */}
      <TableSkeleton rows={tableRows} cols={tableCols} />
    </div>
  );
}

// Skeleton for a grid of cards
export function CardGridSkeleton({ count = 6, cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' }: { count?: number; cols?: string }) {
  return (
    <div className={`grid ${cols} gap-md`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// Skeleton for list items
export function ListItemSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-kore-border">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="px-md sm:px-xl py-md flex items-center justify-between">
          <div className="flex-1 space-y-xs">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/5" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      ))}
    </div>
  );
}
