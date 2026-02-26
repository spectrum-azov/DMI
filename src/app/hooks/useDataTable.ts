import { useState, useMemo, useEffect } from 'react';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';

interface UseDataTableProps<T> {
    data: T[];
    storageKey?: string;
    defaultVisibleColumns?: string[];
    dateField?: string;
    dateFilter: DateFilter;
    locationFilter: number;
}

export function useDataTable<T extends Record<string, any>>({
    data,
    storageKey,
    defaultVisibleColumns,
    dateField,
    dateFilter,
    locationFilter,
}: UseDataTableProps<T>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(() => {
        if (storageKey) {
            const saved = localStorage.getItem(storageKey);
            if (saved) return new Set(JSON.parse(saved));
        }
        return new Set(defaultVisibleColumns || []);
    });

    useEffect(() => {
        if (storageKey) {
            localStorage.setItem(storageKey, JSON.stringify(Array.from(visibleColumns)));
        }
    }, [visibleColumns, storageKey]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, dateFilter, locationFilter]);

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

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const isDateMatch = !dateField || isWithinPeriod(item[dateField], dateFilter);
            const isLocMatch = locationFilter === 0 || item.location === locationFilter;

            if (!isDateMatch || !isLocMatch) return false;

            if (!searchTerm) return true;
            const lowerSearch = searchTerm.toLowerCase();
            return Object.values(item).some((v) =>
                String(v).toLowerCase().includes(lowerSearch)
            );
        });
    }, [data, dateField, dateFilter, locationFilter, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];
            if (aVal === bVal) return 0;
            const cmp = aVal < bVal ? -1 : 1;
            return sortDirection === 'asc' ? cmp : -cmp;
        });
    }, [filteredData, sortColumn, sortDirection]);

    const handleSort = (key: string) => {
        if (sortColumn === key) {
            setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortColumn(key);
            setSortDirection('asc');
        }
    };

    const totalItems = sortedData.length;
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

    return {
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
    };
}
