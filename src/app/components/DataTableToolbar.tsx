import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface Column {
    key: string;
    label: string;
}

interface DataTableToolbarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    columns: Column[];
    visibleColumns: Set<string>;
    onToggleColumn: (key: string) => void;
    defaultVisibleColumns?: string[];
    onResetColumns?: (columns: Set<string>) => void;
    children?: React.ReactNode;
}

export function DataTableToolbar({
    searchTerm,
    onSearchChange,
    columns,
    visibleColumns,
    onToggleColumn,
    defaultVisibleColumns,
    onResetColumns,
    children,
}: DataTableToolbarProps) {
    const [isColumnsOpen, setIsColumnsOpen] = useState(false);
    const columnsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (columnsRef.current && !columnsRef.current.contains(e.target as Node)) {
                setIsColumnsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input
                    type="text"
                    placeholder="Пошук..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-foreground"
                />
            </div>

            {children}

            <div className="relative" ref={columnsRef}>
                <button
                    onClick={() => setIsColumnsOpen(!isColumnsOpen)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${isColumnsOpen
                            ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400'
                            : 'bg-card border-input text-foreground hover:bg-accent'
                        }`}
                >
                    <SlidersHorizontal size={16} />
                    <span className="hidden sm:inline">Колонки</span>
                </button>

                {isColumnsOpen && (
                    <div className="absolute right-0 top-full mt-1 z-20 bg-card border border-border rounded-xl shadow-lg p-3 min-w-[210px]">
                        <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
                            <span className="text-sm font-semibold text-foreground">Видимі колонки</span>
                            <button onClick={() => setIsColumnsOpen(false)} className="p-0.5 text-gray-400 hover:text-gray-600 rounded">
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
                                        onChange={() => onToggleColumn(col.key)}
                                        className="accent-blue-600 w-4 h-4 rounded"
                                    />
                                    {col.label}
                                </label>
                            ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-border flex gap-2">
                            <button onClick={() => onResetColumns?.(new Set(columns.map(c => c.key)))} className="text-xs text-blue-600 hover:underline">
                                Всі
                            </button>
                            <button onClick={() => onResetColumns?.(new Set(defaultVisibleColumns || []))} className="text-xs text-muted-foreground hover:underline">
                                За замовч.
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
