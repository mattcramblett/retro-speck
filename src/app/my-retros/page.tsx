import RetroHistoryTable from "@/components/retro/history/retro-history-table";
import { getRetroHistory } from "@/lib/server-actions/retro-actions";

const RESULTS_PER_PAGE = 5;

export default async function MyRetrosPage() {
  const initialData = await getRetroHistory(0, RESULTS_PER_PAGE);

  return (
    <main className="size-full flex flex-col items-center">
      <div className="w-full max-w-[50em]">
        <div className="container w-full my-4 text-2xl font-semibold">
          Retros
        </div>
        <RetroHistoryTable initialData={initialData} resultsPerPage={RESULTS_PER_PAGE}/>
      </div>
    </main>
  );
}
