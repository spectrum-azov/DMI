import {
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import { NeedRecord, Directories } from '../types';
import { DateFilter } from '../utils/dateUtils';
import { TablePagination } from './TablePagination';
import { useDataTable } from '../hooks/useDataTable';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableCell } from './DataTableCell';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface NeedsDataTableProps {
  data: NeedRecord[];
  columns: Column[];
  onEdit?: (item: NeedRecord) => void;
  onDelete?: (id: number) => void;
  onApprove?: (item: NeedRecord) => void;
  onReject?: (item: NeedRecord) => void;
  onRowClick?: (item: NeedRecord) => void;
  emptyMessage?: string;
  dateFilter: DateFilter;
  locationFilter: number;
  onAdd?: () => void;
  directories?: Directories;
}

const DEFAULT_VISIBLE = ['id', 'nomenclature', 'quantity', 'fullName', 'rank', 'department', 'mobileNumber'];

export function NeedsDataTable({
  data,
  columns,
  onEdit,
  onDelete,
  onApprove,
  onReject,
  onRowClick,
  emptyMessage = 'Немає даних',
  dateFilter,
  locationFilter,
  onAdd,
  directories,
}: NeedsDataTableProps) {
  const {
    searchTerm, setSearchTerm, sortColumn, sortDirection, handleSort,
    visibleColumns, toggleColumn, setVisibleColumns,
    currentPage, setCurrentPage, pageSize, setPageSize,
    paginatedData, totalItems,
  } = useDataTable({
    data, storageKey: 'needs_visible_columns', defaultVisibleColumns: DEFAULT_VISIBLE,
    dateField: 'requestDate', dateFilter, locationFilter,
  });

  const activeColumns = columns.filter((col) => visibleColumns.has(col.key));

  return (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        searchTerm={searchTerm} onSearchChange={setSearchTerm}
        columns={columns} visibleColumns={visibleColumns}
        onToggleColumn={toggleColumn} defaultVisibleColumns={DEFAULT_VISIBLE}
        onResetColumns={setVisibleColumns}
      >
        {onAdd && (
          <button
            onClick={onAdd}
            className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm font-medium"
          >
            <Plus size={18} />
            Додати запит
          </button>
        )}
      </DataTableToolbar>

      {onAdd && (
        <div className="sm:hidden">
          <button
            onClick={onAdd}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Plus size={18} />
            Додати запит
          </button>
        </div>
      )}

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {activeColumns.map((column) => (
                <th
                  key={column.key} onClick={() => handleSort(column.key)}
                  className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground cursor-pointer hover:bg-accent whitespace-nowrap"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {sortColumn === column.key && (
                      <span className="text-blue-600 text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={activeColumns.length + 1} className="px-4 py-8 text-center text-muted-foreground text-sm">
                  {searchTerm || dateFilter !== 'year' ? 'Немає записів за вибраним фільтром' : emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id} onClick={() => onRowClick && onRowClick(item as NeedRecord)}
                  className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10' : 'hover:bg-accent'}`}
                >
                  {activeColumns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                      <DataTableCell columnKey={column.key} value={(item as any)[column.key]} item={item} directories={directories} />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      {onApprove && (
                        <button onClick={(e) => { e.stopPropagation(); onApprove(item as NeedRecord); }} className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors" title="Погодити">
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {onReject && (
                        <button onClick={(e) => { e.stopPropagation(); onReject(item as NeedRecord); }} className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors" title="Відхилити">
                          <XCircle size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={(e) => { e.stopPropagation(); onEdit(item as NeedRecord); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Редагувати">
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors" title="Видалити">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        totalItems={totalItems} pageSize={pageSize} currentPage={currentPage}
        onPageChange={setCurrentPage} onPageSizeChange={setPageSize}
      />
    </div>
  );
}