import {
  Edit2,
  Trash2,
  RotateCcw,
  Send,
} from 'lucide-react';
import { DateFilter } from '../utils/dateUtils';
import { TablePagination } from './TablePagination';
import { Directories } from '../types';
import { useDataTable } from '../hooks/useDataTable';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableCell } from './DataTableCell';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (id: number) => void;
  onMoveToNeeds?: (item: any) => void;
  onMoveToIssuance?: (item: any) => void;
  emptyMessage?: string;
  dateField?: string;
  onRowClick?: (item: any) => void;
  dateFilter: DateFilter;
  locationFilter?: number;
  defaultVisibleColumns?: string[];
  storageKey?: string;
  directories?: Directories;
}

export function DataTable({
  data,
  columns,
  onEdit,
  onDelete,
  onMoveToNeeds,
  onMoveToIssuance,
  emptyMessage = 'Немає даних',
  dateField,
  onRowClick,
  dateFilter,
  locationFilter = 0,
  defaultVisibleColumns,
  storageKey = 'common_visible_columns',
  directories,
}: DataTableProps) {
  const {
    searchTerm,
    setSearchTerm,
    sortColumn,
    sortDirection,
    handleSort,
    visibleColumns,
    toggleColumn,
    setVisibleColumns,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedData,
    totalItems,
  } = useDataTable({
    data,
    storageKey,
    defaultVisibleColumns,
    dateField,
    dateFilter,
    locationFilter,
  });

  const activeColumns = columns.filter((col) => visibleColumns.has(col.key));
  const hasActions = onEdit || onDelete || onMoveToNeeds || onMoveToIssuance;

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        columns={columns}
        visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn}
        defaultVisibleColumns={defaultVisibleColumns}
        onResetColumns={setVisibleColumns}
      />

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {activeColumns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground cursor-pointer hover:bg-accent whitespace-nowrap"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="text-blue-600 text-xs">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {hasActions && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">
                  Дії
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + (hasActions ? 1 : 0)}
                  className="px-4 py-8 text-center text-muted-foreground text-sm"
                >
                  {searchTerm || (dateField && dateFilter !== 'year')
                    ? 'Нічого не знайдено'
                    : emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item: any) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10' : 'hover:bg-accent'}`}
                >
                  {activeColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-foreground whitespace-nowrap"
                    >
                      <DataTableCell columnKey={column.key} value={item[column.key]} item={item} directories={directories} />
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-1">
                        {onMoveToNeeds && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveToNeeds(item); }}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded transition-colors"
                            title="На погодження"
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                        {onMoveToIssuance && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onMoveToIssuance(item); }}
                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                            title="На видачу"
                          >
                            <Send size={16} />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            title="Редагувати"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                            className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            title="Видалити"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
