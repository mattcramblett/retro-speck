import { getCards } from "@/lib/server-actions/card-actions";
import { getColumns } from "@/lib/server-actions/column-actions";
import { getParticipant } from "@/lib/server-actions/participants-actions";
import { getRetro } from "@/lib/server-actions/retro-actions";

export default async function RetroBoard({
  params,
}: {
  params: { publicId: string };
}) {
  const { publicId } = params;
  const retro = await getRetro(publicId);
  const participant = await getParticipant(retro.id);
  const columns = await getColumns(retro.id);
  const cards = await getCards(retro.id);

  return (
    <main className="size-full flex justify-center">
      <div className="container">
        <h1 className="font-black text-xl">Retro</h1>
        <p>
          {JSON.stringify(retro,null,2)}
        </p>
        <hr />
        <h1 className="font-black text-xl">Participant</h1>
        <p>
          {JSON.stringify(participant,null,2)}
        </p>
        <h1 className="font-black text-xl">Columns</h1>
        <p>
          {JSON.stringify(columns,null,2)}
        </p>
        <h1 className="font-black text-xl">Cards</h1>
        <p>
          {JSON.stringify(cards,null,2)}
        </p>
      </div>
    </main>
  );
}
