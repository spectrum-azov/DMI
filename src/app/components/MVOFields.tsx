import { SearchableSelect } from './SearchableSelect';
import { Directories } from '../types';

interface MVOFieldsProps {
    isFrtCp: boolean | undefined;
    setIsFrtCp: (val: boolean) => void;
    data: {
        frpFullName?: string;
        frpRank?: number;
        frpPosition?: string;
        frpMobileNumber?: string;
    };
    onChange: (field: string, value: any) => void;
    directories: Directories;
}

export function MVOFields({ isFrtCp, setIsFrtCp, data, onChange, directories }: MVOFieldsProps) {
    return (
        <div className="md:col-span-2 border-t border-border pt-4 mt-2">
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    id="isFrtCp"
                    checked={!!isFrtCp}
                    onChange={(e) => setIsFrtCp(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-input focus:ring-blue-500"
                />
                <label htmlFor="isFrtCp" className="text-sm font-medium text-foreground">
                    Матеріально відповідальна особа (МВО) збігається з контактною
                </label>
            </div>

            {!isFrtCp && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="md:col-span-2">
                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2"> Дані матеріально відповідальної особи (МВО)</h4>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">ПІБ МВО *</label>
                        <input
                            type="text"
                            required={!isFrtCp}
                            value={data.frpFullName || ''}
                            onChange={(e) => onChange('frpFullName', e.target.value)}
                            className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                        />
                    </div>
                    <SearchableSelect
                        label="Звання МВО"
                        required={!isFrtCp}
                        options={directories.ranks}
                        value={data.frpRank || 0}
                        onChange={(val) => onChange('frpRank', val)}
                    />
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Посада МВО *</label>
                        <input
                            type="text"
                            required={!isFrtCp}
                            value={data.frpPosition || ''}
                            onChange={(e) => onChange('frpPosition', e.target.value)}
                            className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">Моб. номер МВО</label>
                        <input
                            type="tel"
                            value={data.frpMobileNumber || ''}
                            onChange={(e) => onChange('frpMobileNumber', e.target.value)}
                            className="w-full px-3 py-2 bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-foreground"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
