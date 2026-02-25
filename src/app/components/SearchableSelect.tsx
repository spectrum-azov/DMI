import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface Option {
    id: number;
    name: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: number;
    onChange: (value: number) => void;
    placeholder?: string;
    label?: string;
    required?: boolean;
    labelClassName?: string;
}

export function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Оберіть значення...',
    label,
    required = false,
    labelClassName
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    const filteredOptions = options.filter(opt =>
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
        if (!isOpen) {
            setSearchTerm('');
        }
    }, [isOpen]);

    return (
        <div className="relative" ref={containerRef}>
            {label && (
                <label className={labelClassName || "block text-sm font-medium text-muted-foreground mb-1"}>
                    {label} {required && '*'}
                </label>
            )}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between w-full px-3 py-2 bg-card border rounded-lg cursor-pointer transition-all ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-input hover:border-muted-foreground/30'
                    }`}
            >
                <span className={`truncate ${!selectedOption ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                    {selectedOption ? selectedOption.name : placeholder}
                </span>
                <ChevronDown size={18} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute z-[60] w-full mt-1 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-2 border-b border-border bg-muted/30">
                        <div className="relative">
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                className="w-full pl-8 pr-8 py-1.5 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-muted-foreground/50"
                                placeholder="Пошук..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                            />
                            {searchTerm && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchTerm('');
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <div
                                    key={option.id}
                                    className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${option.id === value
                                        ? 'bg-blue-500/10 text-blue-500'
                                        : 'hover:bg-muted text-foreground'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(option.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="text-sm font-medium">{option.name}</span>
                                    {option.id === value && <Check size={14} />}
                                </div>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-muted-foreground italic">
                                Нічого не знайдено
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
