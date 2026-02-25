import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NeedRecord, Directories } from '../types';
import { formatUkrDate, formatISOToUkr, formatUkrToISO } from '../utils/dateUtils';
import { SearchableSelect } from './SearchableSelect';

interface NeedFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<NeedRecord, 'id'>) => void;
  editData?: NeedRecord;
  directories: Directories;
}

export function NeedForm({ isOpen, onClose, onSubmit, editData, directories }: NeedFormProps) {
  const [formData, setFormData] = useState<Omit<NeedRecord, 'id'>>({
    nomenclature: 0,
    type: 0,
    quantity: 1,
    fullName: '',
    rank: 0,
    position: 0,
    department: 0,
    mobileNumber: '',
    isFrtCp: true,
    frpFullName: '',
    frpRank: 0,
    frpPosition: 0,
    frpMobileNumber: '',
    requestDate: formatUkrDate(new Date()),
    location: 0,
    status: 'На погодженні',
    notes: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        nomenclature: editData.nomenclature,
        type: editData.type,
        quantity: editData.quantity,
        fullName: editData.fullName,
        rank: editData.rank,
        position: typeof editData.position === 'number' ? editData.position : 0,
        department: editData.department,
        mobileNumber: editData.mobileNumber,
        isFrtCp: editData.isFrtCp ?? true,
        frpFullName: editData.frpFullName || '',
        frpRank: editData.frpRank || 0,
        frpPosition: typeof editData.frpPosition === 'number' ? editData.frpPosition : 0,
        frpMobileNumber: editData.frpMobileNumber || '',
        requestDate: editData.requestDate,
        location: editData.location,
        status: editData.status,
        notes: editData.notes,
      });
    } else {
      setFormData({
        nomenclature: directories.nomenclatures[0]?.id || 0,
        type: directories.types[0]?.id || 0,
        quantity: 1,
        fullName: '',
        rank: directories.ranks[0]?.id || 0,
        position: directories.positions[0]?.id || 0,
        department: directories.departments[0]?.id || 0,
        mobileNumber: '',
        isFrtCp: true,
        frpFullName: '',
        frpRank: directories.ranks[0]?.id || 0,
        frpPosition: directories.positions[0]?.id || 0,
        frpMobileNumber: '',
        requestDate: formatUkrDate(new Date()),
        location: directories.locations[0]?.id || 0,
        status: 'На погодженні',
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
            {editData ? 'Редагувати запит' : 'Новий запит на потребу'}
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
                Кількість *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Контактна особа *
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
              label="Посада *"
              required
              options={directories.positions}
              value={formData.position}
              onChange={(val) => setFormData({ ...formData, position: val })}
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
                Моб. номер
              </label>
              <input
                type="tel"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Дата запиту *
              </label>
              <input
                type="date"
                required
                value={formatUkrToISO(formData.requestDate || '')}
                onChange={(e) => setFormData({ ...formData, requestDate: formatISOToUkr(e.target.value) })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
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
                Статус
              </label>
              <input
                type="text"
                disabled
                value={formData.status}
                className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2 border-t border-border pt-4 mt-2">
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  id="isFrtCp"
                  checked={formData.isFrtCp}
                  onChange={(e) => setFormData({ ...formData, isFrtCp: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded border-input focus:ring-blue-500"
                />
                <label htmlFor="isFrtCp" className="text-sm font-medium text-foreground">
                  Матеріально відповідальна особа спропадає з контактною особою
                </label>
              </div>

              {!formData.isFrtCp && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-semibold text-foreground mb-2">
                      Дані матеріально відповідальної особи
                    </h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      ПІБ МВО *
                    </label>
                    <input
                      type="text"
                      required={!formData.isFrtCp}
                      value={formData.frpFullName}
                      onChange={(e) => setFormData({ ...formData, frpFullName: e.target.value })}
                      className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <SearchableSelect
                    label="Звання МВО"
                    required={!formData.isFrtCp}
                    options={directories.ranks}
                    value={formData.frpRank || 0}
                    onChange={(val) => setFormData({ ...formData, frpRank: val })}
                  />

                  <SearchableSelect
                    label="Посада МВО *"
                    required={!formData.isFrtCp}
                    options={directories.positions}
                    value={formData.frpPosition || 0}
                    onChange={(val) => setFormData({ ...formData, frpPosition: val })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Моб. номер МВО *
                    </label>
                    <input
                      type="tel"
                      required={!formData.isFrtCp}
                      value={formData.frpMobileNumber}
                      onChange={(e) => setFormData({ ...formData, frpMobileNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Примітка
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
              {editData ? 'Зберегти зміни' : 'Додати запит'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
