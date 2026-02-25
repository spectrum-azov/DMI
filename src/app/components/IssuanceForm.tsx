import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { IssuanceRecord, Directories } from '../types';
import { SearchableSelect } from './SearchableSelect';

interface IssuanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<IssuanceRecord, 'id'>) => void;
  editData?: IssuanceRecord;
  directories: Directories;
}

export function IssuanceForm({ isOpen, onClose, onSubmit, editData, directories }: IssuanceFormProps) {
  const [formData, setFormData] = useState<Omit<IssuanceRecord, 'id'>>({
    nomenclature: 0,
    type: 0,
    quantity: 1,
    model: '',
    serialNumber: '',
    fullName: '',
    rank: 0,
    department: 0,
    request: '',
    requestNumber: '',
    issueDate: '',
    location: 0,
    status: 'На видачу',
    notes: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        nomenclature: editData.nomenclature,
        type: editData.type,
        quantity: editData.quantity,
        model: editData.model,
        serialNumber: editData.serialNumber,
        fullName: editData.fullName,
        rank: editData.rank,
        department: editData.department,
        request: editData.request,
        requestNumber: editData.requestNumber,
        issueDate: editData.issueDate,
        location: editData.location,
        status: editData.status,
        notes: editData.notes,
      });
    } else {
      setFormData({
        nomenclature: directories.nomenclatures[0]?.id || 0,
        type: directories.types[0]?.id || 0,
        quantity: 1,
        model: '',
        serialNumber: '',
        fullName: '',
        rank: directories.ranks[0]?.id || 0,
        department: directories.departments[0]?.id || 0,
        request: 'Так',
        requestNumber: '',
        issueDate: new Date().toLocaleDateString('uk-UA'),
        location: directories.locations[0]?.id || 0,
        status: 'На видачу',
        notes: '',
      });
    }
  }, [editData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">
            {editData ? 'Редагувати запис' : 'Новий запис видачі'}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableSelect
              label="Номенклатура"
              required
              options={directories.nomenclatures}
              value={formData.nomenclature}
              onChange={(val) => setFormData({ ...formData, nomenclature: val })}
            />

            <SearchableSelect
              label="Тип"
              required
              options={directories.types}
              value={formData.type}
              onChange={(val) => setFormData({ ...formData, type: val })}
            />

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Кількість
              </label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Модель
              </label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Серійний номер
              </label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                ПІБ *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <SearchableSelect
              label="Звання"
              required
              options={directories.ranks}
              value={formData.rank}
              onChange={(val) => setFormData({ ...formData, rank: val })}
            />

            <SearchableSelect
              label="Служба"
              required
              options={directories.departments}
              value={formData.department}
              onChange={(val) => setFormData({ ...formData, department: val })}
            />

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Заявка
              </label>
              <input
                type="text"
                value={formData.request}
                onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Номер заявки
              </label>
              <input
                type="text"
                value={formData.requestNumber}
                onChange={(e) => setFormData({ ...formData, requestNumber: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Дата видачі *
              </label>
              <input
                type="text"
                required
                placeholder="DD.MM.YYYY"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <SearchableSelect
              label="Локація"
              required
              options={directories.locations}
              value={formData.location}
              onChange={(val) => setFormData({ ...formData, location: val })}
            />

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Статус *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
              >
                <option value="">Оберіть статус</option>
                <option value="На видачу" className="bg-card">На видачу</option>
                <option value="Готується" className="bg-card">Готується</option>
                <option value="Готово" className="bg-card">Готово</option>
                <option value="На паузі" className="bg-card">На паузі</option>
                <option value="Повернули" className="bg-card">Повернули</option>
                <option value="Заміна" className="bg-card">Заміна</option>
                <option value="Відміна" className="bg-card">Відміна</option>
                <option value="Чекаєм на поставку" className="bg-card">Чекаєм на поставку</option>
                <option value="Видано" className="bg-card">Видано</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Примітки
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              Скасувати
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {editData ? 'Зберегти зміни' : 'Додати запис'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}