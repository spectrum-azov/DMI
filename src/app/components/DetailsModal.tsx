import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface DetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    data: any;
    columns: { key: string; label: string }[];
}

export function DetailsModal({
    isOpen,
    onClose,
    title,
    data,
    columns,
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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {columns.map((col) => (
                            <div
                                key={col.key}
                                className="group p-3 rounded-xl border border-transparent hover:border-blue-100 hover:bg-blue-50/30 transition-all"
                            >
                                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                                    {col.label}
                                </div>
                                <div className="text-gray-900 font-medium break-words">
                                    {data[col.key] || <span className="text-gray-300 italic">Не вказано</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                    >
                        Закрити
                    </button>
                </div>
            </div>
        </div>
    );
}
