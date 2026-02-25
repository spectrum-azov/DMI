import {
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  X,
  Plus,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NeedRecord, Directories } from '../types';
import { QuickDateFilter } from './QuickDateFilter';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';
import { TablePagination } from './TablePagination';

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

/** Column keys visible by default */
const DEFAULT_VISIBLE: string[] = [
  'id',
  'nomenclature',
  'quantity',
  'contactPerson',
  'department',
  'mobileNumber',
];

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
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('needs_visible_columns');
    return saved ? new Set(JSON.parse(saved)) : new Set(DEFAULT_VISIBLE);
  });
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const columnsRef = useRef<HTMLDivElement>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Close column panel when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        columnsRef.current &&
        !columnsRef.current.contains(e.target as Node)
      ) {
        setIsColumnsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, locationFilter]);

  // Persist column visibility
  useEffect(() => {
    localStorage.setItem('needs_visible_columns', JSON.stringify(Array.from(visibleColumns)));
  }, [visibleColumns]);

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const activeColumns = columns.filter((col) => visibleColumns.has(col.key));

  const filtered = data.filter((item) =>
    isWithinPeriod(item.requestDate, dateFilter) && (locationFilter === 0 || item.location === locationFilter)
  );

  const searchFiltered = filtered.filter((item) => {
    const lower = searchTerm.toLowerCase();
    return Object.values(item).some((v) =>
      String(v).toLowerCase().includes(lower),
    );
  });

  const sortedData = [...searchFiltered].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = (a as any)[sortColumn];
    const bVal = (b as any)[sortColumn];
    if (aVal === bVal) return 0;
    const cmp = aVal! < bVal! ? -1 : 1;
    return sortDirection === 'asc' ? cmp : -cmp;
  });

  // Calculate paginated data
  const totalItems = sortedData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar: Search, Add, Columns */}
      <div className="flex items-center gap-2">
        {/* Search - occupies most space */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Пошук..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-foreground"
          />
        </div>

        {/* Add Request - hidden on mobile next to search as per request */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap text-sm font-medium"
          >
            <Plus size={18} />
            Додати запит
          </button>
        )}

        {/* Column visibility toggle */}
        <div className="relative" ref={columnsRef}>
          <button
            onClick={() => setIsColumnsOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${isColumnsOpen
              ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
              : 'bg-card border-input text-foreground hover:bg-accent'
              }`}
            title="Налаштування колонок"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Колонки</span>
          </button>

          {isColumnsOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-lg p-3 min-w-[210px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                <span className="text-sm font-semibold text-foreground">
                  Видимі колонки
                </span>
                <button
                  onClick={() => setIsColumnsOpen(false)}
                  className="p-0.5 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="space-y-1">
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center gap-2 py-1 px-1 rounded cursor-pointer hover:bg-accent text-sm text-foreground select-none"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => toggleColumn(col.key)}
                      className="accent-blue-600 w-4 h-4 rounded"
                    />
                    {col.label}
                  </label>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-border flex gap-2">
                <button
                  onClick={() =>
                    setVisibleColumns(new Set(columns.map((c) => c.key)))
                  }
                  className="text-xs text-blue-600 hover:underline"
                >
                  Всі
                </button>
                <button
                  onClick={() =>
                    setVisibleColumns(new Set(DEFAULT_VISIBLE))
                  }
                  className="text-xs text-muted-foreground hover:underline"
                >
                  За замовч.
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Button for mobile only - since it was hidden from top row */}
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

      {/* Table */}
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-muted-foreground whitespace-nowrap">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + 1}
                  className="px-4 py-8 text-center text-muted-foreground text-sm"
                >
                  {searchTerm || dateFilter !== 'year'
                    ? 'Немає записів за вибраним фільтром'
                    : emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
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
                      {(() => {
                        const val = (item as any)[column.key];
                        if (val === undefined || val === null || val === '') return '—';
                        if (column.key === 'nomenclature') return directories?.nomenclatures.find(d => d.id === val)?.name || val;
                        if (column.key === 'type') return directories?.types.find(d => d.id === val)?.name || val;
                        if (column.key === 'department') return directories?.departments.find(d => d.id === val)?.name || val;
                        if (column.key === 'location') return directories?.locations.find(d => d.id === val)?.name || val;
                        return String(val);
                      })()}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      {onApprove && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onApprove(item);
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Погодити"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onReject(item);
                          }}
                          className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
                          title="Відхилити"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      {onEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(item);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                          title="Редагувати"
                        >
                          <Edit2 size={16} />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item.id);
                          }}
                          className="p-1.5 text-muted-foreground hover:bg-muted rounded transition-colors"
                          title="Видалити"
                        >
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
        totalItems={totalItems}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}