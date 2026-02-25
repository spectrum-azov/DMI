import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationFirst,
    PaginationLast,
} from './ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from './ui/select';

interface TablePaginationProps {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
}

export function TablePagination({
    totalItems,
    pageSize,
    currentPage,
    onPageChange,
    onPageSizeChange,
}: TablePaginationProps) {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1 && pageSize >= totalItems && currentPage === 1) {
        // Still show if we want to change page size even if only 1 page currently
        // But if total items are less than minimum page size (10), maybe hide?
        // Actually, user might want to see the selector.
    }

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    // Show a restricted range of pages if there are too many
    const getVisiblePages = () => {
        if (totalPages <= 7) return pages;

        const range: (number | string)[] = [];
        range.push(1);

        if (currentPage > 3) range.push('...');

        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);

        for (let i = start; i <= end; i++) {
            range.push(i);
        }

        if (currentPage < totalPages - 2) range.push('...');

        range.push(totalPages);
        return range;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-white p-3 border border-gray-100 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-600 order-2 sm:order-1">
                <span className="hidden sm:inline">Показувати по:</span>
                <Select
                    value={String(pageSize)}
                    onValueChange={(val) => onPageSizeChange(Number(val))}
                >
                    <SelectTrigger className="w-[75px] h-9 bg-gray-50 border-gray-200">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                </Select>
                <span className="hidden sm:inline">записів</span>
            </div>

            <Pagination className="w-auto mx-0 order-1 sm:order-2">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationFirst
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(1);
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer hover:bg-gray-100'}
                            href="#"
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationPrevious
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage > 1) onPageChange(currentPage - 1);
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-40' : 'cursor-pointer hover:bg-gray-100'}
                            href="#"
                        />
                    </PaginationItem>

                    {visiblePages.map((page, idx) => (
                        <PaginationItem key={idx}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-gray-400">...</span>
                            ) : (
                                <PaginationLink
                                    isActive={page === currentPage}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onPageChange(page as number);
                                    }}
                                    className="cursor-pointer hover:bg-gray-100"
                                    href="#"
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(currentPage + 1);
                            }}
                            className={currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-40' : 'cursor-pointer hover:bg-gray-100'}
                            href="#"
                        />
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLast
                            onClick={(e) => {
                                e.preventDefault();
                                if (currentPage < totalPages) onPageChange(totalPages);
                            }}
                            className={currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-40' : 'cursor-pointer hover:bg-gray-100'}
                            href="#"
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>

            <div className="text-sm text-gray-500 font-medium order-3">
                Всього: <span className="text-gray-900">{totalItems}</span>
            </div>
        </div>
    );
}
