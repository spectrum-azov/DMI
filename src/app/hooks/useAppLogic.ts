import { useState, useEffect } from 'react';
import { TabType, IssuanceRecord, NeedRecord, RejectedRecord, DirectoryItem, Directories, DirectoryTab } from '../types';
import { DateFilter, isWithinPeriod } from '../utils/dateUtils';
import {
    mockIssuanceData, mockNeedsData, mockRejectedData, mockNomenclatures, mockTypes,
    mockDepartments, mockRanks, mockLocations
} from '../data/mockData';

export function useAppLogic() {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [dateFilter, setDateFilter] = useState<DateFilter>(() => (localStorage.getItem('global_date_filter') as DateFilter) || 'month');
    const [locationFilter, setLocationFilter] = useState<number>(() => parseInt(localStorage.getItem('global_location_filter') || '0'));

    useEffect(() => { localStorage.setItem('global_date_filter', dateFilter); }, [dateFilter]);
    useEffect(() => { localStorage.setItem('global_location_filter', locationFilter.toString()); }, [locationFilter]);

    const [issuanceData, setIssuanceData] = useState<IssuanceRecord[]>(mockIssuanceData);
    const [needsData, setNeedsData] = useState<NeedRecord[]>(mockNeedsData);
    const [rejectedData, setRejectedData] = useState<RejectedRecord[]>(mockRejectedData);

    const [nomenclatures, setNomenclatures] = useState<DirectoryItem[]>(mockNomenclatures);
    const [types, setTypes] = useState<DirectoryItem[]>(mockTypes);
    const [departments, setDepartments] = useState<DirectoryItem[]>(mockDepartments);
    const [ranks, setRanks] = useState<DirectoryItem[]>(mockRanks);
    const [locations, setLocations] = useState<DirectoryItem[]>(mockLocations);

    const directories: Directories = { nomenclatures, types, departments, locations, ranks };

    const [isDirectoriesOpen, setIsDirectoriesOpen] = useState(false);
    const [isDirectoryFormOpen, setIsDirectoryFormOpen] = useState(false);
    const [editingDirectoryItem, setEditingDirectoryItem] = useState<DirectoryItem | undefined>();

    const [isIssuanceFormOpen, setIsIssuanceFormOpen] = useState(false);
    const [isNeedFormOpen, setIsNeedFormOpen] = useState(false);
    const [isRejectedFormOpen, setIsRejectedFormOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<{ data: any; title: string; columns: any[] } | null>(null);

    const [editingIssuance, setEditingIssuance] = useState<IssuanceRecord | undefined>();
    const [editingNeed, setEditingNeed] = useState<NeedRecord | undefined>();
    const [editingRejected, setEditingRejected] = useState<RejectedRecord | undefined>();
    const [rejectingNeed, setRejectingNeed] = useState<NeedRecord | undefined>();

    const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
    const [moveTarget, setMoveTarget] = useState<RejectedRecord | undefined>();
    const [moveIssuanceTarget, setMoveIssuanceTarget] = useState<IssuanceRecord | undefined>();
    const [moveType, setMoveType] = useState<'needs' | 'issuance' | 'return-issuance'>('needs');

    const filteredNeedsCount = needsData.filter(n => isWithinPeriod(n.requestDate || '', dateFilter) && (locationFilter === 0 || n.location === locationFilter)).length;
    const filteredIssuanceCount = issuanceData.filter(i => isWithinPeriod(i.issueDate || '', dateFilter) && (locationFilter === 0 || i.location === locationFilter)).length;
    const filteredRejectedCount = rejectedData.filter(r => isWithinPeriod(r.rejectedDate || '', dateFilter) && (locationFilter === 0 || r.location === locationFilter)).length;

    const handleIssueItem = (id: number) => {
        if (confirm('Змінити статус на "Видано"?')) {
            setIssuanceData(issuanceData.map(i => i.id === id ? { ...i, status: 'Видано', issueDate: new Date().toLocaleDateString('uk-UA') } : i));
        }
    };

    const handleUpdateIssuanceStatus = (id: number, newStatus: string) => {
        setIssuanceData(issuanceData.map(i => i.id === id ? { ...i, status: newStatus, issueDate: new Date().toLocaleDateString('uk-UA') } : i));
    };

    const handleAddIssuance = (data: Omit<IssuanceRecord, 'id'>) => {
        if (editingIssuance) {
            setIssuanceData(issuanceData.map(i => i.id === editingIssuance.id ? { ...data, id: i.id } : i));
            setEditingIssuance(undefined);
        } else {
            setIssuanceData([...issuanceData, { ...data, id: Date.now() }]);
        }
    };

    const moveNeedToIssuance = (need: NeedRecord) => {
        const newIss: IssuanceRecord = {
            ...need, id: Date.now(), model: '', serialNumber: '', applicationStatus: 'В процесі',
            requestNumber: `REQ-${Date.now()}`, issueDate: new Date().toLocaleDateString('uk-UA'), status: 'На видачу',
            notes: need.notes || `Погоджено запит від ${need.requestDate}`
        };
        setIssuanceData([...issuanceData, newIss]);
        setNeedsData(needsData.filter(i => i.id !== need.id));
    };

    const moveNeedToRejected = (need: NeedRecord, reason: string) => {
        const newRej: RejectedRecord = { ...need, id: Date.now(), status: 'Відхилено', notes: reason, rejectedDate: new Date().toLocaleDateString('uk-UA') };
        setRejectedData([...rejectedData, newRej]);
        setNeedsData(needsData.filter(i => i.id !== need.id));
        setActiveTab('rejected');
    };

    const handleAddNeed = (data: Omit<NeedRecord, 'id'>) => {
        if (editingNeed) {
            const updated = { ...data, id: editingNeed.id };
            if (data.status === 'Погоджено') moveNeedToIssuance(updated as NeedRecord);
            else if (data.status === 'Відхилено') moveNeedToRejected(updated as NeedRecord, data.notes || 'Не вказано');
            else setNeedsData(needsData.map(i => i.id === editingNeed.id ? updated as NeedRecord : i));
            setEditingNeed(undefined);
        } else {
            setNeedsData([...needsData, { ...data, id: Date.now() } as NeedRecord]);
        }
    };

    const handleAddRejected = (data: Omit<RejectedRecord, 'id'>) => {
        if (editingRejected) {
            setRejectedData(rejectedData.map(i => i.id === editingRejected.id ? { ...data, id: i.id } : i));
            setEditingRejected(undefined);
        } else {
            setRejectedData([...rejectedData, { ...data, id: Date.now() }]);
        }
    };

    const handleConfirmReject = (reason: string) => {
        if (rejectingNeed) { moveNeedToRejected(rejectingNeed, reason); setRejectingNeed(undefined); }
    };

    const handleConfirmMove = (notes: string) => {
        if (moveType === 'return-issuance' && moveIssuanceTarget) {
            setIssuanceData(issuanceData.map(i => i.id === moveIssuanceTarget.id ? { ...i, status: 'На видачу', issueDate: new Date().toLocaleDateString('uk-UA'), notes: notes || i.notes } : i));
            setIsMoveDialogOpen(false); setMoveIssuanceTarget(undefined); return;
        }
        if (!moveTarget) return;
        if (moveType === 'needs') {
            setNeedsData([{ ...moveTarget, id: Date.now(), status: 'На погодженні', requestDate: new Date().toLocaleDateString('uk-UA'), notes: notes || moveTarget.notes } as NeedRecord, ...needsData]);
        } else if (moveType === 'issuance') {
            setIssuanceData([{ ...moveTarget, id: Date.now(), model: '', serialNumber: '', applicationStatus: 'В процесі', requestNumber: '', issueDate: new Date().toLocaleDateString('uk-UA'), status: 'На видачу', notes: notes || moveTarget.notes } as any, ...issuanceData]);
        }
        setRejectedData(rejectedData.filter(r => r.id !== moveTarget.id));
        setIsMoveDialogOpen(false); setMoveTarget(undefined);
    };

    const handleAddDirectoryItem = (data: Omit<DirectoryItem, 'id'>) => {
        const tab = activeTab as DirectoryTab;
        const setters: any = { 'dir-nomenclature': setNomenclatures, 'dir-types': setTypes, 'dir-departments': setDepartments, 'dir-ranks': setRanks, 'dir-locations': setLocations };
        const lists: any = { 'dir-nomenclature': nomenclatures, 'dir-types': types, 'dir-departments': departments, 'dir-ranks': ranks, 'dir-locations': locations };
        if (editingDirectoryItem) setters[tab](lists[tab].map((i: any) => i.id === editingDirectoryItem.id ? { ...data, id: i.id } : i));
        else setters[tab]([...lists[tab], { ...data, id: Date.now() }]);
    };

    return {
        activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, dateFilter, setDateFilter, locationFilter, setLocationFilter,
        issuanceData, needsData, rejectedData, directories, isDirectoriesOpen, setIsDirectoriesOpen, isDirectoryFormOpen, setIsDirectoryFormOpen,
        editingDirectoryItem, setEditingDirectoryItem, isIssuanceFormOpen, setIsIssuanceFormOpen, isNeedFormOpen, setIsNeedFormOpen,
        isRejectedFormOpen, setIsRejectedFormOpen, isRejectDialogOpen, setIsRejectDialogOpen, isDetailsModalOpen, setIsDetailsModalOpen,
        viewingRecord, setViewingRecord, editingIssuance, setEditingIssuance, editingNeed, setEditingNeed, editingRejected, setEditingRejected,
        rejectingNeed, setRejectingNeed, isMoveDialogOpen, setIsMoveDialogOpen, moveTarget, setMoveTarget, moveIssuanceTarget, setMoveIssuanceTarget,
        moveType, setMoveType, filteredNeedsCount, filteredIssuanceCount, filteredRejectedCount,
        handleIssueItem, handleUpdateIssuanceStatus, handleAddIssuance, handleAddNeed, handleAddRejected, handleConfirmReject, handleConfirmMove, handleAddDirectoryItem,
        moveNeedToIssuance, moveNeedToRejected,
        setIssuanceData, setNeedsData, setRejectedData, setNomenclatures, setTypes, setDepartments, setRanks, setLocations
    };
}
