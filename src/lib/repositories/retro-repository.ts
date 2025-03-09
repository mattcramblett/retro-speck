import { db } from "@/db";
import {
  participantsInRetroSpeck as participantTable,
  retroColumnsInRetroSpeck as columnTable,
  retrosInRetroSpeck as retroTable,
} from "@/db/schema";
import { uuidv4 } from "../utils";
import { eq, gte, sql, and, count } from "drizzle-orm";
import { phases, Retro } from "@/types/model";

export async function getRetro(retroId: number): Promise<Retro> {
  const results = await db
    .select()
    .from(retroTable)
    .where(eq(retroTable.id, retroId))
    .limit(1);
  const retro = results[0];
  if (!retro) throw "Not found";
  return retro as Retro;
}

export async function updateRetro(retro: Partial<Retro>): Promise<Retro> {
  const results = await db
    .update(retroTable)
    .set({
      ...retro,
      createdAt: undefined,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(retroTable.id, retro.id))
    .returning();
  const result = results[0];
  if (!result) throw "Not found";
  return result as Retro;
}

export async function getRetroByPublicId(publicId: string): Promise<Retro> {
  const results = await db
    .select()
    .from(retroTable)
    .where(eq(retroTable.publicId, publicId))
    .limit(1);
  const retro = results[0];
  if (!retro) throw "Not found";
  return retro as Retro;
}

// Return a retro that this user created in the last hour.
export async function userHasRecentRetro(userId: string): Promise<boolean> {
  const results = await db
    .select({ value: count(retroTable.id) })
    .from(retroTable)
    .where(
      and(
        eq(retroTable.facilitatorUserId, userId),
        gte(retroTable.createdAt, sql`Now() - INTERVAL '1 hour'`),
      ),
    )
    .limit(1);
  return results[0].value > 0;
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
        phase: phases.brainstorm.name, // TODO: change to `setup` when editing columns is implemented
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
