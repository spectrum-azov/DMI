import {
  Edit2,
  Trash2,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { QuickDateFilter } from './QuickDateFilter';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';
import { TablePagination } from './TablePagination';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (id: string) => void;
  emptyMessage?: string;
  dateField?: string;
}

/** Column keys visible by default for Rejected table */
const DEFAULT_VISIBLE: string[] = [
  'nomenclature',
  'quantity',
  'fullName',
  'department',
  'rejectedDate',
  'notes',
];

export function DataTable({
  data,
  columns,
  onEdit,
  onDelete,
  emptyMessage = 'Немає даних',
  dateField,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(DEFAULT_VISIBLE),
  );
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
  }, [searchTerm, dateFilter]);

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

  const dateFiltered = dateField
    ? data.filter((item) => isWithinPeriod(item[dateField], dateFilter))
    : data;

  const filteredData = dateFiltered.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchLower),
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;

    const aVal = (a as any)[sortColumn];
    const bVal = (b as any)[sortColumn];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Calculate paginated data
  const totalItems = sortedData.length;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {dateField ? (
          <div className="flex">
            <QuickDateFilter value={dateFilter} onChange={setDateFilter} />
          </div>
        ) : (
          <div />
        )}

        {/* Column visibility toggle */}
        <div className="relative" ref={columnsRef}>
          <button
            onClick={() => setIsColumnsOpen((o) => !o)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${isColumnsOpen
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            title="Налаштування колонок"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Колонки</span>
          </button>

          {isColumnsOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[210px]">
              <div className="flex items-center justify-between mb-2 pb-2 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-700">
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
                    className="flex items-center gap-2 py-1 px-1 rounded cursor-pointer hover:bg-gray-50 text-sm text-gray-700 select-none"
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
              <div className="mt-2 pt-2 border-t border-gray-100 flex gap-2">
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
                  className="text-xs text-gray-500 hover:underline"
                >
                  За замовч.
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Пошук..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {activeColumns.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 whitespace-nowrap"
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
              {(onEdit || onDelete) && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Дії
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + (onEdit || onDelete ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  {searchTerm || (dateField && dateFilter !== 'year')
                    ? 'Нічого не знайдено'
                    : emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  {activeColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {item[column.key] || '—'}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-1">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Редагувати"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
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
