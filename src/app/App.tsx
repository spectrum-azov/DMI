import { ThemeProvider } from 'next-themes';
import { Plus } from 'lucide-react';
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
import { DirectoryTab } from './types';
import { DirectoryForm } from './components/DirectoryForm';
import { QuickDateFilter } from './components/QuickDateFilter';
import { LocationFilter } from './components/LocationFilter';
import { StatusGraph } from './components/StatusGraph';
import { issuanceColumns, needsColumns, rejectedColumns } from './constants/columns';
import { AppSidebar } from './components/AppSidebar';
import { useAppLogic } from './hooks/useAppLogic';

export default function App() {
  const logic = useAppLogic();
  const {
    activeTab, setActiveTab, issuanceData, needsData, rejectedData, directories, dateFilter, locationFilter,
    isMobileMenuOpen, setIsMobileMenuOpen, isDirectoriesOpen, setIsDirectoriesOpen,
    isIssuanceFormOpen, setIsIssuanceFormOpen, isNeedFormOpen, setIsNeedFormOpen,
    isRejectedFormOpen, setIsRejectedFormOpen, isRejectDialogOpen, setIsRejectDialogOpen,
    isDetailsModalOpen, setIsDetailsModalOpen, isDirectoryFormOpen, setIsDirectoryFormOpen,
    viewingRecord, setViewingRecord, editingIssuance, setEditingIssuance,
    editingNeed, setEditingNeed, editingRejected, setEditingRejected,
    rejectingNeed, setRejectingNeed, isMoveDialogOpen, setIsMoveDialogOpen,
    moveType, setMoveType, moveTarget, setMoveTarget, moveIssuanceTarget, setMoveIssuanceTarget,
    filteredNeedsCount, filteredIssuanceCount, filteredRejectedCount,
    handleIssueItem, handleUpdateIssuanceStatus, handleAddIssuance, handleAddNeed, handleAddRejected,
    handleConfirmReject, handleConfirmMove, handleAddDirectoryItem,
    setIssuanceData, setNeedsData, setRejectedData, setNomenclatures, setTypes, setDepartments, setRanks, setLocations
  } = logic;

  const handleTabChange = (tab: any) => {
    setActiveTab(tab); setIsMobileMenuOpen(false); setIsIssuanceFormOpen(false);
    setIsNeedFormOpen(false); setIsRejectedFormOpen(false); setIsRejectDialogOpen(false);
    setIsMoveDialogOpen(false); setIsDirectoryFormOpen(false);
  };

  const handleRowClick = (item: any, type: string) => {
    const config: any = { needs: { title: 'Деталі запиту', cols: needsColumns }, issuance: { title: 'Деталі видачі', cols: issuanceColumns }, rejected: { title: 'Деталі відхиленого', cols: rejectedColumns } };
    setViewingRecord({ data: item, title: config[type].title, columns: config[type].cols });
    setIsDetailsModalOpen(true);
  };

  const getDirInfo = (tab: DirectoryTab) => {
    const titles: any = { 'dir-nomenclature': 'Номенклатури', 'dir-types': 'Типи', 'dir-departments': 'Служби', 'dir-ranks': 'Звання', 'dir-locations': 'Локації' };
    const lists: any = { 'dir-nomenclature': directories.nomenclatures, 'dir-types': directories.types, 'dir-departments': directories.departments, 'dir-ranks': directories.ranks, 'dir-locations': directories.locations };
    const setters: any = { 'dir-nomenclature': setNomenclatures, 'dir-types': setTypes, 'dir-departments': setDepartments, 'dir-ranks': setRanks, 'dir-locations': setLocations };
    return { title: titles[tab], list: lists[tab], set: setters[tab] };
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
        <AppSidebar activeTab={activeTab} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} isDirectoriesOpen={isDirectoriesOpen} setIsDirectoriesOpen={setIsDirectoriesOpen} handleTabChange={handleTabChange} filteredNeedsCount={filteredNeedsCount} needsCount={needsData.length} filteredIssuanceCount={filteredIssuanceCount} issuanceCount={issuanceData.length} filteredRejectedCount={filteredRejectedCount} rejectedCount={rejectedData.length} />
        <main className="flex-1 w-full max-w-full overflow-hidden">
          <div className="p-4 md:p-8 w-full max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-xl shadow-sm p-4 md:p-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                <div><h1 className="text-2xl font-bold text-foreground">{activeTab === 'dashboard' ? 'Панель управління' : activeTab === 'needs' ? 'Потреби' : activeTab === 'issuance' ? 'Видача' : activeTab === 'rejected' ? 'Відхилені' : activeTab === 'status-graph' ? 'Графік' : `Довідник: ${getDirInfo(activeTab as DirectoryTab).title}`}</h1></div>
                {!activeTab.startsWith('dir-') && activeTab !== 'status-graph' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <LocationFilter value={locationFilter} options={directories.locations} onChange={logic.setLocationFilter} />
                    <QuickDateFilter value={dateFilter} onChange={logic.setDateFilter} />
                  </div>
                )}
              </div>

              {activeTab === 'dashboard' && <Dashboard needsData={needsData} issuanceData={issuanceData} rejectedData={rejectedData} dateFilter={dateFilter} locationFilter={locationFilter} directories={directories} onRowClick={handleRowClick} />}
              {activeTab === 'needs' && <NeedsDataTable data={needsData} columns={needsColumns} onEdit={(i) => { setEditingNeed(i); setIsNeedFormOpen(true); }} onDelete={(id) => confirm('Видалити?') && setNeedsData(needsData.filter(i => i.id !== id))} onApprove={(n) => confirm('Погодити?') && logic.moveNeedToIssuance(n)} onReject={(n) => { setRejectingNeed(n); setIsRejectDialogOpen(true); }} onRowClick={(item) => handleRowClick(item, 'needs')} dateFilter={dateFilter} locationFilter={locationFilter} onAdd={() => setIsNeedFormOpen(true)} directories={directories} />}
              {activeTab === 'issuance' && <IssuanceDataTable data={issuanceData} columns={issuanceColumns} onEdit={(i) => { setEditingIssuance(i); setIsIssuanceFormOpen(true); }} onDelete={(id) => confirm('Видалити?') && setIssuanceData(issuanceData.filter(i => i.id !== id))} onIssue={handleIssueItem} onStatusChange={handleUpdateIssuanceStatus} onReturnToIssuance={(item) => { setMoveIssuanceTarget(item); setMoveType('return-issuance'); setIsMoveDialogOpen(true); }} onRowClick={(item) => handleRowClick(item, 'issuance')} dateFilter={dateFilter} locationFilter={locationFilter} directories={directories} />}
              {activeTab === 'rejected' && <DataTable data={rejectedData} columns={rejectedColumns} onEdit={(i) => { setEditingRejected(i); setIsRejectedFormOpen(true); }} onDelete={(id) => confirm('Видалити?') && setRejectedData(rejectedData.filter(i => i.id !== id))} onMoveToNeeds={(i) => { setMoveTarget(i); setMoveType('needs'); setIsMoveDialogOpen(true); }} onMoveToIssuance={(i) => { setMoveTarget(i); setMoveType('issuance'); setIsMoveDialogOpen(true); }} onRowClick={(item) => handleRowClick(item, 'rejected')} dateField="rejectedDate" emptyMessage="Немає відхилених" dateFilter={dateFilter} locationFilter={locationFilter} directories={directories} storageKey="rejected_visible_columns" />}
              {activeTab.startsWith('dir-') && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-muted/20 p-4 rounded-lg"><h3 className="font-semibold text-lg">{getDirInfo(activeTab as DirectoryTab).title}</h3><button onClick={() => { logic.setEditingDirectoryItem(undefined); setIsDirectoryFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus size={18} />Додати</button></div>
                  <DataTable data={getDirInfo(activeTab as DirectoryTab).list} columns={[{ key: 'name', label: 'Назва' }]} onEdit={(i) => { logic.setEditingDirectoryItem(i); setIsDirectoryFormOpen(true); }} onDelete={(id) => confirm('Видалити?') && getDirInfo(activeTab as DirectoryTab).set(getDirInfo(activeTab as DirectoryTab).list.filter((i: any) => i.id !== id))} dateFilter={dateFilter} storageKey={`${activeTab}_visible_columns`} />
                </div>
              )}
              {activeTab === 'status-graph' && <StatusGraph />}
            </div>
          </div>
        </main>

        <IssuanceForm isOpen={isIssuanceFormOpen} onClose={() => { setIsIssuanceFormOpen(false); setEditingIssuance(undefined); }} onSubmit={handleAddIssuance} editData={editingIssuance} directories={directories} />
        <NeedForm isOpen={isNeedFormOpen} onClose={() => { setIsNeedFormOpen(false); setEditingNeed(undefined); }} onSubmit={handleAddNeed} editData={editingNeed} directories={directories} />
        <RejectedForm isOpen={isRejectedFormOpen} onClose={() => { setIsRejectedFormOpen(false); setEditingRejected(undefined); }} onSubmit={handleAddRejected} editData={editingRejected} directories={directories} />
        <RejectDialog isOpen={isRejectDialogOpen} onClose={() => { setIsRejectDialogOpen(false); setRejectingNeed(undefined); }} onConfirm={handleConfirmReject} itemName={directories.nomenclatures.find(d => d.id === rejectingNeed?.nomenclature)?.name || ''} />
        <DetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} title={viewingRecord?.title || ''} data={viewingRecord?.data} columns={viewingRecord?.columns || []} directories={directories} />
        <MoveDialog isOpen={isMoveDialogOpen} onClose={() => setIsMoveDialogOpen(false)} onConfirm={handleConfirmMove} title={moveType === 'needs' ? 'Повернення в потреби' : moveType === 'issuance' ? 'Переніс у видачу' : 'Повернення до видачі'} description={moveType === 'needs' ? 'Запис буде повернено до списку потреб' : moveType === 'issuance' ? 'Запис буде перенесено в чергу на видачу' : 'Запис буде повернено до черги на видачу'} itemName={moveType === 'return-issuance' ? (directories.nomenclatures.find(d => d.id === moveIssuanceTarget?.nomenclature)?.name || '') : (directories.nomenclatures.find(d => d.id === moveTarget?.nomenclature)?.name || '')} initialNotes={moveType === 'return-issuance' ? moveIssuanceTarget?.notes : moveTarget?.notes} />
        <DirectoryForm isOpen={isDirectoryFormOpen} onClose={() => { setIsDirectoryFormOpen(false); logic.setEditingDirectoryItem(undefined); }} onSubmit={handleAddDirectoryItem} editData={logic.editingDirectoryItem} title={activeTab.startsWith('dir-') ? getDirInfo(activeTab as DirectoryTab).title : ''} />
      </div>
    </ThemeProvider>
  );
}