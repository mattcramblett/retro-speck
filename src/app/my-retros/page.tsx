import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { getRetroHistory } from "@/lib/server-actions/retro-actions";
import Link from "next/link";

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

export default async function MyRetrosPage({
  params,
}: {
  params: Promise<{ page: number }>;
}) {
  const { page } = await params;
  const currentIndex = page || 0;
  const results = await getRetroHistory(currentIndex || 0, RESULTS_PER_PAGE);

  return (
    <main className="size-full flex flex-col items-center">
      <div className="w-full max-w-[50em]">
        <div className="container w-full my-4 text-2xl font-semibold">
          Retros
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phase</TableHead>
              <TableHead>Started</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.items.map((row) => (
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
          initialIndex={currentIndex}
          totalPages={results.totalItemsCount / RESULTS_PER_PAGE + 1}
        />
      </div>
    </main>
  );
}
