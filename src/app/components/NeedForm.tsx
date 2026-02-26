import { useState, useEffect } from 'react';
import { NeedRecord, Directories } from '../types';
import { formatUkrDate } from '../utils/dateUtils';
import { SearchableSelect } from './SearchableSelect';
import { Account, AccountFields } from './AccountFields';
import { FormLayout } from './FormLayout';
import { MVOFields } from './MVOFields';

interface NeedFormProps {
  isOpen: boolean; onClose: () => void; onSubmit: (data: Omit<NeedRecord, 'id'>) => void;
  editData?: NeedRecord; directories: Directories;
}

export function NeedForm({ isOpen, onClose, onSubmit, editData, directories }: NeedFormProps) {
  const [formData, setFormData] = useState<Omit<NeedRecord, 'id'>>({
    nomenclature: 0, type: 0, quantity: 1, fullName: '', rank: 0, position: '',
    department: 0, mobileNumber: '', isFrtCp: true, frpFullName: '', frpRank: 0,
    frpPosition: '', frpMobileNumber: '', requestDate: formatUkrDate(new Date()),
    location: 0, status: 'На погодженні', notes: '', accountsData: '',
  });

  const [accounts, setAccounts] = useState<Account[]>([]);
  const selectedNom = directories.nomenclatures.find(n => n.id === formData.nomenclature);
  const selectedType = directories.types.find(t => t.id === formData.type);
  const isComputer = selectedNom?.name.toLowerCase().match(/ноут|комп|моноблок/);
  const isSpecialType = selectedType?.name.toLowerCase().match(/робочий|седо|sedo/);
  const showAccountFields = isComputer && isSpecialType;

  useEffect(() => {
    if (editData) {
      setFormData({ ...editData, isFrtCp: editData.isFrtCp ?? true });
      if (editData.accountsData) {
        try { setAccounts(JSON.parse(editData.accountsData)); } catch { setAccounts([]); }
      } else { setAccounts([]); }
    } else {
      setFormData({
        nomenclature: directories.nomenclatures[0]?.id || 0, type: directories.types[0]?.id || 0,
        quantity: 1, fullName: '', rank: directories.ranks[0]?.id || 0, position: '',
        department: directories.departments[0]?.id || 0, mobileNumber: '', isFrtCp: true,
        frpFullName: '', frpRank: directories.ranks[0]?.id || 0, frpPosition: '', frpMobileNumber: '',
        requestDate: formatUkrDate(new Date()), location: directories.locations[0]?.id || 0,
        status: 'На погодженні', notes: '', accountsData: '',
      });
      setAccounts([]);
    }
  }, [editData, isOpen, directories]);

  useEffect(() => {
    if (showAccountFields) {
      setAccounts(prev => {
        const next = [...prev];
        if (next.length < formData.quantity) {
          for (let i = next.length; i < formData.quantity; i++)
            next.push({ fullName: '', rank: directories.ranks[0]?.id || 0, position: '', phone: '' });
        } else if (next.length > formData.quantity) return next.slice(0, formData.quantity);
        return next;
      });
    }
  }, [formData.quantity, showAccountFields, directories.ranks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...formData };
    if (formData.isFrtCp) {
      data.frpFullName = formData.fullName; data.frpRank = formData.rank;
      data.frpPosition = formData.position; data.frpMobileNumber = formData.mobileNumber;
    }
    data.accountsData = showAccountFields ? JSON.stringify(accounts) : '';
    onSubmit(data); onClose();
  };

  return (
    <FormLayout
      isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}
      title={editData ? 'Редагувати запит' : 'Новий запит на потребу'}
      submitLabel={editData ? 'Зберегти зміни' : 'Додати запит'}
    >
      <div className="md:col-span-2"><h3 className="text-sm font-semibold text-foreground mb-4">Обладнання</h3></div>
      <SearchableSelect label="Номенклатура" required options={directories.nomenclatures} value={formData.nomenclature} onChange={(v) => setFormData({ ...formData, nomenclature: v })} />
      <SearchableSelect label="Тип" required options={directories.types} value={formData.type} onChange={(v) => setFormData({ ...formData, type: v })} />
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Кількість *</label>
        <input type="number" required min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      <div className="md:col-span-2 border-t border-border pt-4 mt-2"><h3 className="text-sm font-semibold text-foreground mb-4">Контактна особа</h3></div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">ПІБ контактної особи *</label>
        <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
      <SearchableSelect label="Звання контактної особи" required options={directories.ranks} value={formData.rank} onChange={(v) => setFormData({ ...formData, rank: v })} />
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Посада контактної особи *</label>
        <input type="text" required value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
      <div><label className="block text-sm font-medium text-muted-foreground mb-1">Моб. номер контактної особи *</label>
        <input type="tel" required value={formData.mobileNumber} onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })} className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>

      {showAccountFields && (
        <AccountFields accounts={accounts} quantity={formData.quantity} directories={directories} onAccountChange={(idx, fld, val) => {
          const next = [...accounts]; next[idx] = { ...next[idx], [fld]: val }; setAccounts(next);
        }} />
      )}

      <MVOFields isFrtCp={formData.isFrtCp} setIsFrtCp={(val) => setFormData({ ...formData, isFrtCp: val })} data={formData} onChange={(f, v) => setFormData({ ...formData, [f]: v })} directories={directories} />

      <div className="md:col-span-2 border-t border-border pt-4 mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableSelect label="Служба" required options={directories.departments} value={formData.department} onChange={(v) => setFormData({ ...formData, department: v })} />
          <SearchableSelect label="Локація" required options={directories.locations} value={formData.location} onChange={(v) => setFormData({ ...formData, location: v })} />
          <div><label className="block text-sm font-medium text-muted-foreground mb-1">Дата запиту</label>
            <input type="text" disabled value={formData.requestDate} className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed" />
          </div>
          <div><label className="block text-sm font-medium text-muted-foreground mb-1">Статус</label>
            <input type="text" disabled value={formData.status} className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed" />
          </div>
        </div>
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-muted-foreground mb-1">Примітка</label>
        <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} placeholder="Додайте примітку..." className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground" />
      </div>
    </FormLayout>
  );
}
