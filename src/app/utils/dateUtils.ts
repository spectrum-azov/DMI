export type DateFilter = 'day' | 'week' | 'month' | 'quarter' | 'year';

export const DATE_FILTER_LABELS: Record<DateFilter, string> = {
    day: 'День',
    week: 'Тиждень',
    month: 'Місяць',
    quarter: 'Квартал',
    year: 'Рік',
};

export const ALL_DATE_FILTERS: DateFilter[] = [
    'day',
    'week',
    'month',
    'quarter',
    'year',
];

/** Parse Ukrainian date format dd.MM.yyyy → Date */
export function parseUkrDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return null;
    const [day, month, year] = parts.map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month - 1, day);
}

/** Returns the earliest date that still matches the given filter from today */
export function getFilterStartDate(filter: DateFilter): Date {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
        case 'day':
            return today;
        case 'week': {
            const d = new Date(today);
            d.setDate(d.getDate() - 7);
            return d;
        }
        case 'month': {
            const d = new Date(today);
            d.setDate(d.getDate() - 30);
            return d;
        }
        case 'quarter': {
            const d = new Date(today);
            d.setDate(d.getDate() - 90);
            return d;
        }
        case 'year': {
            const d = new Date(today);
            d.setFullYear(d.getFullYear() - 1);
            return d;
        }
    }
}

/** Returns true if the given Ukrainian date string falls within the filter period */
export function isWithinPeriod(
    dateStr: string,
    filter: DateFilter,
): boolean {
    const date = parseUkrDate(dateStr);
    if (!date) return false;
    return date >= getFilterStartDate(filter);
}
