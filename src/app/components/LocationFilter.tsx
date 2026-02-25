import { SearchableSelect } from './SearchableSelect';
import { DirectoryItem } from '../types';
import { MapPin } from 'lucide-react';

interface LocationFilterProps {
    value: number;
    options: DirectoryItem[];
    onChange: (value: number) => void;
    className?: string;
}

export function LocationFilter({
    value,
    options,
    onChange,
    className = '',
}: LocationFilterProps) {
    const allOptions = [
        { id: 0, name: 'Всі локації' },
        ...options
    ];

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="flex-shrink-0 p-2 bg-muted rounded-lg text-muted-foreground">
                <MapPin size={20} />
            </div>
            <div className="w-64">
                <SearchableSelect
                    options={allOptions}
                    value={value}
                    onChange={onChange}
                    placeholder="Оберіть локацію..."
                />
            </div>
        </div>
    );
}
