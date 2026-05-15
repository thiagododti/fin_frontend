import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react";

interface PaginationControlsProps {
    count: number;
    page: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
}

export function PaginationControls({
    count,
    page,
    onPageChange,
    pageSize = 10,
}: PaginationControlsProps) {
    const totalPages = Math.ceil(count / pageSize);
    if (totalPages <= 1) return null;

    const start = (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, count);

    // Generate page numbers to show
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible + 2) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        const left = Math.max(2, page - 1);
        const right = Math.min(totalPages - 1, page + 1);
        if (left > 2) pages.push("ellipsis");
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < totalPages - 1) pages.push("ellipsis");
        pages.push(totalPages);
    }

    const handleClick = (e: React.MouseEvent, targetPage: number) => {
        e.preventDefault();
        onPageChange(targetPage);
    };

    return (
        <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-muted-foreground tabular-nums">
                Exibindo {start}–{end} de {count} registros
            </span>
            <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            size="icon"
                            onClick={(e) => page > 1 && handleClick(e, 1)}
                            aria-disabled={page === 1}
                            className={
                                page === 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        >
                            <ChevronsLeft className="h-3.5 w-3.5" />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            size="icon"
                            onClick={(e) =>
                                page > 1 && handleClick(e, page - 1)
                            }
                            aria-disabled={page === 1}
                            className={
                                page === 1
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        >
                            <ChevronLeft className="h-3.5 w-3.5" />
                        </PaginationLink>
                    </PaginationItem>

                    {pages.map((p, i) =>
                        p === "ellipsis" ? (
                            <PaginationItem key={`e${i}`}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        ) : (
                            <PaginationItem key={p}>
                                <PaginationLink
                                    href="#"
                                    size="icon"
                                    isActive={p === page}
                                    onClick={(e) => handleClick(e, p)}
                                    className="text-xs"
                                >
                                    {p}
                                </PaginationLink>
                            </PaginationItem>
                        ),
                    )}

                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            size="icon"
                            onClick={(e) =>
                                page < totalPages && handleClick(e, page + 1)
                            }
                            aria-disabled={page === totalPages}
                            className={
                                page === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        >
                            <ChevronRight className="h-3.5 w-3.5" />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            href="#"
                            size="icon"
                            onClick={(e) =>
                                page < totalPages && handleClick(e, totalPages)
                            }
                            aria-disabled={page === totalPages}
                            className={
                                page === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        >
                            <ChevronsRight className="h-3.5 w-3.5" />
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
