import {
    Edit2,
    Trash2,
    SendToBack,
    ChevronDown,
} from 'lucide-react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { IssuanceRecord, Directories } from '../types';
import { DateFilter } from '../utils/dateUtils';
import { TablePagination } from './TablePagination';
import { useDataTable } from '../hooks/useDataTable';
import { DataTableToolbar } from './DataTableToolbar';
import { DataTableCell } from './DataTableCell';

interface Column { key: string; label: string; width?: string; }

interface IssuanceDataTableProps {
    data: IssuanceRecord[];
    columns: Column[];
    onEdit?: (item: IssuanceRecord) => void;
    onDelete?: (id: number) => void;
    onIssue?: (id: number) => void;
    onRowClick?: (item: IssuanceRecord) => void;
    emptyMessage?: string;
    dateFilter: DateFilter;
    locationFilter: number;
    onStatusChange?: (id: number, newStatus: string) => void;
    onReturnToIssuance?: (item: IssuanceRecord) => void;
    directories?: Directories;
}

const ISSUANCE_STATUSES = ['Готується', 'Готово', 'На паузі', 'Чекаєм на поставку', 'Повернули', 'Заміна', 'Відміна', 'Видано'];
const DEFAULT_VISIBLE = ['id', 'nomenclature', 'quantity', 'fullName', 'rank', 'department', 'applicationStatus', 'status'];

export function IssuanceDataTable({
    data, columns, onEdit, onDelete, onIssue, onRowClick, emptyMessage = 'Немає даних',
    dateFilter, locationFilter, onStatusChange, onReturnToIssuance, directories,
}: IssuanceDataTableProps) {
    const [subTab, setSubTab] = useState<'pending' | 'issued' | 'cancelled'>('pending');
    const [openStatusId, setOpenStatusId] = useState<number | null>(null);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
                setOpenStatusId(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const activeDataForTab = useMemo(() => {
        if (subTab === 'issued') return data.filter((item) => item.status === 'Видано');
        if (subTab === 'cancelled') return data.filter((item) => item.status === 'Відміна');
        return data.filter((item) => item.status !== 'Видано' && item.status !== 'Відміна');
    }, [data, subTab]);

    const {
        searchTerm, setSearchTerm, sortColumn, sortDirection, handleSort,
        visibleColumns, toggleColumn, setVisibleColumns,
        currentPage, setCurrentPage, pageSize, setPageSize,
        paginatedData, totalItems,
    } = useDataTable({
        data: activeDataForTab, storageKey: 'issuance_visible_columns', defaultVisibleColumns: DEFAULT_VISIBLE,
        dateField: 'issueDate', dateFilter, locationFilter,
    });

    const activeColumns = columns.filter((col) => visibleColumns.has(col.key));

    return (
        <div className="flex flex-col gap-4">
            {/* Sub-tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex gap-2">
                    {['pending', 'issued', 'cancelled'].map((tab) => {
                        const label = tab === 'pending' ? 'На видачу' : tab === 'issued' ? 'Видано' : 'Відміна';
                        const colorClass = tab === 'pending' ? 'orange' : tab === 'issued' ? 'green' : 'red';
                        const count = data.filter(i => (tab === 'issued' ? i.status === 'Видано' : tab === 'cancelled' ? i.status === 'Відміна' : (i.status !== 'Видано' && i.status !== 'Відміна'))).length;
                        return (
                            <button
                                key={tab} onClick={() => setSubTab(tab as any)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${subTab === tab
                                    ? `bg-${colorClass}-50 border-${colorClass}-300 text-${colorClass}-700 shadow-sm dark:bg-${colorClass}-950/20 dark:border-${colorClass}-800 dark:text-${colorClass}-400`
                                    : 'bg-card border-input text-muted-foreground hover:bg-accent'}`}
                            >
                                <span className={`inline-flex items-center justify-center h-5 px-1.5 rounded-full text-[10px] font-bold ${subTab === tab ? `bg-${colorClass}-200 text-${colorClass}-800 dark:bg-${colorClass}-800 dark:text-${colorClass}-100` : 'bg-muted text-muted-foreground'}`}>
                                    {count}
                                </span>{label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <DataTableToolbar
                searchTerm={searchTerm} onSearchChange={setSearchTerm}
                columns={columns} visibleColumns={visibleColumns}
                onToggleColumn={toggleColumn} defaultVisibleColumns={DEFAULT_VISIBLE}
                onResetColumns={setVisibleColumns}
            />

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
                                    {searchTerm || dateFilter !== 'year' ? 'Нічого не знайдено' : emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((item) => (
                                <tr
                                    key={item.id} onClick={() => onRowClick && onRowClick(item as IssuanceRecord)}
                                    className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/10' : 'hover:bg-accent'}`}
                                >
                                    {activeColumns.map((column) => (
                                        <td key={column.key} className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                                            <DataTableCell columnKey={column.key} value={(item as any)[column.key]} item={item} directories={directories} />
                                        </td>
                                    ))}
                                    <td className="px-4 py-3 text-sm">
                                        <div className="flex gap-1">
                                            {subTab === 'pending' && onIssue && (
                                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                                    <button onClick={() => onIssue(item.id)} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors" title="Видати">
                                                        <SendToBack size={13} />Видати
                                                    </button>
                                                    {onStatusChange && (
                                                        <div className="relative" ref={openStatusId === item.id ? statusDropdownRef : null}>
                                                            <button onClick={() => setOpenStatusId(openStatusId === item.id ? null : item.id)} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors border border-blue-200 dark:border-blue-800" title="Змінити статус">
                                                                Статус<ChevronDown size={13} />
                                                            </button>
                                                            {openStatusId === item.id && (
                                                                <div className="absolute right-0 top-full mt-1 z-30 bg-card border border-border rounded-lg shadow-xl py-1 min-w-[160px]">
                                                                    {ISSUANCE_STATUSES.map((status) => (
                                                                        <button key={status} onClick={() => { onStatusChange(item.id, status); setOpenStatusId(null); }} className={`w-full text-left px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground transition-colors ${item.status === status ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 font-medium' : 'text-foreground'}`}>
                                                                            {status}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {subTab === 'cancelled' && onReturnToIssuance && (
                                                <button onClick={(e) => { e.stopPropagation(); onReturnToIssuance(item as IssuanceRecord); }} className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors" title="На видачу">
                                                    <SendToBack size={13} />На видачу
                                                </button>
                                            )}
                                            {onEdit && (
                                                <button onClick={(e) => { e.stopPropagation(); onEdit(item as IssuanceRecord); }} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors" title="Редагувати">
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
            <TablePagination totalItems={totalItems} pageSize={pageSize} currentPage={currentPage} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
        </div>
    );
}
