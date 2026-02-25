import { Edit2, Trash2, Search, SendToBack } from 'lucide-react';
import { useState } from 'react';
import { IssuanceRecord } from '../types';
import { QuickDateFilter } from './QuickDateFilter';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';

interface Column {
    key: string;
    label: string;
    width?: string;
}

interface IssuanceDataTableProps {
    data: IssuanceRecord[];
    columns: Column[];
    onEdit?: (item: IssuanceRecord) => void;
    onDelete?: (id: string) => void;
    /** Called when user clicks "Видати" on a pending item */
    onIssue?: (id: string) => void;
    emptyMessage?: string;
}

export function IssuanceDataTable({
    data,
    columns,
    onEdit,
    onDelete,
    onIssue,
    emptyMessage = 'Немає даних',
}: IssuanceDataTableProps) {
    const [subTab, setSubTab] = useState<'pending' | 'issued'>('pending');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [dateFilter, setDateFilter] = useState<DateFilter>('month');

    const pendingData = data.filter((item) => item.status === 'На видачу');
    const issuedData = data.filter((item) => item.status === 'Видано');
    const activeData = subTab === 'pending' ? pendingData : issuedData;

    const dateFiltered = activeData.filter((item) =>
        isWithinPeriod(item.issueDate, dateFilter),
    );

    const searchFiltered = dateFiltered.filter((item) => {
        const lower = searchTerm.toLowerCase();
        return Object.values(item).some((v) =>
            String(v).toLowerCase().includes(lower),
        );
    });

    const sortedData = [...searchFiltered].sort((a, b) => {
        if (!sortColumn) return 0;
        const aVal = (a as Record<string, unknown>)[sortColumn];
        const bVal = (b as Record<string, unknown>)[sortColumn];
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
            {/* Sub-tabs */}
            <div className="flex gap-2">
                <button
                    onClick={() => setSubTab('pending')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${subTab === 'pending'
                            ? 'bg-orange-50 border-orange-300 text-orange-700 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${subTab === 'pending'
                                ? 'bg-orange-200 text-orange-800'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        {pendingData.length}
                    </span>
                    На видачу
                </button>

                <button
                    onClick={() => setSubTab('issued')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${subTab === 'issued'
                            ? 'bg-green-50 border-green-300 text-green-700 shadow-sm'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <span
                        className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold ${subTab === 'issued'
                                ? 'bg-green-200 text-green-800'
                                : 'bg-gray-200 text-gray-600'
                            }`}
                    >
                        {issuedData.length}
                    </span>
                    Видано
                </button>
            </div>

            {/* Quick date filter */}
            <QuickDateFilter value={dateFilter} onChange={setDateFilter} />

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
                            {columns.map((column) => (
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
                            {(onEdit || onDelete || (onIssue && subTab === 'pending')) && (
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 whitespace-nowrap">
                                    Дії
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {sortedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={
                                        columns.length +
                                        (onEdit || onDelete || onIssue ? 1 : 0)
                                    }
                                    className="px-4 py-8 text-center text-gray-500 text-sm"
                                >
                                    {searchTerm
                                        ? 'Нічого не знайдено'
                                        : subTab === 'pending'
                                            ? 'Немає записів "На видачу"'
                                            : 'Немає виданих записів'}
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                                        >
                                            {column.key === 'status' ? (
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'На видачу'
                                                            ? 'bg-orange-100 text-orange-700'
                                                            : 'bg-green-100 text-green-700'
                                                        }`}
                                                >
                                                    {item.status}
                                                </span>
                                            ) : (
                                                ((item as Record<string, unknown>)[column.key] ?? '—') as string
                                            )}
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || (onIssue && subTab === 'pending')) && (
                                        <td className="px-4 py-3 text-sm">
                                            <div className="flex gap-1">
                                                {onIssue && subTab === 'pending' && (
                                                    <button
                                                        onClick={() => onIssue(item.id)}
                                                        className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors"
                                                        title="Видати"
                                                    >
                                                        <SendToBack size={13} />
                                                        Видати
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
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-xs text-gray-500">
                Показано: {sortedData.length} із {activeData.length}{' '}
                {subTab === 'pending' ? '(на видачу)' : '(видано)'}
            </div>
        </div>
    );
}
