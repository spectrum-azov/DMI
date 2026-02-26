import { User, Briefcase, Phone } from 'lucide-react';
import { SearchableSelect } from './SearchableSelect';
import { Directories } from '../types';

export interface Account {
    fullName: string;
    rank: number;
    position: string;
    phone: string;
}

interface AccountFieldsProps {
    accounts: Account[];
    quantity: number;
    onAccountChange: (index: number, field: keyof Account, value: string | number) => void;
    directories: Directories;
}

export function AccountFields({ accounts, quantity, onAccountChange, directories }: AccountFieldsProps) {
    return (
        <div className="md:col-span-2 border-t border-border pt-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <User size={18} className="text-blue-500" />
                    Облікові записи ({quantity})
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
                                    onChange={(e) => onAccountChange(index, 'fullName', e.target.value)}
                                    className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-muted-foreground/50 transition-all hover:border-muted-foreground/30 shadow-sm"
                                    placeholder="Прізвище Ім'я По батькові"
                                />
                            </div>

                            <div>
                                <SearchableSelect
                                    label="Звання"
                                    options={directories.ranks}
                                    value={account.rank}
                                    onChange={(val) => onAccountChange(index, 'rank', val)}
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
                                    onChange={(e) => onAccountChange(index, 'position', e.target.value)}
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
                                    onChange={(e) => onAccountChange(index, 'phone', e.target.value)}
                                    className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-muted-foreground/50 transition-all hover:border-muted-foreground/30 shadow-sm"
                                    placeholder="+380..."
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
