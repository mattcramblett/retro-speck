import RetroHistoryTable from "@/components/retro/history/retro-history-table";

export default async function MyRetrosPage() {
  return (
    <main className="size-full flex flex-col items-center">
      <div className="w-full max-w-[50em]">
        <div className="container w-full my-4 text-2xl font-semibold">
          Retros
        </div>
        <RetroHistoryTable />
      </div>
    </main>
  );
}
