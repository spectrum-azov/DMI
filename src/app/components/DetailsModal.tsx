import {
    X,
    User,
    Phone,
    Building2,
    MapPin,
    Calendar,
    Hash,
    Tag,
    FileText,
    Info,
    Clock,
    LayoutDashboard,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Directories } from '../types';

interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any;
    columns: { key: string; label: string }[];
    directories?: Directories;
}

export function DetailsModal({
    isOpen,
    onClose,
    title,
    data,
    columns,
    directories,
}: DetailsModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !data) return null;

    // Helper to map keys to icons
    const getIcon = (key: string) => {
        const k = key.toLowerCase();
        if (k.includes('name') || k.includes('person') || k.includes('rank')) return <User size={14} />;
        if (k.includes('mobile') || k.includes('phone')) return <Phone size={14} />;
        if (k.includes('department') || k.includes('service')) return <Building2 size={14} />;
        if (k.includes('location')) return <MapPin size={14} />;
        if (k.includes('date')) return <Calendar size={14} />;
        if (k.includes('quantity') || k.includes('number')) return <Hash size={14} />;
        if (k.includes('type')) return <Tag size={14} />;
        if (k.includes('status')) return <Info size={14} />;
        if (k.includes('notes') || k.includes('request')) return <FileText size={14} />;
        if (k.includes('time')) return <Clock size={14} />;
        return <LayoutDashboard size={14} />;
    };

    // Helper for status badge styling
    const getStatusStyles = (status: string) => {
        const s = String(status || '').toLowerCase();
        if (s.includes('погоджено') || s.includes('видано')) return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50';
        if (s.includes('відхилено')) return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50';
        if (s.includes('чекає') || s.includes('на видачу')) return 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/50';
        return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50';
    };

    const mainFields = ['nomenclature', 'status', 'notes'];
    const gridFields = columns.filter(col => !mainFields.includes(col.key));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="bg-card rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="px-8 pt-8 flex items-start justify-between">
                    <div className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-[0.1em] border ${getStatusStyles(data.status)}`}>
                        {data.status || 'Новий'}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Section */}
                <div className="px-8 pb-8 pt-2">
                    {/* Main Title Row */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-black text-foreground leading-tight mb-2 tracking-tight">
                            {directories?.nomenclatures.find(d => d.id === data.nomenclature)?.name || data.nomenclature || 'Без назви'}
                        </h2>
                        <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-2xl border border-border">
                            <FileText size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-muted-foreground font-medium text-sm leading-relaxed">
                                {data.notes || 'Немає додаткових приміток'}
                            </p>
                        </div>
                    </div>

                    {/* Grid Rows - 2 columns, very compact */}
                    <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                        {gridFields.map((col) => (
                            <div key={col.key} className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                    <span className="shrink-0 opacity-70">{getIcon(col.key)}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest">
                                        {col.label}
                                    </span>
                                </div>
                                <div className="text-foreground font-bold text-[13px] leading-tight break-words">
                                    {(() => {
                                        const val = data[col.key];
                                        if (val === undefined || val === null || val === '') return <span className="text-muted-foreground/50 font-normal italic">—</span>;

                                        // Lookup function for directory items
                                        const getDirName = (list: any[] | undefined, id: any) => {
                                            const found = list?.find(d => String(d.id) === String(id));
                                            return found ? found.name : undefined;
                                        };

                                        if (col.key === 'nomenclature') return getDirName(directories?.nomenclatures, val) ?? val;
                                        if (col.key === 'type') return getDirName(directories?.types, val) ?? val;
                                        if (col.key === 'rank' || col.key === 'frpRank') return getDirName(directories?.ranks, val) ?? val;
                                        if (col.key === 'department') return getDirName(directories?.departments, val) ?? val;
                                        if (col.key === 'location') return getDirName(directories?.locations, val) ?? val;
                                        if (col.key === 'position') return getDirName(directories?.positions, val) ?? val;

                                        if (col.key === 'isFrtCp') return val ? 'Так' : 'Ні';

                                        return String(val);
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button - Insets in the bottom right */}
                <div className="px-8 pb-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-primary text-primary-foreground text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all shadow-xl dark:shadow-none active:scale-95"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
}
