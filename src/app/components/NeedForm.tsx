import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { NeedRecord, Directories } from '../types';
import { formatUkrDate, formatISOToUkr, formatUkrToISO } from '../utils/dateUtils';
import { SearchableSelect } from './SearchableSelect';
import { User, Shield, Briefcase, Phone } from 'lucide-react';

interface Account {
  fullName: string;
  rank: number;
  position: string;
  phone: string;
}

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
    fullName: '',      // Contact Person Name
    rank: 0,          // Contact Person Rank
    position: '',      // Contact Person Position
    department: 0,
    mobileNumber: '',  // Contact Person Phone
    isFrtCp: true,     // true means MVO IS SAME as Contact Person
    frpFullName: '',   // MVO Name
    frpRank: 0,        // MVO Rank
    frpPosition: '',   // MVO Position
    frpMobileNumber: '', // MVO Phone
    requestDate: formatUkrDate(new Date()),
    location: 0,
    status: 'На погодженні',
    notes: '',
    accountsData: '',
  });

  const [accounts, setAccounts] = useState<Account[]>([]);

  const selectedNomenclature = directories.nomenclatures.find(n => n.id === formData.nomenclature);
  const selectedType = directories.types.find(t => t.id === formData.type);

  const isComputer = selectedNomenclature?.name.toLowerCase().includes('ноутбук') ||
    selectedNomenclature?.name.toLowerCase().includes('ноут') ||
    selectedNomenclature?.name.toLowerCase().includes('комп') ||
    selectedNomenclature?.name.toLowerCase().includes('моноблок');

  const isSpecialType = selectedType?.name.toLowerCase().includes('робочий') ||
    selectedType?.name.toLowerCase().includes('седо') ||
    selectedType?.name.toLowerCase().includes('sedo');

  const showAccountFields = isComputer && isSpecialType;

  useEffect(() => {
    if (editData) {
      setFormData({
        nomenclature: editData.nomenclature,
        type: editData.type,
        quantity: editData.quantity,
        fullName: editData.fullName || '',
        rank: editData.rank || 0,
        position: editData.position || '',
        department: editData.department || 0,
        mobileNumber: editData.mobileNumber || '',
        isFrtCp: editData.isFrtCp ?? true,
        frpFullName: editData.frpFullName || '',
        frpRank: editData.frpRank || 0,
        frpPosition: editData.frpPosition || '',
        frpMobileNumber: editData.frpMobileNumber || '',
        requestDate: editData.requestDate || formatUkrDate(new Date()),
        location: editData.location || 0,
        status: editData.status || 'На погодженні',
        notes: editData.notes || '',
        accountsData: editData.accountsData || '',
      });
      if (editData.accountsData) {
        try {
          setAccounts(JSON.parse(editData.accountsData));
        } catch (e) {
          setAccounts([]);
        }
      } else {
        setAccounts([]);
      }
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
        isFrtCp: true,
        frpFullName: '',
        frpRank: directories.ranks[0]?.id || 0,
        frpPosition: '',
        frpMobileNumber: '',
        requestDate: formatUkrDate(new Date()),
        location: directories.locations[0]?.id || 0,
        status: 'На погодженні',
        notes: '',
        accountsData: '',
      });
      setAccounts([]);
    }
  }, [editData, isOpen, directories]);

  useEffect(() => {
    if (showAccountFields) {
      setAccounts(prev => {
        const newAccounts = [...prev];
        if (newAccounts.length < formData.quantity) {
          for (let i = newAccounts.length; i < formData.quantity; i++) {
            newAccounts.push({
              fullName: '',
              rank: directories.ranks[0]?.id || 0,
              position: '',
              phone: ''
            });
          }
        } else if (newAccounts.length > formData.quantity) {
          return newAccounts.slice(0, formData.quantity);
        }
        return newAccounts;
      });
    }
  }, [formData.quantity, showAccountFields]);

  const handleAccountChange = (index: number, field: keyof Account, value: string | number) => {
    setAccounts(prev => {
      const newAccounts = [...prev];
      newAccounts[index] = { ...newAccounts[index], [field]: value };
      return newAccounts;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Sync MVO data with Contact Person data if the checkbox is checked
    const submissionData = { ...formData };
    if (formData.isFrtCp) {
      submissionData.frpFullName = formData.fullName;
      submissionData.frpRank = formData.rank;
      submissionData.frpPosition = formData.position;
      submissionData.frpMobileNumber = formData.mobileNumber;
    }

    if (showAccountFields) {
      submissionData.accountsData = JSON.stringify(accounts);
    } else {
      submissionData.accountsData = '';
    }

    onSubmit(submissionData);
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

            {/* Equipment Section */}
            <div className="md:col-span-2">
              <h3 className="text-sm font-semibold text-foreground mb-4">Обладнання</h3>
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
                    className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person Section - Primary UI */}
            <div className="md:col-span-2 border-t border-border pt-4 mt-2">
              <h3 className="text-sm font-semibold text-foreground mb-4">
                Контактна особа
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    ПІБ контактної особи *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                  />
                </div>

                <SearchableSelect
                  label="Звання контактної особи"
                  required
                  options={directories.ranks}
                  value={formData.rank}
                  onChange={(val) => setFormData({ ...formData, rank: val })}
                />

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Посада контактної особи *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Моб. номер контактної особи *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Accounts Section */}
            {showAccountFields && (
              <div className="md:col-span-2 border-t border-border pt-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User size={18} className="text-blue-500" />
                    Облікові записи ({formData.quantity})
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    Обов'язково ПІБ
                  </span>
                </div>

                <div className="space-y-6">
                  {accounts.map((account, index) => (
                    <div key={index} className="p-4 rounded-xl border border-border bg-muted/30 space-y-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold ring-1 ring-blue-600/20">
                          {index + 1}
                        </div>
                        <span className="text-xs font-semibold text-foreground">Користувач {index + 1}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5 tracking-wider">
                            <User size={12} className="text-blue-500" /> ПІБ *
                          </label>
                          <input
                            type="text"
                            required
                            value={account.fullName || ''}
                            onChange={(e) => handleAccountChange(index, 'fullName', e.target.value)}
                            className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-muted-foreground/50 transition-all hover:border-muted-foreground/30 shadow-sm"
                            placeholder="Прізвище Ім'я По батькові"
                          />
                        </div>

                        <div>
                          <SearchableSelect
                            label="Звання"
                            options={directories.ranks}
                            value={account.rank}
                            onChange={(val) => handleAccountChange(index, 'rank', val)}
                            labelClassName="text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 tracking-wider flex items-center gap-1.5"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5 tracking-wider">
                            <Briefcase size={12} className="text-blue-500" /> Посада
                          </label>
                          <input
                            type="text"
                            value={account.position || ''}
                            onChange={(e) => handleAccountChange(index, 'position', e.target.value)}
                            className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-muted-foreground/50 transition-all hover:border-muted-foreground/30 shadow-sm"
                            placeholder="Посада"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground uppercase mb-1.5 flex items-center gap-1.5 tracking-wider">
                            <Phone size={12} className="text-blue-500" /> Телефон
                          </label>
                          <input
                            type="tel"
                            value={account.phone || ''}
                            onChange={(e) => handleAccountChange(index, 'phone', e.target.value)}
                            className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-muted-foreground/50 transition-all hover:border-muted-foreground/30 shadow-sm"
                            placeholder="+380..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Same Person Checkbox - MVO logic */}
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
                  Матеріально відповідальна особа (МВО) збігається з контактною
                </label>
              </div>

              {!formData.isFrtCp && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Дані матеріально відповідальної особи (МВО)</h4>
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
                      className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
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
                      className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Моб. номер МВО
                    </label>
                    <input
                      type="tel"
                      value={formData.frpMobileNumber}
                      onChange={(e) => setFormData({ ...formData, frpMobileNumber: e.target.value })}
                      className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Service and meta fields */}
            <div className="md:col-span-2 border-t border-border pt-4 mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SearchableSelect
                  label="Служба"
                  required
                  options={directories.departments}
                  value={formData.department}
                  onChange={(val) => setFormData({ ...formData, department: val })}
                />

                <SearchableSelect
                  label="Локація"
                  required
                  options={directories.locations}
                  value={formData.location}
                  onChange={(val) => setFormData({ ...formData, location: val })}
                />

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Дата запиту
                  </label>
                  <input
                    type="text"
                    disabled
                    value={formData.requestDate}
                    className="w-full px-3 py-2 bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed"
                  />
                </div>

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
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Примітка
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Додайте примітку..."
                className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
              />
            </div>
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
              {editData ? 'Зберегти зміни' : 'Додати запит'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
