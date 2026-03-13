import type { Pagination as PaginationType } from "@commercengine/storefront";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
}

function getPageNumbers(
  totalPages: number,
  currentPage: number
): (number | { type: "ellipsis"; id: "start" | "end" })[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | { type: "ellipsis"; id: "start" | "end" })[] = [1];

  if (currentPage > 3) pages.push({ type: "ellipsis", id: "start" });

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) pages.push({ type: "ellipsis", id: "end" });

  pages.push(totalPages);
  return pages;
}

const Pagination = ({ pagination, onPageChange }: PaginationProps) => {
  const currentPage = pagination.next_page ? pagination.next_page - 1 : pagination.total_pages;
  const pages = getPageNumbers(pagination.total_pages, currentPage);

  return (
    <section className="w-full px-6 py-8">
      <div className="flex justify-start items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30 -ml-2"
          disabled={!pagination.previous_page}
          onClick={() => pagination.previous_page && onPageChange(pagination.previous_page)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          {pages.map((page) =>
            typeof page === "object" ? (
              <span
                key={`ellipsis-${page.id}`}
                className="mx-2 text-sm font-light text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                className={`min-w-8 h-8 hover:bg-transparent hover:underline text-sm ${
                  page === currentPage ? "underline font-normal" : "font-light"
                }`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            )
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="p-2 hover:bg-transparent hover:opacity-50 disabled:opacity-30"
          disabled={!pagination.next_page}
          onClick={() => pagination.next_page && onPageChange(pagination.next_page)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default Pagination;
