"use server";
import { getUserOrThrow } from "./auth-actions";
import { db } from "@/db";
import {
  participantsInRetroSpeck,
  retroColumnsInRetroSpeck,
  retrosInRetroSpeck,
} from "@/db/schema";
import { uuidv4 } from "../utils";

export async function createRetro(name: string): Promise<string> {
  const user = await getUserOrThrow();
  const publicId = uuidv4();
  const participantPublicId = uuidv4();

  await db.transaction(async (tx) => {
    const retro = await tx
      .insert(retrosInRetroSpeck)
      .values({
        creatingUserId: user.id,
        facilitatorUserId: user.id,
        publicId,
        name,
        phase: "created",
      })
      .returning();
    const retroId = retro[0].id;

    // The creating user is the facilitator
    await tx.insert(participantsInRetroSpeck).values({
      publicId: participantPublicId,
      userId: user.id,
      name: user.email || "Facilitator", // we expect the user to have an email
      retroId,
    });

    // Setup default columns
    await tx.insert(retroColumnsInRetroSpeck).values([
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
