import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

interface MoveDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (notes: string) => void;
    title: string;
    description: string;
    itemName: string;
    initialNotes?: string;
}

export function MoveDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    itemName,
    initialNotes = '',
}: MoveDialogProps) {
    const [notes, setNotes] = useState(initialNotes);

    useEffect(() => {
        if (isOpen) {
            setNotes(initialNotes);
        }
    }, [isOpen, initialNotes]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">
                            {description} для:
                        </p>
                        <p className="font-semibold text-foreground bg-muted p-2 rounded-lg border border-border">
                            {itemName}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Додати примітку (необов'язково)
                        </label>
                        <textarea
                            autoFocus
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full h-24 p-3 bg-card border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground text-sm resize-none"
                            placeholder="Вкажіть причину переносу або додаткові деталі..."
                        />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 p-4 bg-muted/30 border-t border-border">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        Скасувати
                    </button>
                    <button
                        onClick={() => onConfirm(notes)}
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
                    >
                        <Check size={18} />
                        Підтвердити
                    </button>
                </div>
            </div>
        </div>
    );
}
