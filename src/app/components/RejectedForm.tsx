import { useState, useEffect } from 'react';
import { RejectedRecord, Directories } from '../types';
import { SearchableSelect } from './SearchableSelect';
import { FormLayout } from './FormLayout';
import { MVOFields } from './MVOFields';

interface RejectedFormProps {
  isOpen: boolean; onClose: () => void; onSubmit: (data: Omit<RejectedRecord, 'id'>) => void;
  editData?: RejectedRecord; directories: Directories;
}

export function RejectedForm({ isOpen, onClose, onSubmit, editData, directories }: RejectedFormProps) {
  const [formData, setFormData] = useState<Omit<RejectedRecord, 'id'>>({
    nomenclature: 0, type: 0, quantity: 1, fullName: '', rank: 0, position: '',
    department: 0, mobileNumber: '', status: 'Відхилено', notes: '', location: 0,
    rejectedDate: '', isFrtCp: true, frpFullName: '', frpRank: 0, frpPosition: '', frpMobileNumber: '',
  });

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData, isFrtCp: editData.isFrtCp ?? true });
    } else {
      setFormData({
        nomenclature: directories.nomenclatures[0]?.id || 0, type: directories.types[0]?.id || 0,
        quantity: 1, fullName: '', rank: directories.ranks[0]?.id || 0, position: '',
        department: directories.departments[0]?.id || 0, mobileNumber: '', status: 'Відхилено',
        notes: '', location: directories.locations[0]?.id || 0,
        rejectedDate: new Date().toLocaleDateString('uk-UA'), isFrtCp: true,
        frpFullName: '', frpRank: directories.ranks[0]?.id || 0, frpPosition: '', frpMobileNumber: '',
      });
    }
  }, [editData, isOpen, directories]);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(formData); onClose(); };

  return (
    <FormLayout
      isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}
      title={editData ? 'Редагувати відхилений запит' : 'Новий відхилений запит'}
      submitLabel={editData ? 'Зберегти зміни' : 'Додати запис'}
    >
      <SearchableSelect label="Номенклатура" required options={directories.nomenclatures} value={formData.nomenclature} onChange={(val) => setFormData({ ...formData, nomenclature: val })} />
      <SearchableSelect label="Тип" required options={directories.types} value={formData.type} onChange={(val) => setFormData({ ...formData, type: val })} />

      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Кількість *</label>
        <input type="number" required min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">ПІБ *</label>
        <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <SearchableSelect label="Звання" required options={directories.ranks} value={formData.rank} onChange={(val) => setFormData({ ...formData, rank: val })} />
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Посада *</label>
        <input type="text" required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <SearchableSelect label="Служба" required options={directories.departments} value={formData.department} onChange={(val) => setFormData({ ...formData, department: val })} />
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Моб. номер</label>
        <input type="tel" value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Статус *</label>
        <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground">
          <option value="Відхилено">Відхилено</option>
        </select>
      </div>

      <SearchableSelect label="Локація" required options={directories.locations} value={formData.location} onChange={(val) => setFormData({ ...formData, location: val })} />

      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Дата відхилення *</label>
        <input type="text" required placeholder="DD.MM.YYYY" value={formData.rejectedDate} onChange={(e) => setFormData({ ...formData, rejectedDate: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-muted-foreground mb-1">Примітки *</label>
        <textarea required value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="Причина відхилення..." className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <MVOFields isFrtCp={formData.isFrtCp} setIsFrtCp={(v) => setFormData({ ...formData, isFrtCp: v })} data={formData} onChange={(f, v) => setFormData({ ...formData, [f]: v })} directories={directories} />
    </FormLayout>
  );
}
