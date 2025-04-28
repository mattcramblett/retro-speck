"use client"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type TablePaginationProps = {
  initialIndex: number,
  totalPages: number,
}

export function TablePagination({
  initialIndex, totalPages,
}: TablePaginationProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const router = useRouter();

  const handlePageChange = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      router.replace(`/my-retros?page=${index}`);
      router.refresh();
    }
  }

  const maxIndex = totalPages - 1;

  const visibleOptions = () => {
    // Which page numbers should be shown (excluding ellipses portions)
    let result = [currentIndex];
    if (currentIndex > 0) {
      result = [currentIndex - 1, ...result];
    }
    if (currentIndex < maxIndex) {
      result = [...result, currentIndex + 1]
    }
    return result;
  }

  function PageItem (index: number, className?: string) {
    return (
      <PaginationItem className={cn("cursor-pointer select-none", className)} key={index}>
        <PaginationLink isActive={index === currentIndex} onClick={() => handlePageChange(index)}>
          {index + 1}
        </PaginationLink>
      </PaginationItem>
    )
  }

  function PreviousButton() {
    return (
      <PaginationItem className="cursor-pointer select-none">
        <PaginationPrevious onClick={() => currentIndex > 0 && handlePageChange(currentIndex - 1)} />
      </PaginationItem>
    )
  }

  function NextButton() {
    return (
      <PaginationItem className="cursor-pointer select-none">
        <PaginationNext onClick={() => currentIndex < maxIndex && handlePageChange(currentIndex + 1)} />
      </PaginationItem>
    )
  }

  function FullPagination(className?: string) {
    return (
      <Pagination suppressHydrationWarning className={className}>
        <PaginationContent className="min-w-[500px] justify-between">
          {PreviousButton()}
          {/* Show first page number followed by ellipses if we're past page 2 */}
          <span className="flex items-center">
            {
              currentIndex > 1 && (
                <>
                  {PageItem(0)}
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                </>
              ) 
            }
            {/* The main page options (current +/- 1) */}
            {visibleOptions().map(index => PageItem(index))}
            {/* Show last page number preceded by ellipses if there are still 2+ pages to go */}
            {
              currentIndex < maxIndex - 1 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  {PageItem(maxIndex)}
                </>
              ) 
            }
          </span>
          {NextButton()}
        </PaginationContent>
      </Pagination>
    )
  }

  function MobilePagination(className?: string) {
    // Simple version, just navigation buttons with current page
    return (
      <Pagination className={className}>
        <PaginationContent className="min-w-[250px] justify-between">
          {PreviousButton()}
          {PageItem(currentIndex)}
          {NextButton()}
        </PaginationContent>
      </Pagination>
    )
  }

  return (
    <>
    { FullPagination("hidden md:flex") }
    { MobilePagination("flex md:hidden") }
    </>
  );
}
