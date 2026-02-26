import {
    FileSpreadsheet,
    Package,
    AlertCircle,
    XCircle,
    LayoutDashboard,
    Menu,
    X,
    FileText,
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
import { ThemeToggle } from './ui/theme-toggle';
import { TabType, DirectoryItem } from '../types';

interface SidebarProps {
    activeTab: TabType;
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: (open: boolean) => void;
    isDirectoriesOpen: boolean;
    setIsDirectoriesOpen: (open: boolean) => void;
    handleTabChange: (tab: TabType) => void;
    filteredNeedsCount: number;
    needsCount: number;
    filteredIssuanceCount: number;
    issuanceCount: number;
    filteredRejectedCount: number;
    rejectedCount: number;
}

export function AppSidebar({
    activeTab,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isDirectoriesOpen,
    setIsDirectoriesOpen,
    handleTabChange,
    filteredNeedsCount,
    needsCount,
    filteredIssuanceCount,
    issuanceCount,
    filteredRejectedCount,
    rejectedCount,
}: SidebarProps) {
    return (
        <>
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
                            {filteredNeedsCount} / {needsCount}
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
                            {filteredIssuanceCount} / {issuanceCount}
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
                            {filteredRejectedCount} / {rejectedCount}
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
        </>
    );
}
