"use server"
import { getUserOrThrow } from "./auth-actions"
import { db } from "@/db";
import { retrosInRetroSpeck } from "@/db/schema";
import { uuidv4 } from "../utils";

export async function createRetro(name: string) {
  const user = await getUserOrThrow();
  const publicId = uuidv4();

  await db.transaction(async (tx) => {
    const retro = tx.insert(retrosInRetroSpeck).values({
      creatingUserId: user.id,
      facilitatorUserId: user.id,
      publicId,
      name,
      phase: "created",
    });
  });
}
