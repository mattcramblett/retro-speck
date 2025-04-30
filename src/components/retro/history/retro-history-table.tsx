"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { useRetroHistory } from "@/hooks/retros/use-retro-history";
import Link from "next/link";
import { useState } from "react";

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const RESULTS_PER_PAGE = 5;

export default function RetroHistoryTable() {
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isPending } = useRetroHistory({
    pageIndex,
    resultsPerPage: RESULTS_PER_PAGE,
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-2 items-center">
        {Array.from(new Array(RESULTS_PER_PAGE))
          .keys()
          .toArray()
          .map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        <TablePagination
          onChangePage={() => {}}
          currentIndex={0}
          totalPages={1}
        />
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Phase</TableHead>
            <TableHead>Started</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.items.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">
                <Button variant="link">
                  <Link href={`/retro/${row.publicId}`}>{row.name}</Link>
                </Button>
              </TableCell>
              <TableCell>
                <Badge
                  variant={row.phase === "complete" ? "default" : "outline"}
                >
                  {row.phase}
                </Badge>
              </TableCell>
              <TableCell>{formatTimestamp(row.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        onChangePage={(page: number) => setPageIndex(page)}
        currentIndex={pageIndex}
        totalPages={
          data ? Math.floor(data.totalItemsCount / RESULTS_PER_PAGE) + 1 : 1
        }
      />
    </>
  );
}
