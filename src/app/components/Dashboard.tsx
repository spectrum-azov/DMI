import { BarChart3, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { IssuanceRecord, NeedRecord, RejectedRecord } from '../types';
import { QuickDateFilter } from './QuickDateFilter';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';

interface DashboardProps {
  issuanceData: IssuanceRecord[];
  needsData: NeedRecord[];
  rejectedData: RejectedRecord[];
}

export function Dashboard({
  issuanceData,
  needsData,
  rejectedData,
}: DashboardProps) {
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');

  const filteredIssuance = issuanceData.filter((i) =>
    isWithinPeriod(i.issueDate, dateFilter),
  );
  const filteredNeeds = needsData.filter((n) =>
    isWithinPeriod(n.requestDate, dateFilter),
  );
  const filteredRejected = rejectedData.filter((r) =>
    isWithinPeriod(r.rejectedDate, dateFilter),
  );

  const totalIssuances = filteredIssuance.length;
  const totalNeeds = filteredNeeds.length;
  const totalRejected = filteredRejected.length;
  const totalRecords = totalIssuances + totalNeeds + totalRejected;

  const pendingNeeds = filteredNeeds.filter(
    (n) => n.status === 'В обробці' || n.status === 'Новий запит',
  ).length;
  const approvedNeeds = filteredNeeds.filter(
    (n) => n.status === 'Погоджено',
  ).length;

  // Calculate status statistics for pending issuance
  const pendingIssuance = filteredIssuance.filter((i) => i.status !== 'Видано');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-1 text-foreground">Панель управління</h2>
          <p className="text-muted-foreground">Огляд системи обліку обладнання</p>
        </div>
        <QuickDateFilter value={dateFilter} onChange={setDateFilter} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900/10 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900/30">
              <Package className="text-blue-600 dark:text-blue-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-blue-900 dark:text-blue-200">
              {totalIssuances}
            </span>
          </div>
          <h3 className="font-medium text-blue-900 dark:text-blue-200">Всього записів видачі</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Оброблено у періоді</p>
        </div>

        <div className="bg-yellow-50/50 border border-yellow-200 rounded-lg p-6 dark:bg-yellow-900/10 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg dark:bg-yellow-900/30">
              <Clock className="text-yellow-600 dark:text-yellow-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-yellow-900 dark:text-yellow-200">
              {totalPending}
            </span>
          </div>
          <h3 className="font-medium text-yellow-900 dark:text-yellow-200">У черзі на видачу</h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">Очікують видачі</p>
        </div>

        <div className="bg-green-50/50 border border-green-200 rounded-lg p-6 dark:bg-green-900/10 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
              <CheckCircle className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-green-900 dark:text-green-200">
              {approvedNeeds}
            </span>
          </div>
          <h3 className="font-medium text-green-900 dark:text-green-200">Погоджені потреби</h3>
          <p className="text-sm text-green-700 dark:text-green-300 mt-1">
            Готові до видачі
          </p>
        </div>

        <div className="bg-red-50/50 border border-red-200 rounded-lg p-6 dark:bg-red-900/10 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg dark:bg-red-900/30">
              <XCircle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-red-900 dark:text-red-200">
              {totalRejected}
            </span>
          </div>
          <h3 className="font-medium text-red-900 dark:text-red-200">Відхилені запити</h3>
          <p className="text-sm text-red-700 dark:text-red-300 mt-1">Не схвалені</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="text-blue-600" size={20} />
              <h3 className="font-semibold text-foreground">Статистика за категоріями</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Загальна кількість записів</span>
                  <span className="font-medium text-foreground">{totalRecords}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Видачі</span>
                  <span className="font-medium text-foreground">{totalIssuances}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: totalRecords
                        ? `${(totalIssuances / totalRecords) * 100}%`
                        : '0%',
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Потреби</span>
                  <span className="font-medium text-foreground">{totalNeeds}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: totalRecords
                        ? `${(totalNeeds / totalRecords) * 100}%`
                        : '0%',
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Відхилені</span>
                  <span className="font-medium text-foreground">{totalRejected}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-500"
                    style={{
                      width: totalRecords
                        ? `${(totalRejected / totalRecords) * 100}%`
                        : '0%',
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-orange-600" size={20} />
              <h3 className="font-semibold text-foreground">На видачі по статусах</h3>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Готово</span>
                  <span className="font-medium text-foreground">{statusStats['Готово']}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: totalPending ? `${(statusStats['Готово'] / totalPending) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Готується</span>
                  <span className="font-medium text-foreground">{statusStats['Готується']}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: totalPending ? `${(statusStats['Готується'] / totalPending) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">На паузі</span>
                  <span className="font-medium text-foreground">{statusStats['На паузі']}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: totalPending ? `${(statusStats['На паузі'] / totalPending) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Чекаєм на поставку</span>
                  <span className="font-medium text-foreground">{statusStats['Чекаєм на поставку']}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: totalPending ? `${(statusStats['Чекаєм на поставку'] / totalPending) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Інші (Повернули, Заміна тощо)</span>
                  <span className="font-medium text-foreground">{statusStats['Інші']}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-slate-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: totalPending ? `${(statusStats['Інші'] / totalPending) * 100}%` : '0%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h3 className="font-semibold mb-4 text-foreground">Останні запити у цьому періоді</h3>
          <div className="space-y-3">
            {filteredNeeds.length === 0 ? (
              <p className="text-muted-foreground text-sm">Немає запитів за період.</p>
            ) : (
              filteredNeeds.slice(0, 5).map((need) => (
                <div
                  key={need.id}
                  className="flex items-start justify-between pb-3 border-b border-border last:border-0 last:pb-0"
                >
                  <div className="flex-1 pr-2">
                    <p className="font-medium text-sm text-foreground">{need.nomenclature}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {need.contactPerson} • {need.department}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full whitespace-nowrap font-medium ${need.status === 'Погоджено'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                      : need.status === 'В обробці'
                        ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30'
                        : need.status === 'Новий запит'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                          : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {need.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
