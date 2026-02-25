import { useState } from 'react';
import {
  FileSpreadsheet,
  Package,
  AlertCircle,
  XCircle,
  Plus,
  LayoutDashboard,
  Menu,
  X,
  FileText,
} from 'lucide-react';
import { DataTable } from './components/DataTable';
import { NeedsDataTable } from './components/NeedsDataTable';
import { IssuanceDataTable } from './components/IssuanceDataTable';
import { IssuanceForm } from './components/IssuanceForm';
import { NeedForm } from './components/NeedForm';
import { RejectedForm } from './components/RejectedForm';
import { RejectDialog } from './components/RejectDialog';
import { DetailsModal } from './components/DetailsModal';
import { Dashboard } from './components/Dashboard';
import { IssuanceRecord, NeedRecord, RejectedRecord } from './types';
import {
  mockIssuanceData,
  mockNeedsData,
  mockRejectedData,
} from './data/mockData';

type TabType = 'dashboard' | 'issuance' | 'needs' | 'rejected';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for each data type
  const [issuanceData, setIssuanceData] =
    useState<IssuanceRecord[]>(mockIssuanceData);
  const [needsData, setNeedsData] = useState<NeedRecord[]>(mockNeedsData);
  const [rejectedData, setRejectedData] =
    useState<RejectedRecord[]>(mockRejectedData);

  // Form states
  const [isIssuanceFormOpen, setIsIssuanceFormOpen] = useState(false);
  const [isNeedFormOpen, setIsNeedFormOpen] = useState(false);
  const [isRejectedFormOpen, setIsRejectedFormOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingRecord, setViewingRecord] = useState<{
    data: any;
    title: string;
    columns: { key: string; label: string }[];
  } | null>(null);

  // Edit states
  const [editingIssuance, setEditingIssuance] = useState<
    IssuanceRecord | undefined
  >();
  const [editingNeed, setEditingNeed] = useState<NeedRecord | undefined>();
  const [editingRejected, setEditingRejected] = useState<
    RejectedRecord | undefined
  >();
  const [rejectingNeed, setRejectingNeed] = useState<NeedRecord | undefined>();

  // Handlers for Issuance
  const handleAddIssuance = (data: Omit<IssuanceRecord, 'id'>) => {
    if (editingIssuance) {
      setIssuanceData(
        issuanceData.map((item) =>
          item.id === editingIssuance.id
            ? { ...data, id: editingIssuance.id }
            : item,
        ),
      );
      setEditingIssuance(undefined);
    } else {
      const newRecord: IssuanceRecord = {
        ...data,
        id: Date.now().toString(),
      };
      setIssuanceData([...issuanceData, newRecord]);
    }
  };

  const handleEditIssuance = (item: IssuanceRecord) => {
    setEditingIssuance(item);
    setIsIssuanceFormOpen(true);
  };

  const handleDeleteIssuance = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      setIssuanceData(issuanceData.filter((item) => item.id !== id));
    }
  };

  const handleIssueItem = (id: string) => {
    if (confirm('Змінити статус на "Видано"?')) {
      setIssuanceData(
        issuanceData.map((item) =>
          item.id === id ? { ...item, status: 'Видано' } : item,
        ),
      );
    }
  };

  // Handlers for Needs
  const handleAddNeed = (data: Omit<NeedRecord, 'id'>) => {
    if (editingNeed) {
      const updatedRecord = { ...data, id: editingNeed.id };

      // Якщо статус змінився на "Погоджено" - переносимо у видачу
      if (data.status === 'Погоджено') {
        moveNeedToIssuance(updatedRecord);
      }
      // Якщо статус змінився на "Відхилено" - переносимо у відхилені
      else if (data.status === 'Відхилено') {
        moveNeedToRejected(updatedRecord, data.notes || 'Не вказано');
      }
      // Інакше просто оновлюємо
      else {
        setNeedsData(
          needsData.map((item) =>
            item.id === editingNeed.id ? updatedRecord : item,
          ),
        );
      }
      setEditingNeed(undefined);
    } else {
      const newRecord: NeedRecord = {
        ...data,
        id: Date.now().toString(),
      };
      setNeedsData([...needsData, newRecord]);
    }
  };

  const handleEditNeed = (item: NeedRecord) => {
    setEditingNeed(item);
    setIsNeedFormOpen(true);
  };

  const handleDeleteNeed = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей запит?')) {
      setNeedsData(needsData.filter((item) => item.id !== id));
    }
  };

  // Швидкі дії для потреб
  const handleApproveNeed = (need: NeedRecord) => {
    if (
      confirm(
        `Погодити запит на "${need.nomenclature}" (${need.quantity} шт.)?`,
      )
    ) {
      moveNeedToIssuance(need);
    }
  };

  const handleRejectNeed = (need: NeedRecord) => {
    setRejectingNeed(need);
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    if (rejectingNeed) {
      moveNeedToRejected(rejectingNeed, reason);
      setRejectingNeed(undefined);
    }
  };

  // Функція переміщення з потреб у видачу (тепер зі статусом "На видачу")
  const moveNeedToIssuance = (need: NeedRecord) => {
    const newIssuance: IssuanceRecord = {
      id: Date.now().toString(),
      nomenclature: need.nomenclature,
      type: need.type,
      quantity: need.quantity,
      model: '',
      serialNumber: '',
      fullName: need.contactPerson, // Using contact person
      department: need.department,
      request: 'Перенесено з потреби',
      requestNumber: `REQ-${Date.now()}`,
      issueDate: new Date().toLocaleDateString('uk-UA'),
      location: need.location,
      status: 'На видачу',
      notes: need.notes || `Погоджено запит від ${need.requestDate}`,
    };

    setIssuanceData([...issuanceData, newIssuance]);
    setNeedsData(needsData.filter((item) => item.id !== need.id));
    setActiveTab('issuance');
  };

  // Функція переміщення з потреб у відхилені
  const moveNeedToRejected = (need: NeedRecord, reason: string) => {
    const newRejected: RejectedRecord = {
      id: Date.now().toString(),
      nomenclature: need.nomenclature,
      type: need.type,
      quantity: need.quantity,
      fullName: need.contactPerson,
      position: need.position,
      department: need.department,
      mobileNumber: need.mobileNumber,
      status: 'Відхилено',
      notes: reason,
      rejectedDate: new Date().toLocaleDateString('uk-UA'),
    };

    setRejectedData([...rejectedData, newRejected]);
    setNeedsData(needsData.filter((item) => item.id !== need.id));
    setActiveTab('rejected');
  };

  // Handlers for Rejected
  const handleAddRejected = (data: Omit<RejectedRecord, 'id'>) => {
    if (editingRejected) {
      setRejectedData(
        rejectedData.map((item) =>
          item.id === editingRejected.id
            ? { ...data, id: editingRejected.id }
            : item,
        ),
      );
      setEditingRejected(undefined);
    } else {
      const newRecord: RejectedRecord = {
        ...data,
        id: Date.now().toString(),
      };
      setRejectedData([...rejectedData, newRecord]);
    }
  };

  const handleEditRejected = (item: RejectedRecord) => {
    setEditingRejected(item);
    setIsRejectedFormOpen(true);
  };

  const handleDeleteRejected = (id: string) => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      setRejectedData(rejectedData.filter((item) => item.id !== id));
    }
  };

  const handleRowClick = (item: any, type: TabType) => {
    let title = '';
    let columns: { key: string; label: string }[] = [];

    if (type === 'needs') {
      title = 'Деталі запиту на потребу';
      columns = needsColumns;
    } else if (type === 'issuance') {
      title = 'Деталі видачі обладнання';
      columns = issuanceColumns;
    } else if (type === 'rejected') {
      title = 'Деталі відхиленого запиту';
      columns = rejectedColumns;
    }

    setViewingRecord({ data: item, title, columns });
    setIsDetailsModalOpen(true);
  };

  const issuanceColumns = [
    { key: 'nomenclature', label: 'Номенклатура', width: '150px' },
    { key: 'type', label: 'Тип', width: '100px' },
    { key: 'quantity', label: 'К-сть', width: '80px' },
    { key: 'model', label: 'Модель', width: '120px' },
    { key: 'serialNumber', label: 'Серійний номер', width: '120px' },
    { key: 'fullName', label: 'ПІБ', width: '180px' },
    { key: 'department', label: 'Служба', width: '120px' },
    { key: 'requestNumber', label: 'Номер заявки', width: '120px' },
    { key: 'issueDate', label: 'Дата запису', width: '100px' },
    { key: 'location', label: 'Локація', width: '100px' },
    { key: 'status', label: 'Статус', width: '100px' },
  ];

  const needsColumns = [
    { key: 'nomenclature', label: 'Номенклатура', width: '150px' },
    { key: 'type', label: 'Тип', width: '100px' },
    { key: 'quantity', label: 'К-сть', width: '80px' },
    { key: 'contactPerson', label: 'Контактна особа', width: '150px' },
    { key: 'position', label: 'Посада', width: '120px' },
    { key: 'department', label: 'Служба', width: '120px' },
    { key: 'mobileNumber', label: 'Моб. номер', width: '120px' },
    { key: 'requestDate', label: 'Дата запиту', width: '100px' },
    { key: 'location', label: 'Локація', width: '100px' },
    { key: 'status', label: 'Статус', width: '130px' },
  ];

  const rejectedColumns = [
    { key: 'nomenclature', label: 'Номенклатура', width: '150px' },
    { key: 'type', label: 'Тип', width: '100px' },
    { key: 'quantity', label: 'К-сть', width: '80px' },
    { key: 'fullName', label: 'ПІБ', width: '180px' },
    { key: 'position', label: 'Посада', width: '150px' },
    { key: 'department', label: 'Служба', width: '120px' },
    { key: 'mobileNumber', label: 'Моб. номер', width: '120px' },
    { key: 'status', label: 'Статус', width: '100px' },
    { key: 'rejectedDate', label: 'Дата відхилення', width: '120px' },
    { key: 'notes', label: 'Примітки', width: '200px' },
  ];

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close menu on mobile after selection
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="text-blue-600" size={24} />
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            Система обліку <br /> обладнання
          </h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`${isMobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-white border-r border-gray-200 flex-shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-20`}
      >
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-gray-100">
          <FileSpreadsheet className="text-blue-600 flex-shrink-0" size={32} />
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Система обліку <br /> обладнання
            </h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={20} />
              Dashboard
            </div>
          </button>

          <button
            onClick={() => handleTabChange('needs')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'needs'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              Потреба
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'needs'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {needsData.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('issuance')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'issuance'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-3">
              <Package size={20} />
              Видача
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'issuance'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {issuanceData.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('rejected')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'rejected'
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-3">
              <XCircle size={20} />
              Відхилені
            </div>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'rejected'
                ? 'bg-blue-200 text-blue-800'
                : 'bg-gray-100 text-gray-600'
                }`}
            >
              {rejectedData.length}
            </span>
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full max-w-full overflow-hidden">
        <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6 overflow-hidden">
            {activeTab === 'dashboard' && (
              <Dashboard
                issuanceData={issuanceData}
                needsData={needsData}
                rejectedData={rejectedData}
              />
            )}

            {activeTab === 'needs' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Потреби в обладнанні
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Управління запитами на нове обладнання
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingNeed(undefined);
                      setIsNeedFormOpen(true);
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                  >
                    <Plus size={20} />
                    Додати запит
                  </button>
                </div>
                <NeedsDataTable
                  data={needsData}
                  columns={needsColumns}
                  onEdit={handleEditNeed}
                  onDelete={handleDeleteNeed}
                  onApprove={handleApproveNeed}
                  onReject={handleRejectNeed}
                  onRowClick={(item) => handleRowClick(item, 'needs')}
                  emptyMessage="Немає запитів на потреби"
                />
              </div>
            )}

            {activeTab === 'issuance' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Видача обладнання
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Облік виданого обладнання та черга на видачу
                    </p>
                  </div>
                </div>
                <IssuanceDataTable
                  data={issuanceData}
                  columns={issuanceColumns}
                  onEdit={handleEditIssuance}
                  onDelete={handleDeleteIssuance}
                  onIssue={handleIssueItem}
                  onRowClick={(item) => handleRowClick(item, 'issuance')}
                  emptyMessage="Немає записів про видачу"
                />
              </div>
            )}

            {activeTab === 'rejected' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Відхилені запити
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Історія відхилених потреб
                    </p>
                  </div>
                </div>
                <DataTable
                  data={rejectedData}
                  columns={rejectedColumns}
                  onEdit={handleEditRejected}
                  onDelete={handleDeleteRejected}
                  onRowClick={(item) => handleRowClick(item, 'rejected')}
                  dateField="rejectedDate"
                  emptyMessage="Немає відхилених запитів"
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Forms and Dialogs */}
      <IssuanceForm
        isOpen={isIssuanceFormOpen}
        onClose={() => {
          setIsIssuanceFormOpen(false);
          setEditingIssuance(undefined);
        }}
        onSubmit={handleAddIssuance}
        editData={editingIssuance}
      />

      <NeedForm
        isOpen={isNeedFormOpen}
        onClose={() => {
          setIsNeedFormOpen(false);
          setEditingNeed(undefined);
        }}
        onSubmit={handleAddNeed}
        editData={editingNeed}
      />

      <RejectedForm
        isOpen={isRejectedFormOpen}
        onClose={() => {
          setIsRejectedFormOpen(false);
          setEditingRejected(undefined);
        }}
        onSubmit={handleAddRejected}
        editData={editingRejected}
      />

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setRejectingNeed(undefined);
        }}
        onConfirm={handleConfirmReject}
        itemName={rejectingNeed?.nomenclature || ''}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={viewingRecord?.title || ''}
        data={viewingRecord?.data}
        columns={viewingRecord?.columns || []}
      />
    </div>
  );
}