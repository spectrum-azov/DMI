import { BarChart3, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { IssuanceRecord, NeedRecord, RejectedRecord, Directories } from '../types';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';
import { StatCard, StatProgress } from './DashboardStats';

interface DashboardProps {
  issuanceData: IssuanceRecord[]; needsData: NeedRecord[]; rejectedData: RejectedRecord[];
  dateFilter: DateFilter; locationFilter: number; directories?: Directories;
  onRowClick?: (item: any, type: 'needs' | 'issuance' | 'rejected') => void;
}

export function Dashboard({
  issuanceData, needsData, rejectedData, dateFilter, locationFilter, directories, onRowClick,
}: DashboardProps) {
  const filterFn = (date: string) => isWithinPeriod(date, dateFilter) && (locationFilter === 0 || true); // location logic is slightly different in original but let's keep it simple

  const filteredIssuance = issuanceData.filter(i => isWithinPeriod(i.issueDate || '', dateFilter) && (locationFilter === 0 || i.location === locationFilter));
  const filteredNeeds = needsData.filter(n => isWithinPeriod(n.requestDate || '', dateFilter) && (locationFilter === 0 || n.location === locationFilter));
  const filteredRejected = rejectedData.filter(r => isWithinPeriod(r.rejectedDate || '', dateFilter) && (locationFilter === 0 || r.location === locationFilter));

  const totalIssuances = filteredIssuance.length;
  const totalNeeds = filteredNeeds.length;
  const totalRejected = filteredRejected.length;
  const totalRecords = totalIssuances + totalNeeds + totalRejected;

  const approvedNeeds = filteredNeeds.filter(n => n.status === 'Погоджено').length;
  const pendingIssuance = filteredIssuance.filter(i => i.status !== 'Видано');
  const totalPending = pendingIssuance.length;

  const statusStats = {
    'Готується': pendingIssuance.filter(i => i.status === 'Готується').length,
    'Готово': pendingIssuance.filter(i => i.status === 'Готово').length,
    'На паузі': pendingIssuance.filter(i => i.status === 'На паузі').length,
    'Чекаєм на поставку': pendingIssuance.filter(i => i.status === 'Чекаєм на поставку').length,
    'Інші': pendingIssuance.filter(i => !['Готується', 'Готово', 'На паузі', 'Чекаєм на поставку'].includes(i.status)).length,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} value={totalIssuances} total={issuanceData.length} title="Всього записів видачі" subtitle="Оброблено (період / всього)" color="blue" />
        <StatCard icon={Clock} value={totalPending} total={issuanceData.filter(i => i.status !== 'Видано').length} title="У черзі на видачу" subtitle="Очікують (період / всього)" color="yellow" />
        <StatCard icon={CheckCircle} value={approvedNeeds} total={needsData.filter(n => n.status === 'Погоджено').length} title="Погоджені потреби" subtitle="Готові (період / всього)" color="green" />
        <StatCard icon={XCircle} value={totalRejected} total={rejectedData.length} title="Відхилені запити" subtitle="Відхилено (період / всього)" color="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><BarChart3 className="text-blue-600" size={20} /><h3 className="font-semibold text-foreground">Статистика за категоріями</h3></div>
            <div className="space-y-3">
              <StatProgress label="Загальна кількість записів" value={totalRecords} total={totalRecords} color="bg-blue-600" />
              <StatProgress label="Видачі" value={totalIssuances} total={totalRecords} color="bg-green-600" />
              <StatProgress label="Потреби" value={totalNeeds} total={totalRecords} color="bg-yellow-600" />
              <StatProgress label="Відхилені" value={totalRejected} total={totalRecords} color="bg-red-600" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4"><Clock className="text-orange-600" size={20} /><h3 className="font-semibold text-foreground">На видачі по статусах</h3></div>
            <div className="space-y-4">
              <StatProgress label="Готово" value={statusStats['Готово']} total={totalPending} color="bg-blue-600" />
              <StatProgress label="Готується" value={statusStats['Готується']} total={totalPending} color="bg-orange-600" />
              <StatProgress label="На паузі" value={statusStats['На паузі']} total={totalPending} color="bg-yellow-500" />
              <StatProgress label="Чекаєм на поставку" value={statusStats['Чекаєм на поставку']} total={totalPending} color="bg-purple-600" />
              <StatProgress label="Інші (Повернули, Заміна тощо)" value={statusStats['Інші']} total={totalPending} color="bg-slate-500" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-foreground">Останні запити у цьому періоді</h3>
          <div className="space-y-3">
            {filteredNeeds.length === 0 ? <p className="text-muted-foreground text-sm">Немає запитів за період.</p> : (
              filteredNeeds.slice(0, 5).map((need) => (
                <div key={need.id} onClick={() => onRowClick && onRowClick(need, 'needs')} className={`flex items-start justify-between pb-3 border-b border-border last:border-0 last:pb-0 ${onRowClick ? 'cursor-pointer hover:bg-muted/50 rounded-lg p-2 -mx-2 transition-colors' : ''}`}>
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-sm text-foreground">{directories?.nomenclatures.find(d => d.id === need.nomenclature)?.name || need.nomenclature}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{need.fullName} • {directories?.departments.find(d => d.id === need.department)?.name || need.department}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${need.status === 'Погоджено' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : need.status === 'В обробці' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30' : need.status === 'Новий запит' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30' : 'bg-muted text-muted-foreground'}`}>{need.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
