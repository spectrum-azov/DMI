import {
    DateFilter,
    DATE_FILTER_LABELS,
    ALL_DATE_FILTERS,
} from '../utils/dateUtils';

interface QuickDateFilterProps {
    value: DateFilter;
    onChange: (filter: DateFilter) => void;
    className?: string;
}

export function QuickDateFilter({
    value,
    onChange,
    className = '',
}: QuickDateFilterProps) {
    return (
        <div
            className={`flex flex-wrap gap-1 bg-muted rounded-lg p-1 ${className}`}
        >
            {ALL_DATE_FILTERS.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all whitespace-nowrap ${value === filter
                        ? 'bg-card text-blue-600 shadow-sm dark:text-blue-400'
                        : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {DATE_FILTER_LABELS[filter]}
                </button>
            ))}
        </div>
    );
}
