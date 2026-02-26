import { Directories } from '../types';

interface DataTableCellProps {
    columnKey: string;
    value: any;
    item: any;
    directories?: Directories;
}

export function DataTableCell({ columnKey, value, item, directories }: DataTableCellProps) {
    if (value === undefined || value === null || value === '') return '—';

    const getDirName = (list: any[] | undefined, id: any) => {
        const found = list?.find(d => String(d.id) === String(id));
        return found ? found.name : undefined;
    };

    if (columnKey === 'nomenclature') return getDirName(directories?.nomenclatures, value) ?? value;
    if (columnKey === 'type') return getDirName(directories?.types, value) ?? value;
    if (columnKey === 'rank') return getDirName(directories?.ranks, value) ?? value;
    if (columnKey === 'department') return getDirName(directories?.departments, value) ?? value;
    if (columnKey === 'location') return getDirName(directories?.locations, value) ?? value;
    if (columnKey === 'position') return getDirName(directories?.positions, value) ?? value;

    if (columnKey === 'status') {
        const statusClasses: Record<string, string> = {
            'Видано': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'Готово': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
            'На паузі': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
            'Повернули': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'Відміна': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'Чекаєм на поставку': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
            'Заміна': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
            'default': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
        };
        const cls = statusClasses[value as string] || statusClasses['default'];
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
                {value}
            </span>
        );
    }

    if (columnKey === 'applicationStatus') {
        const applicationStatusClasses: Record<string, string> = {
            'готово': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
            'не готово': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            'default': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
        };
        const cls = applicationStatusClasses[value as string] || applicationStatusClasses['default'];
        return (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cls}`}>
                {value}
            </span>
        );
    }

    return String(value);
}
