import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronsUpDown, ChevronUp, Download } from 'lucide-react';
import React, { useMemo, useState } from 'react';

interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface EnterpriseTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  exportable?: boolean;
  className?: string;
  keyExtractor: (row: T) => string | number;
}

export function EnterpriseTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  searchable = true,
  exportable = true,
  className,
  keyExtractor,
}: EnterpriseTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | string;
    direction: 'asc' | 'desc';
  } | null>(null);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [data, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      if (sortConfig.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof T | string) => {
    setSortConfig((current) => {
      if (!current || current.key !== key) {
        return { key, direction: 'asc' };
      }
      if (current.direction === 'asc') {
        return { key, direction: 'desc' };
      }
      return null;
    });
  };

  const exportToCSV = () => {
    const headers = columns.map((col) => col.header).join(',');
    const rows = sortedData.map((row) =>
      columns.map((col) => {
        const value = row[col.key as keyof T];
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `export-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getSortIcon = (columnKey: keyof T | string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronsUpDown className="w-3 h-3 ml-1 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-3 h-3 ml-1" />
    ) : (
      <ChevronDown className="w-3 h-3 ml-1" />
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Toolbar */}
      {(searchable || exportable) && (
        <div className="flex items-center justify-between gap-4">
          {searchable && (
            <Input
              type="text"
              placeholder="Search table... (Press / to focus)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setSearchQuery('');
                  e.currentTarget.blur();
                }
              }}
              className="max-w-sm bg-black/30 border-enterprise-primary/20 text-white placeholder:text-white/40 font-mono"
            />
          )}
          
          {exportable && (
            <Button
              onClick={exportToCSV}
              variant="outline"
              size="sm"
              className="border-enterprise-primary/20 text-white hover:bg-enterprise-primary/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-enterprise-primary/20">
        <table className="enterprise-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{ width: column.width }}
                  className={cn(
                    column.sortable !== false && 'cursor-pointer hover:bg-enterprise-primary/5'
                  )}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-white/40">
                  No data found
                </td>
              </tr>
            ) : (
              sortedData.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(onRowClick && 'cursor-pointer')}
                >
                  {columns.map((column) => (
                    <td key={String(column.key)}>
                      {column.render
                        ? column.render(row)
                        : String(row[column.key as keyof T] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="text-sm text-white/60 font-mono">
        Showing {sortedData.length} of {data.length} rows
        {searchQuery && ` (filtered from ${data.length})`}
      </div>
    </div>
  );
}

