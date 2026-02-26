import { useState, useEffect } from 'react';
import { IssuanceRecord, Directories } from '../types';
import { SearchableSelect } from './SearchableSelect';
import { FormLayout } from './FormLayout';
import { MVOFields } from './MVOFields';

interface IssuanceFormProps {
  isOpen: boolean; onClose: () => void; onSubmit: (data: Omit<IssuanceRecord, 'id'>) => void;
  editData?: IssuanceRecord; directories: Directories;
}

export function IssuanceForm({ isOpen, onClose, onSubmit, editData, directories }: IssuanceFormProps) {
  const [formData, setFormData] = useState<Omit<IssuanceRecord, 'id'>>({
    nomenclature: 0, type: 0, quantity: 1, model: '', serialNumber: '',
    fullName: '', rank: 0, position: '', department: 0, mobileNumber: '',
    applicationStatus: 'В процесі', requestNumber: '', issueDate: '',
    location: 0, status: 'На видачу', notes: '', isFrtCp: true,
    frpFullName: '', frpRank: 0, frpPosition: '', frpMobileNumber: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData, isFrtCp: editData.isFrtCp ?? true });
    } else {
      setFormData({
        nomenclature: directories.nomenclatures[0]?.id || 0, type: directories.types[0]?.id || 0,
        quantity: 1, model: '', serialNumber: '', fullName: '', rank: directories.ranks[0]?.id || 0,
        position: '', department: directories.departments[0]?.id || 0, mobileNumber: '',
        applicationStatus: 'В процесі', requestNumber: '', issueDate: new Date().toLocaleDateString('uk-UA'),
        location: directories.locations[0]?.id || 0, status: 'На видачу', notes: '', isFrtCp: true,
        frpFullName: '', frpRank: directories.ranks[0]?.id || 0, frpPosition: '', frpMobileNumber: '',
      });
    }
  }, [editData, isOpen, directories]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); onClose(); };

  return (
    <FormLayout
      isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}
      title={editData ? 'Редагувати запис' : 'Новий запис видачі'}
      submitLabel={editData ? 'Зберегти зміни' : 'Додати запис'}
    >
      <SearchableSelect label="Номенклатура" required options={directories.nomenclatures} value={formData.nomenclature} onChange={(val) => setFormData({ ...formData, nomenclature: val })} />
      <SearchableSelect label="Тип" required options={directories.types} value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} />

      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Кількість</label>
        <input type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Модель</label>
        <input type="text" value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Серійний номер</label>
        <input type="text" value={formData.serialNumber} onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">ПІБ *</label>
        <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <SearchableSelect label="Звання" required options={directories.ranks} value={formData.rank} onChange={(val) => setFormData({ ...formData, rank: val })} />
      <SearchableSelect label="Служба" required options={directories.departments} value={formData.department} onChange={(val) => setFormData({ ...formData, department: val })} />

      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Посада *</label>
        <input type="text" required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Статус заявки</label>
        <select value={formData.applicationStatus} onChange={(e) => setFormData({ ...formData, applicationStatus: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground">
          <option value="готово">готово</option><option value="в процесі">в процесі</option><option value="не готово">не готово</option>
        </select>
      </div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Номер заявки</label>
        <input type="text" value={formData.requestNumber} onChange={(e) => setFormData({ ...formData, requestNumber: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Дата видачі *</label>
        <input type="text" required placeholder="DD.MM.YYYY" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <SearchableSelect label="Локація" required options={directories.locations} value={formData.location} onChange={(val) => setFormData({ ...formData, location: val })} />

      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Статус *</label>
        <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground">
          <option value="">Оберіть статус</option>
          {['На видачу', 'Готується', 'Готово', 'На паузі', 'Повернули', 'Заміна', 'Відміна', 'Чекаєм на поставку', 'Видано'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-muted-foreground mb-1">Примітки</label>
        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <MVOFields isFrtCp={formData.isFrtCp} setIsFrtCp={(v) => setFormData({ ...formData, isFrtCp: v })} data={formData} onChange={(f, v) => setFormData({ ...formData, [f]: v })} directories={directories} />
    </FormLayout>
  );
}