import { useState } from "react";
import {
  FileSpreadsheet,
  Package,
  AlertCircle,
  XCircle,
  Plus,
  LayoutDashboard,
} from "lucide-react";
import { DataTable } from "./components/DataTable";
import { NeedsDataTable } from "./components/NeedsDataTable";
import { IssuanceForm } from "./components/IssuanceForm";
import { NeedForm } from "./components/NeedForm";
import { RejectedForm } from "./components/RejectedForm";
import { RejectDialog } from "./components/RejectDialog";
import { Dashboard } from "./components/Dashboard";
import {
  IssuanceRecord,
  NeedRecord,
  RejectedRecord,
} from "./types";
import {
  mockIssuanceData,
  mockNeedsData,
  mockRejectedData,
} from "./data/mockData";

type TabType = "dashboard" | "issuance" | "needs" | "rejected";

export default function App() {
  const [activeTab, setActiveTab] =
    useState<TabType>("dashboard");

  // State for each data type
  const [issuanceData, setIssuanceData] =
    useState<IssuanceRecord[]>(mockIssuanceData);
  const [needsData, setNeedsData] =
    useState<NeedRecord[]>(mockNeedsData);
  const [rejectedData, setRejectedData] =
    useState<RejectedRecord[]>(mockRejectedData);

  // Form states
  const [isIssuanceFormOpen, setIsIssuanceFormOpen] =
    useState(false);
  const [isNeedFormOpen, setIsNeedFormOpen] = useState(false);
  const [isRejectedFormOpen, setIsRejectedFormOpen] =
    useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] =
    useState(false);

  // Edit states
  const [editingIssuance, setEditingIssuance] = useState<
    IssuanceRecord | undefined
  >();
  const [editingNeed, setEditingNeed] = useState<
    NeedRecord | undefined
  >();
  const [editingRejected, setEditingRejected] = useState<
    RejectedRecord | undefined
  >();
  const [rejectingNeed, setRejectingNeed] = useState<
    NeedRecord | undefined
  >();

  // Handlers for Issuance
  const handleAddIssuance = (
    data: Omit<IssuanceRecord, "id">,
  ) => {
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
    if (confirm("Ви впевнені, що хочете видалити цей запис?")) {
      setIssuanceData(
        issuanceData.filter((item) => item.id !== id),
      );
    }
  };

  // Handlers for Needs
  const handleAddNeed = (data: Omit<NeedRecord, "id">) => {
    if (editingNeed) {
      const updatedRecord = { ...data, id: editingNeed.id };

      // Якщо статус змінився на "Погоджено" - переносимо у видачу
      if (data.status === "Погоджено") {
        moveNeedToIssuance(updatedRecord);
      }
      // Якщо статус змінився на "Відхилено" - переносимо у відхилені
      else if (data.status === "Відхилено") {
        moveNeedToRejected(
          updatedRecord,
          data.notes || "Не вказано",
        );
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
    if (confirm("Ви впевнені, що хочете видалити цей запит?")) {
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

  // Функція переміщення з потреб у видачу
  const moveNeedToIssuance = (need: NeedRecord) => {
    // Створюємо новий запис видачі на основі потреби
    const newIssuance: IssuanceRecord = {
      id: Date.now().toString(),
      nomenclature: need.nomenclature,
      type: need.type,
      quantity: need.quantity,
      model: "",
      serialNumber: "",
      fullName: need.contactPerson,
      department: need.department,
      request: "Перенесено з потреби",
      requestNumber: `REQ-${Date.now()}`,
      issueDate: new Date().toLocaleDateString("uk-UA"),
      location: need.location,
      status: "Видано",
      notes:
        need.notes || `Погоджено запит від ${need.requestDate}`,
    };

    // Додаємо у видачу
    setIssuanceData([...issuanceData, newIssuance]);

    // Видаляємо з потреб
    setNeedsData(
      needsData.filter((item) => item.id !== need.id),
    );

    // Переключаємося на вкладку видачі
    setActiveTab("issuance");
  };

  // Функція переміщення з потреб у відхилені
  const moveNeedToRejected = (
    need: NeedRecord,
    reason: string,
  ) => {
    // Створюємо новий запис відхилення на основі потреби
    const newRejected: RejectedRecord = {
      id: Date.now().toString(),
      nomenclature: need.nomenclature,
      type: need.type,
      quantity: need.quantity,
      fullName: need.contactPerson,
      position: need.position,
      department: need.department,
      mobileNumber: need.mobileNumber,
      status: "Відхилено",
      notes: reason,
    };

    // Додаємо у відхилені
    setRejectedData([...rejectedData, newRejected]);

    // Видаляємо з потреб
    setNeedsData(
      needsData.filter((item) => item.id !== need.id),
    );

    // Переключаємося на вкладку відхилених
    setActiveTab("rejected");
  };

  // Handlers for Rejected
  const handleAddRejected = (
    data: Omit<RejectedRecord, "id">,
  ) => {
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
    if (confirm("Ви впевнені, що хочете видалити цей запис?")) {
      setRejectedData(
        rejectedData.filter((item) => item.id !== id),
      );
    }
  };

  const issuanceColumns = [
    {
      key: "nomenclature",
      label: "Номенклатура",
      width: "150px",
    },
    { key: "type", label: "Тип", width: "100px" },
    { key: "quantity", label: "К-сть", width: "80px" },
    { key: "model", label: "Модель", width: "120px" },
    {
      key: "serialNumber",
      label: "Серійний номер",
      width: "120px",
    },
    { key: "fullName", label: "ПІБ", width: "180px" },
    { key: "department", label: "Служба", width: "120px" },
    {
      key: "requestNumber",
      label: "Номер заявки",
      width: "120px",
    },
    { key: "issueDate", label: "Дата видачі", width: "100px" },
    { key: "location", label: "Локація", width: "100px" },
    { key: "status", label: "Статус", width: "100px" },
  ];

  const needsColumns = [
    {
      key: "nomenclature",
      label: "Номенклатура",
      width: "150px",
    },
    { key: "type", label: "Тип", width: "100px" },
    { key: "quantity", label: "К-сть", width: "80px" },
    {
      key: "contactPerson",
      label: "Контактна особа",
      width: "150px",
    },
    { key: "position", label: "Посада", width: "120px" },
    { key: "department", label: "Служба", width: "120px" },
    {
      key: "mobileNumber",
      label: "Моб. номер",
      width: "120px",
    },
    {
      key: "requestDate",
      label: "Дата запиту",
      width: "100px",
    },
    { key: "location", label: "Локація", width: "100px" },
    { key: "status", label: "Статус", width: "130px" },
  ];

  const rejectedColumns = [
    {
      key: "nomenclature",
      label: "Номенклатура",
      width: "150px",
    },
    { key: "type", label: "Тип", width: "100px" },
    { key: "quantity", label: "К-сть", width: "80px" },
    { key: "fullName", label: "ПІБ", width: "180px" },
    { key: "position", label: "Посада", width: "150px" },
    { key: "department", label: "Служба", width: "120px" },
    {
      key: "mobileNumber",
      label: "Моб. номер",
      width: "120px",
    },
    { key: "status", label: "Статус", width: "100px" },
    { key: "notes", label: "Примітки", width: "200px" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet
              className="text-blue-600"
              size={32}
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Система обліку обладнання
              </h1>
              <p className="text-sm text-gray-600">
                Управління видачами, потребами та відхиленими
                запитами
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === "dashboard"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <LayoutDashboard size={20} />
                Dashboard
              </button>

              <button
                onClick={() => setActiveTab("needs")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === "needs"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <AlertCircle size={20} />
                Потреба ({needsData.length})
              </button>

              <button
                onClick={() => setActiveTab("issuance")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === "issuance"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <Package size={20} />
                Видача ({issuanceData.length})
              </button>

              <button
                onClick={() => setActiveTab("rejected")}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium whitespace-nowrap transition-colors ${
                  activeTab === "rejected"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                <XCircle size={20} />
                Відхилені ({rejectedData.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "dashboard" && (
              <Dashboard
                issuanceData={issuanceData}
                needsData={needsData}
                rejectedData={rejectedData}
              />
            )}

            {activeTab === "needs" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Потреби в обладнанні
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Всього запитів: {needsData.length}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingNeed(undefined);
                      setIsNeedFormOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  emptyMessage="Немає запитів на потреби"
                />
              </div>
            )}

            {activeTab === "issuance" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Видача обладнання
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Всього записів: {issuanceData.length}
                    </p>
                  </div>
                </div>
                <DataTable
                  data={issuanceData}
                  columns={issuanceColumns}
                  onEdit={handleEditIssuance}
                  onDelete={handleDeleteIssuance}
                  emptyMessage="Немає записів про видачу"
                />
              </div>
            )}

            {activeTab === "rejected" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Відхилені запити
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Всього відхилених: {rejectedData.length}
                    </p>
                  </div>
                </div>
                <DataTable
                  data={rejectedData}
                  columns={rejectedColumns}
                  onEdit={handleEditRejected}
                  onDelete={handleDeleteRejected}
                  emptyMessage="Немає відхилених запитів"
                />
              </div>
            )}
          </div>
        </div>
      </div>

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
        itemName={rejectingNeed?.nomenclature || ""}
      />
    </div>
  );
}