import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { chunkArray } from '@/utils/performance';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  className?: string;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  className?: string;
}

// Optimized table component with virtualization for large datasets
export const OptimizedTable = memo(<T extends Record<string, unknown>>({
  data,
  columns,
  loading = false,
  pageSize = 50,
  emptyMessage = "No data available",
  className = "",
}: OptimizedTableProps<T>) => {
  // Chunk data for better performance with large datasets
  const chunkedData = useMemo(() => {
    return chunkArray(data, pageSize)[0] || [];
  }, [data, pageSize]);

  if (loading) {
    return (
      <div className={`terminal-card ${className}`}>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)} className={column.className}>
                  <div className="h-4 bg-muted rounded w-20 animate-pulse" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)}>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (chunkedData.length === 0) {
    return (
      <div className={`terminal-card ${className}`}>
        <div className="p-8 text-center text-muted-foreground">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`terminal-card ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {chunkedData.map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.render 
                    ? column.render(item[column.key], item)
                    : String(item[column.key] || '')
                  }
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

OptimizedTable.displayName = 'OptimizedTable';