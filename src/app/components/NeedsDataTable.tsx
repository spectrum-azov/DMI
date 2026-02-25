import {
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NeedRecord } from '../types';
import { QuickDateFilter } from './QuickDateFilter';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface NeedsDataTableProps {
  data: NeedRecord[];
  columns: Column[];
  onEdit?: (item: NeedRecord) => void;
  onDelete?: (id: string) => void;
  onApprove?: (item: NeedRecord) => void;
  onReject?: (item: NeedRecord) => void;
  emptyMessage?: string;
}

/** Column keys visible by default */
const DEFAULT_VISIBLE: string[] = [
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
  emptyMessage = 'Немає даних',
}: NeedsDataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [dateFilter, setDateFilter] = useState<DateFilter>('month');
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(DEFAULT_VISIBLE),
  );
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const columnsRef = useRef<HTMLDivElement>(null);

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

  const dateFiltered = data.filter((item) =>
    isWithinPeriod(item.requestDate, dateFilter),
  );

  const searchFiltered = dateFiltered.filter((item) => {
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
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Quick date filter */}
        <QuickDateFilter
          value={dateFilter}
          onChange={setDateFilter}
          className="flex-shrink-0"
        />

        {/* Spacer */}
        <div className="flex-1" />

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

      {/* Search */}
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

      {/* Table */}
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
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                Дії
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={activeColumns.length + 1}
                  className="px-4 py-8 text-center text-gray-500 text-sm"
                >
                  {searchTerm || dateFilter !== 'year'
                    ? 'Немає записів за вибраним фільтром'
                    : emptyMessage}
                </td>
              </tr>
            ) : (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {activeColumns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                    >
                      {(item as any)[column.key] != null
                        ? String((item as any)[column.key])
                        : '—'}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      {onApprove && (
                        <button
                          onClick={() => onApprove(item)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Погодити"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {onReject && (
                        <button
                          onClick={() => onReject(item)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Відхилити"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
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
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded transition-colors"
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

      <div className="text-xs text-gray-500">
        Показано: {sortedData.length} із {data.length} записів
      </div>
    </div>
  );
}