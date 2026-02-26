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
  Sun,
  Moon,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Users,
  Briefcase,
  Layers,
  MapPin,
  Tag,
  Star
} from 'lucide-react';
import { ThemeProvider } from 'next-themes';
import { ThemeToggle } from './components/ui/theme-toggle';
import { DataTable } from './components/DataTable';
import { NeedsDataTable } from './components/NeedsDataTable';
import { IssuanceDataTable } from './components/IssuanceDataTable';
import { IssuanceForm } from './components/IssuanceForm';
import { NeedForm } from './components/NeedForm';
import { RejectedForm } from './components/RejectedForm';
import { RejectDialog } from './components/RejectDialog';
import { DetailsModal } from './components/DetailsModal';
import { MoveDialog } from './components/MoveDialog';
import { Dashboard } from './components/Dashboard';
import { IssuanceRecord, NeedRecord, RejectedRecord, Directories } from './types';
import {
  mockIssuanceData,
  mockNeedsData,
  mockRejectedData,
  mockNomenclatures,
  mockTypes,
  mockPositions,
  mockDepartments,
  mockRanks,
  mockLocations
} from './data/mockData';
import { DirectoryForm } from './components/DirectoryForm';
import { DirectoryItem } from './types';
import { QuickDateFilter } from './components/QuickDateFilter';
import { LocationFilter } from './components/LocationFilter';
import { DateFilter, isWithinPeriod } from './utils/dateUtils';
import { useEffect } from 'react';

import { StatusGraph } from './components/StatusGraph';
import { issuanceColumns, needsColumns, rejectedColumns } from './constants/columns';

type DirectoryTab = 'dir-nomenclature' | 'dir-types' | 'dir-positions' | 'dir-departments' | 'dir-ranks' | 'dir-locations';
type TabType = 'dashboard' | 'issuance' | 'needs' | 'rejected' | 'status-graph' | DirectoryTab;

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>(() => {
    const saved = localStorage.getItem('global_date_filter');
    return (saved as DateFilter) || 'month';
  });

  const [locationFilter, setLocationFilter] = useState<number>(() => {
    const saved = localStorage.getItem('global_location_filter');
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('global_date_filter', dateFilter);
  }, [dateFilter]);

  useEffect(() => {
    localStorage.setItem('global_location_filter', locationFilter.toString());
  }, [locationFilter]);


  // State for each data type
  const [issuanceData, setIssuanceData] =
    useState<IssuanceRecord[]>(mockIssuanceData);
  const [needsData, setNeedsData] = useState<NeedRecord[]>(mockNeedsData);
  const [rejectedData, setRejectedData] =
    useState<RejectedRecord[]>(mockRejectedData);

  // Directory state
  const [nomenclatures, setNomenclatures] = useState<DirectoryItem[]>(mockNomenclatures);
  const [types, setTypes] = useState<DirectoryItem[]>(mockTypes);
  const [positions, setPositions] = useState<DirectoryItem[]>(mockPositions);
  const [departments, setDepartments] = useState<DirectoryItem[]>(mockDepartments);
  const [ranks, setRanks] = useState<DirectoryItem[]>(mockRanks);
  const [locations, setLocations] = useState<DirectoryItem[]>(mockLocations);

  const directories: Directories = {
    nomenclatures,
    types,
    departments,
    locations,
    positions,
    ranks
  };

  const [isDirectoriesOpen, setIsDirectoriesOpen] = useState(false);
  const [isDirectoryFormOpen, setIsDirectoryFormOpen] = useState(false);
  const [editingDirectoryItem, setEditingDirectoryItem] = useState<DirectoryItem | undefined>();

  // Filtered counts for sidebar
  const filteredNeedsCount = needsData.filter((n) =>
    isWithinPeriod(n.requestDate || '', dateFilter) && (locationFilter === 0 || n.location === locationFilter),
  ).length;
  const filteredIssuanceCount = issuanceData.filter((i) =>
    isWithinPeriod(i.issueDate || '', dateFilter) && (locationFilter === 0 || i.location === locationFilter),
  ).length;
  const filteredRejectedCount = rejectedData.filter((r) =>
    isWithinPeriod(r.rejectedDate || '', dateFilter) && (locationFilter === 0 || r.location === locationFilter),
  ).length;

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

  // Move states
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<RejectedRecord | undefined>();
  const [moveIssuanceTarget, setMoveIssuanceTarget] = useState<IssuanceRecord | undefined>();
  const [moveType, setMoveType] = useState<'needs' | 'issuance' | 'return-issuance'>('needs');

  // Handlers for Issuance
  const handleAddIssuance = (data: Omit<IssuanceRecord, 'id'>) => {
    if (editingIssuance) {
      const updatedRecord = { ...data, id: editingIssuance.id };

      setIssuanceData(
        issuanceData.map((item) =>
          item.id === editingIssuance.id ? updatedRecord : item,
        ),
      );
      setEditingIssuance(undefined);
    } else {
      const newRecord: IssuanceRecord = {
        ...data,
        id: Date.now(),
      };

      setIssuanceData([...issuanceData, newRecord]);
    }
  };

  const handleEditIssuance = (item: IssuanceRecord) => {
    setEditingIssuance(item);
    setIsIssuanceFormOpen(true);
  };

  const handleDeleteIssuance = (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      setIssuanceData(issuanceData.filter((item) => item.id !== id));
    }
  };

  const handleIssueItem = (id: number) => {
    if (confirm('Змінити статус на "Видано"?')) {
      setIssuanceData(
        issuanceData.map((item) =>
          item.id === id ? { ...item, status: 'Видано', issueDate: new Date().toLocaleDateString('uk-UA') } : item,
        ),
      );
    }
  };

  const handleUpdateIssuanceStatus = (id: number, newStatus: string) => {
    const item = issuanceData.find((i) => i.id === id);
    if (!item) return;

    // No longer moving to needs automatically, keeping in Issuance for the new 'Відміна' tab

    setIssuanceData(
      issuanceData.map((i) =>
        i.id === id ? { ...i, status: newStatus, issueDate: new Date().toLocaleDateString('uk-UA') } : i,
      ),
    );
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
        id: Date.now(),
      };
      setNeedsData([...needsData, newRecord]);
    }
  };

  const handleEditNeed = (item: NeedRecord) => {
    setEditingNeed(item);
    setIsNeedFormOpen(true);
  };

  const handleDeleteNeed = (id: number) => {
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
      id: Date.now(),
      nomenclature: need.nomenclature,
      type: need.type,
      quantity: need.quantity,
      model: '',
      serialNumber: '',
      fullName: need.fullName,
      rank: need.rank,
      position: need.position,
      department: need.department,
      mobileNumber: need.mobileNumber,
      applicationStatus: 'В процесі',
      requestNumber: `REQ-${Date.now()}`,
      issueDate: new Date().toLocaleDateString('uk-UA'),
      location: need.location,
      status: 'На видачу',
      notes: need.notes || `Погоджено запит від ${need.requestDate}`,
      isFrtCp: need.isFrtCp,
      frpFullName: need.frpFullName,
      frpRank: need.frpRank,
      frpPosition: need.frpPosition,
      frpMobileNumber: need.frpMobileNumber,
    };

    setIssuanceData([...issuanceData, newIssuance]);
    setNeedsData(needsData.filter((item) => item.id !== need.id));
  };


  // Функція переміщення з видачі назад у потреби (при скасуванні)
  const moveIssuanceToNeeds = (issuance: IssuanceRecord) => {
    const newNeed: NeedRecord = {
      id: Date.now(),
      nomenclature: issuance.nomenclature,
      type: issuance.type,
      quantity: issuance.quantity,
      fullName: issuance.fullName,
      rank: issuance.rank,
      position: issuance.position,
      department: issuance.department,
      mobileNumber: issuance.mobileNumber,
      requestDate: new Date().toLocaleDateString('uk-UA'),
      location: issuance.location,
      status: 'В обробці',
      notes: issuance.notes || `Повернено з видачі (Відміна). Раніше було: ${issuance.requestNumber}`,
      isFrtCp: issuance.isFrtCp,
      frpFullName: issuance.frpFullName,
      frpRank: issuance.frpRank,
      frpPosition: issuance.frpPosition,
      frpMobileNumber: issuance.frpMobileNumber,
    };

    setNeedsData([...needsData, newNeed]);
    setIssuanceData(issuanceData.filter((item) => item.id !== issuance.id));
    setActiveTab('needs');
  };

  // Функція переміщення з потреб у відхилені
  const moveNeedToRejected = (need: NeedRecord, reason: string) => {
    const newRejected: RejectedRecord = {
      id: Date.now(),
      nomenclature: need.nomenclature,
      type: need.type,
      quantity: need.quantity,
      fullName: need.fullName,
      rank: need.rank,
      position: need.position,
      department: need.department,
      mobileNumber: need.mobileNumber,
      status: 'Відхилено',
      notes: reason,
      location: need.location,
      rejectedDate: new Date().toLocaleDateString('uk-UA'),
      isFrtCp: need.isFrtCp,
      frpFullName: need.frpFullName,
      frpRank: need.frpRank,
      frpPosition: need.frpPosition,
      frpMobileNumber: need.frpMobileNumber,
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
        id: Date.now(),
      };
      setRejectedData([...rejectedData, newRecord]);
    }
  };

  const handleEditRejected = (item: RejectedRecord) => {
    setEditingRejected(item);
    setIsRejectedFormOpen(true);
  };

  const handleDeleteRejected = (id: number) => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      setRejectedData(rejectedData.filter((item) => item.id !== id));
    }
  };

  const handleMoveRejectedToNeeds = (item: RejectedRecord) => {
    setMoveTarget(item);
    setMoveType('needs');
    setIsMoveDialogOpen(true);
  };

  const handleMoveRejectedToIssuance = (item: RejectedRecord) => {
    setMoveTarget(item);
    setMoveType('issuance');
    setIsMoveDialogOpen(true);
  };

  const handleMoveCancelledToIssuance = (item: IssuanceRecord) => {
    setMoveIssuanceTarget(item);
    setMoveType('return-issuance');
    setIsMoveDialogOpen(true);
  };

  const handleConfirmMove = (notes: string) => {
    if (moveType === 'return-issuance') {
      if (!moveIssuanceTarget) return;
      setIssuanceData(
        issuanceData.map((i) =>
          i.id === moveIssuanceTarget.id
            ? { ...i, status: 'На видачу', issueDate: new Date().toLocaleDateString('uk-UA'), notes: notes || i.notes }
            : i,
        ),
      );
      setIsMoveDialogOpen(false);
      setMoveIssuanceTarget(undefined);
      return;
    }

    if (!moveTarget) return;

    if (moveType === 'needs') {
      const newNeed: NeedRecord = {
        id: Date.now(),
        nomenclature: moveTarget.nomenclature,
        type: moveTarget.type,
        quantity: moveTarget.quantity,
        fullName: moveTarget.fullName,
        rank: moveTarget.rank,
        position: moveTarget.position,
        department: moveTarget.department,
        mobileNumber: moveTarget.mobileNumber,
        requestDate: new Date().toLocaleDateString('uk-UA'),
        location: moveTarget.location,
        status: 'На погодженні',
        notes: notes || moveTarget.notes,
        isFrtCp: moveTarget.isFrtCp,
        frpFullName: moveTarget.frpFullName,
        frpRank: moveTarget.frpRank,
        frpPosition: moveTarget.frpPosition,
        frpMobileNumber: moveTarget.frpMobileNumber,
      };
      setNeedsData([newNeed, ...needsData]);
    } else if (moveType === 'issuance') {
      const newIssuance: IssuanceRecord = {
        id: Date.now(),
        nomenclature: moveTarget.nomenclature,
        type: moveTarget.type,
        quantity: moveTarget.quantity,
        model: '',
        serialNumber: '',
        fullName: moveTarget.fullName,
        rank: moveTarget.rank,
        position: moveTarget.position,
        department: moveTarget.department,
        mobileNumber: moveTarget.mobileNumber,
        applicationStatus: 'В процесі',
        requestNumber: '',
        issueDate: new Date().toLocaleDateString('uk-UA'),
        location: moveTarget.location,
        status: 'На видачу',
        notes: notes || moveTarget.notes,
        isFrtCp: moveTarget.isFrtCp,
        frpFullName: moveTarget.frpFullName,
        frpRank: moveTarget.frpRank,
        frpPosition: moveTarget.frpPosition,
        frpMobileNumber: moveTarget.frpMobileNumber,
      };
      setIssuanceData([newIssuance, ...issuanceData]);
    }

    setRejectedData(rejectedData.filter((r) => r.id !== moveTarget.id));
    setIsMoveDialogOpen(false);
    setMoveTarget(undefined);
  };

  // Directory handlers
  const handleAddDirectoryItem = (data: Omit<DirectoryItem, 'id'>) => {
    const list = getDirectoryList(activeTab as DirectoryTab);
    const setList = getDirectorySetter(activeTab as DirectoryTab);

    if (editingDirectoryItem) {
      setList(list.map(item => item.id === editingDirectoryItem.id ? { ...data, id: item.id } : item));
      setEditingDirectoryItem(undefined);
    } else {
      setList([...list, { ...data, id: Date.now() }]);
    }
  };

  const handleEditDirectoryItem = (item: DirectoryItem) => {
    setEditingDirectoryItem(item);
    setIsDirectoryFormOpen(true);
  };

  const handleDeleteDirectoryItem = (id: number, list: DirectoryItem[], setList: (list: DirectoryItem[]) => void) => {
    if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
      setList(list.filter(item => item.id !== id));
    }
  };

  const getDirectoryList = (tab: DirectoryTab): DirectoryItem[] => {
    switch (tab) {
      case 'dir-nomenclature': return nomenclatures;
      case 'dir-types': return types;
      case 'dir-positions': return positions;
      case 'dir-departments': return departments;
      case 'dir-ranks': return ranks;
      case 'dir-locations': return locations;
      default: return [];
    }
  };

  const getDirectorySetter = (tab: DirectoryTab) => {
    switch (tab) {
      case 'dir-nomenclature': return setNomenclatures;
      case 'dir-types': return setTypes;
      case 'dir-positions': return setPositions;
      case 'dir-departments': return setDepartments;
      case 'dir-ranks': return setRanks;
      case 'dir-locations': return setLocations;
      default: return () => { };
    }
  };

  const getDirectoryTitle = (tab: DirectoryTab) => {
    switch (tab) {
      case 'dir-nomenclature': return 'Номенклатури';
      case 'dir-types': return 'Типи';
      case 'dir-positions': return 'Посади';
      case 'dir-departments': return 'Служби';
      case 'dir-ranks': return 'Звання';
      case 'dir-locations': return 'Локації';
      default: return '';
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



  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    setIsIssuanceFormOpen(false);
    setIsNeedFormOpen(false);
    setIsRejectedFormOpen(false);
    setIsRejectDialogOpen(false);
    setIsMoveDialogOpen(false);
    setIsDirectoryFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div className="md:hidden bg-card border-b border-border p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="text-blue-600" size={24} />
          <h1 className="text-lg font-bold text-foreground leading-tight">
            Система обліку <br /> обладнання
          </h1>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 bg-muted rounded-lg text-muted-foreground hover:bg-accent"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside
        className={`${isMobileMenuOpen ? 'block' : 'hidden'
          } md:block w-full md:w-64 bg-card border-r border-border flex-shrink-0 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-20`}
      >
        <div className="hidden md:flex items-center gap-3 p-6 border-b border-border">
          <FileSpreadsheet className="text-blue-600 flex-shrink-0" size={32} />
          <div>
            <h1 className="text-lg font-bold text-foreground leading-tight">
              Система обліку <br /> обладнання
            </h1>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleTabChange('dashboard')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
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
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} />
              Потреба
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'needs'
                ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                : 'bg-muted text-muted-foreground'
                }`}
            >
              {filteredNeedsCount} / {needsData.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('issuance')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'issuance'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <div className="flex items-center gap-3">
              <Package size={20} />
              Видача
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'issuance'
                ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                : 'bg-muted text-muted-foreground'
                }`}
            >
              {filteredIssuanceCount} / {issuanceData.length}
            </span>
          </button>

          <button
            onClick={() => handleTabChange('rejected')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'rejected'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
          >
            <div className="flex items-center gap-3">
              <XCircle size={20} />
              Відхилені
            </div>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'rejected'
                ? 'bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                : 'bg-muted text-muted-foreground'
                }`}
            >
              {filteredRejectedCount} / {rejectedData.length}
            </span>
          </button>

          <div className="pt-2">
            <button
              onClick={() => setIsDirectoriesOpen(!isDirectoriesOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <div className="flex items-center gap-3">
                <BookOpen size={20} />
                Довідники
              </div>
              {isDirectoriesOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {isDirectoriesOpen && (
              <div className="mt-1 ml-4 space-y-1 border-l-2 border-muted pl-2">
                {[
                  { id: 'dir-nomenclature', label: 'Номенклатури', icon: Tag },
                  { id: 'dir-types', label: 'Типи', icon: Layers },
                  { id: 'dir-positions', label: 'Посади', icon: Briefcase },
                  { id: 'dir-departments', label: 'Служби', icon: Users },
                  { id: 'dir-ranks', label: 'Звання', icon: Star },
                  { id: 'dir-locations', label: 'Локації', icon: MapPin },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as TabType)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${activeTab === item.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border space-y-2">
            <ThemeToggle />
            <button
              onClick={() => handleTabChange('status-graph')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'status-graph'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <div className="flex items-center gap-3">
                <FileText size={20} />
                Граф статусів
              </div>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full max-w-full overflow-hidden">
        <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
          <div className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {activeTab === 'dashboard' && 'Панель управління'}
                  {activeTab === 'needs' && 'Потреби в обладнанні'}
                  {activeTab === 'issuance' && 'Видача обладнання'}
                  {activeTab === 'rejected' && 'Відхилені запити'}
                  {activeTab === 'status-graph' && 'Графік переходів статусів'}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {activeTab === 'dashboard' && 'Огляд системи обліку обладнання'}
                  {activeTab === 'needs' && 'Управління запитами на нове обладнання'}
                  {activeTab === 'issuance' && 'Облік виданого обладнання та черга на видачу'}
                  {activeTab === 'rejected' && 'Історія відхилених потреб'}
                  {activeTab === 'status-graph' && 'Візуалізація життєвого циклу обладнання'}
                  {activeTab.startsWith('dir-') && `Управління довідником: ${getDirectoryTitle(activeTab as DirectoryTab)}`}
                </p>
              </div>
              {activeTab !== 'status-graph' && !activeTab.startsWith('dir-') && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <LocationFilter
                    value={locationFilter}
                    options={locations}
                    onChange={setLocationFilter}
                  />
                  <QuickDateFilter value={dateFilter} onChange={setDateFilter} />
                </div>
              )}
            </div>

            {activeTab === 'dashboard' && (
              <Dashboard
                needsData={needsData}
                issuanceData={issuanceData}
                rejectedData={rejectedData}
                dateFilter={dateFilter}
                locationFilter={locationFilter}
                directories={directories}
                onRowClick={handleRowClick}
              />
            )}

            {activeTab === 'needs' && (
              <NeedsDataTable
                data={needsData}
                columns={needsColumns}
                onEdit={handleEditNeed}
                onDelete={handleDeleteNeed}
                onApprove={handleApproveNeed}
                onReject={handleRejectNeed}
                onRowClick={(item) => handleRowClick(item, 'needs')}
                dateFilter={dateFilter}
                locationFilter={locationFilter}
                onAdd={() => setIsNeedFormOpen(true)}
                directories={directories}
              />
            )}

            {activeTab === 'issuance' && (
              <div className="space-y-4">
                <IssuanceDataTable
                  data={issuanceData}
                  columns={issuanceColumns}
                  onEdit={handleEditIssuance}
                  onDelete={handleDeleteIssuance}
                  onIssue={handleIssueItem}
                  onStatusChange={handleUpdateIssuanceStatus}
                  onReturnToIssuance={handleMoveCancelledToIssuance}
                  onRowClick={(item) => handleRowClick(item, 'issuance')}
                  dateFilter={dateFilter}
                  locationFilter={locationFilter}
                  directories={directories}
                />
              </div>
            )}

            {activeTab === 'rejected' && (
              <div className="space-y-4">
                <DataTable
                  data={rejectedData}
                  columns={rejectedColumns}
                  onEdit={handleEditRejected}
                  onDelete={handleDeleteRejected}
                  onMoveToNeeds={handleMoveRejectedToNeeds}
                  onMoveToIssuance={handleMoveRejectedToIssuance}
                  onRowClick={(item) => handleRowClick(item, 'rejected')}
                  dateField="rejectedDate"
                  emptyMessage="Немає відхилених запитів"
                  dateFilter={dateFilter}
                  locationFilter={locationFilter}
                  directories={directories}
                  storageKey="rejected_visible_columns"
                />
              </div>
            )}

            {activeTab.startsWith('dir-') && (
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">{getDirectoryTitle(activeTab as DirectoryTab)}</h3>
                  <button
                    onClick={() => {
                      setEditingDirectoryItem(undefined);
                      setIsDirectoryFormOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <Plus size={18} />
                    Додати
                  </button>
                </div>
                <DataTable
                  data={getDirectoryList(activeTab as DirectoryTab)}
                  columns={[{ key: 'name', label: 'Назва' }]}
                  onEdit={handleEditDirectoryItem}
                  onDelete={(id) => handleDeleteDirectoryItem(id, getDirectoryList(activeTab as DirectoryTab), getDirectorySetter(activeTab as DirectoryTab))}
                  dateFilter={dateFilter}
                  storageKey={`${activeTab}_visible_columns`}
                />
              </div>
            )}

            {activeTab === 'status-graph' && <StatusGraph />}
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
        directories={directories}
      />

      <NeedForm
        isOpen={isNeedFormOpen}
        onClose={() => {
          setIsNeedFormOpen(false);
          setEditingNeed(undefined);
        }}
        onSubmit={handleAddNeed}
        editData={editingNeed}
        directories={directories}
      />

      <RejectedForm
        isOpen={isRejectedFormOpen}
        onClose={() => {
          setIsRejectedFormOpen(false);
          setEditingRejected(undefined);
        }}
        onSubmit={handleAddRejected}
        editData={editingRejected}
        directories={directories}
      />

      <RejectDialog
        isOpen={isRejectDialogOpen}
        onClose={() => {
          setIsRejectDialogOpen(false);
          setRejectingNeed(undefined);
        }}
        onConfirm={handleConfirmReject}
        itemName={directories.nomenclatures.find(d => d.id === rejectingNeed?.nomenclature)?.name || ''}
      />

      <DetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title={viewingRecord?.title || ''}
        data={viewingRecord?.data}
        columns={viewingRecord?.columns || []}
        directories={directories}
      />

      <MoveDialog
        isOpen={isMoveDialogOpen}
        onClose={() => setIsMoveDialogOpen(false)}
        onConfirm={handleConfirmMove}
        title={moveType === 'needs' ? 'Повернення в потреби' : moveType === 'issuance' ? 'Переніс у видачу' : 'Повернення до видачі'}
        description={moveType === 'needs' ? 'Запис буде повернено до списку потреб' : moveType === 'issuance' ? 'Запис буде перенесено в чергу на видачу' : 'Запис буде повернено до черги на видачу'}
        itemName={moveType === 'return-issuance' ? (directories.nomenclatures.find(d => d.id === moveIssuanceTarget?.nomenclature)?.name || '') : (directories.nomenclatures.find(d => d.id === moveTarget?.nomenclature)?.name || '')}
        initialNotes={moveType === 'return-issuance' ? moveIssuanceTarget?.notes : moveTarget?.notes}
      />

      <DirectoryForm
        isOpen={isDirectoryFormOpen}
        onClose={() => {
          setIsDirectoryFormOpen(false);
          setEditingDirectoryItem(undefined);
        }}
        onSubmit={handleAddDirectoryItem}
        editData={editingDirectoryItem}
        title={activeTab.startsWith('dir-') ? getDirectoryTitle(activeTab as DirectoryTab) : ''}
      />
    </div>
  );
}