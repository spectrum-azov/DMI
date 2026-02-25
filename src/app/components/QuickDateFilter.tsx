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
            className={`flex flex-wrap gap-1 bg-gray-100 rounded-lg p-1 ${className}`}
        >
            {ALL_DATE_FILTERS.map((filter) => (
                <button
                    key={filter}
                    onClick={() => onChange(filter)}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-all whitespace-nowrap ${value === filter
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-900'
                        }`}
                >
                    {DATE_FILTER_LABELS[filter]}
                </button>
            ))}
        </div>
    );
}
