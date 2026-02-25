import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { RejectedRecord, Directories } from '../types';
import { SearchableSelect } from './SearchableSelect';

interface RejectedFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<RejectedRecord, 'id'>) => void;
  editData?: RejectedRecord;
  directories: Directories;
}

export function RejectedForm({
  isOpen,
  onClose,
  onSubmit,
  editData,
  directories,
}: RejectedFormProps) {
  const [formData, setFormData] = useState<Omit<RejectedRecord, 'id'>>({
    nomenclature: 0,
    type: 0,
    quantity: 1,
    fullName: '',
    rank: 0,
    position: '',
    department: 0,
    mobileNumber: '',
    status: 'Відхилено',
    notes: '',
    location: 0,
    rejectedDate: new Date().toLocaleDateString('uk-UA'),
    isFrtCp: true,
    frpFullName: '',
    frpRank: 0,
    frpPosition: '',
    frpMobileNumber: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        nomenclature: editData.nomenclature,
        type: editData.type,
        quantity: editData.quantity,
        fullName: editData.fullName,
        rank: editData.rank,
        position: editData.position || 'Не вказано',
        department: editData.department,
        mobileNumber: editData.mobileNumber,
        status: editData.status,
        notes: editData.notes,
        location: editData.location,
        rejectedDate: editData.rejectedDate || '',
        isFrtCp: editData.isFrtCp ?? true,
        frpFullName: editData.frpFullName || '',
        frpRank: editData.frpRank || 0,
        frpPosition: editData.frpPosition || '',
        frpMobileNumber: editData.frpMobileNumber || '',
      });
    } else {
      setFormData({
        nomenclature: directories.nomenclatures[0]?.id || 0,
        type: directories.types[0]?.id || 0,
        quantity: 1,
        fullName: '',
        rank: directories.ranks[0]?.id || 0,
        position: '',
        department: directories.departments[0]?.id || 0,
        mobileNumber: '',
        status: 'Відхилено',
        notes: '',
        location: directories.locations[0]?.id || 0,
        rejectedDate: new Date().toLocaleDateString('uk-UA'),
        isFrtCp: true,
        frpFullName: '',
        frpRank: directories.ranks[0]?.id || 0,
        frpPosition: '',
        frpMobileNumber: '',
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
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-semibold text-foreground">
            {editData ? 'Редагувати відхилений запит' : 'Новий відхилений запит'}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
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
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantity: parseInt(e.target.value) || 1,
                  })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
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

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Посада *
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

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
                onChange={(e) =>
                  setFormData({ ...formData, mobileNumber: e.target.value })
                }
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Статус *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
              >
                <option value="">Оберіть статус</option>
                <option value="Відхилено" className="bg-card">Відхилено</option>
              </select>
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
                Дата відхилення *
              </label>
              <input
                type="text"
                required
                placeholder="DD.MM.YYYY"
                value={formData.rejectedDate}
                onChange={(e) =>
                  setFormData({ ...formData, rejectedDate: e.target.value })
                }
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Примітки *
              </label>
              <textarea
                required
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                placeholder="Причина відхилення..."
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
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
                  Матеріально відповідальна особа спропадає з отримувачем
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

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Посада МВО *
                    </label>
                    <input
                      type="text"
                      required={!formData.isFrtCp}
                      value={formData.frpPosition}
                      onChange={(e) => setFormData({ ...formData, frpPosition: e.target.value })}
                      className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

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
