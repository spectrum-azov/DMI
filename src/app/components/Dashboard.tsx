import { BarChart3, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { IssuanceRecord, NeedRecord, RejectedRecord } from '../types';

interface DashboardProps {
  issuanceData: IssuanceRecord[];
  needsData: NeedRecord[];
  rejectedData: RejectedRecord[];
}

export function Dashboard({ issuanceData, needsData, rejectedData }: DashboardProps) {
  const totalIssuances = issuanceData.length;
  const totalNeeds = needsData.length;
  const totalRejected = rejectedData.length;
  
  const pendingNeeds = needsData.filter(n => n.status === 'В обробці' || n.status === 'Новий запит').length;
  const approvedNeeds = needsData.filter(n => n.status === 'Погоджено').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Панель управління</h2>
        <p className="text-gray-600">Огляд системи обліку обладнання</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-blue-900">{totalIssuances}</span>
          </div>
          <h3 className="font-medium text-blue-900">Всього видач</h3>
          <p className="text-sm text-blue-700 mt-1">Обладнання на балансі</p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="text-yellow-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-yellow-900">{pendingNeeds}</span>
          </div>
          <h3 className="font-medium text-yellow-900">Потреби в обробці</h3>
          <p className="text-sm text-yellow-700 mt-1">Очікують розгляду</p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-green-900">{approvedNeeds}</span>
          </div>
          <h3 className="font-medium text-green-900">Погоджені потреби</h3>
          <p className="text-sm text-green-700 mt-1">Готові до видачі</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="text-red-600" size={24} />
            </div>
            <span className="text-3xl font-bold text-red-900">{totalRejected}</span>
          </div>
          <h3 className="font-medium text-red-900">Відхилені запити</h3>
          <p className="text-sm text-red-700 mt-1">Не схвалені</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-blue-600" size={20} />
            <h3 className="font-semibold">Статистика за категоріями</h3>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Загальна кількість записів</span>
                <span className="font-medium">{totalIssuances + totalNeeds + totalRejected}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Видачі</span>
                <span className="font-medium">{totalIssuances}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${(totalIssuances / (totalIssuances + totalNeeds + totalRejected)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Потреби</span>
                <span className="font-medium">{totalNeeds}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ width: `${(totalNeeds / (totalIssuances + totalNeeds + totalRejected)) * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">Відхилені</span>
                <span className="font-medium">{totalRejected}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(totalRejected / (totalIssuances + totalNeeds + totalRejected)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="font-semibold mb-4">Останні потреби</h3>
          <div className="space-y-3">
            {needsData.slice(0, 5).map(need => (
              <div key={need.id} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{need.nomenclature}</p>
                  <p className="text-xs text-gray-600">{need.contactPerson} • {need.department}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                  need.status === 'Погоджено' ? 'bg-green-100 text-green-700' :
                  need.status === 'В обробці' ? 'bg-yellow-100 text-yellow-700' :
                  need.status === 'Новий запит' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {need.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
