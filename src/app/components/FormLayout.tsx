import { X } from 'lucide-react';

interface FormLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    onSubmit: (e: React.FormEvent) => void;
    children: React.ReactNode;
    submitLabel: string;
}

export function FormLayout({ isOpen, onClose, title, onSubmit, children, submitLabel }: FormLayoutProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">{title}</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {children}
                    </div>

                    <div className="flex gap-3 justify-end pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 text-sm font-semibold text-muted-foreground bg-muted hover:bg-muted/80 rounded-xl transition-all"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"
                        >
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
