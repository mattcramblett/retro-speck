import { db } from "@/db";
import {
  participantsInRetroSpeck as participantTable,
  retroColumnsInRetroSpeck as columnTable,
  retrosInRetroSpeck as retroTable,
} from "@/db/schema";
import { uuidv4 } from "../utils";
import { eq } from "drizzle-orm";
import { Retro } from "@/types/model";

export async function getRetro(publicId: string): Promise<Retro> {
  const results = await db
    .select()
    .from(retroTable)
    .where(eq(retroTable.publicId, publicId))
    .limit(1);
  const retro = results[0];
  if (!retro) throw "Not found";
  return retro as Retro;
}

export async function createRetro({
  name,
  userId,
  email,
}: {
  name: string;
  userId: string;
  email: string;
}): Promise<string> {
  const publicId = uuidv4();
  const participantPublicId = uuidv4();

  await db.transaction(async (tx) => {
    const retro = await tx
      .insert(retroTable)
      .values({
        creatingUserId: userId,
        facilitatorUserId: userId,
        publicId,
        name,
        phase: "created",
      })
      .returning();
    const retroId = retro[0].id;

    // The creating user is the facilitator
    await tx.insert(participantTable).values({
      publicId: participantPublicId,
      userId: userId,
      name: email || "Facilitator", // we expect the user to have an email
      retroId,
      isAccepted: true,
    });

    // Setup default columns
    await tx.insert(columnTable).values([
      {
        name: "Mad 😡",
        retroId,
      },
      {
        name: "Sad 😭",
        retroId,
      },
      {
        name: "Glad 😊",
        retroId,
      },
      {
        name: "Kudos 🎉",
        retroId,
      },
    ]);
  });

  return publicId;
}
