
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { DirectoryItem } from '../types';

interface DirectoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<DirectoryItem, 'id'>) => void;
    editData?: DirectoryItem;
    title: string;
}

export function DirectoryForm({
    isOpen,
    onClose,
    onSubmit,
    editData,
    title,
}: DirectoryFormProps) {
    const [formData, setFormData] = useState<Omit<DirectoryItem, 'id'>>({
        name: '',
    });

    useEffect(() => {
        if (editData) {
            setFormData({
                name: editData.name,
            });
        } else {
            setFormData({
                name: '',
            });
        }
    }, [editData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
                    <h2 className="text-xl font-bold text-foreground">
                        {editData ? 'Редагувати запис' : 'Додати новий запис'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Назва ({title})
                        </label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                            placeholder="Введіть назву..."
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-input text-foreground bg-card hover:bg-muted rounded-lg font-medium transition-colors"
                        >
                            Скасувати
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium shadow-sm transition-colors"
                        >
                            {editData ? 'Зберегти' : 'Додати'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
