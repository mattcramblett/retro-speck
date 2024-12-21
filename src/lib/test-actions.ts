"use server"
import { retrosInRetroSpeck as retros } from "@/db/schema"
import { db } from "@/db"
import { uuidv4 } from "./utils";

export const testAction = async () => {
  const publicId = uuidv4();

  await db.insert(retros).values({
    publicId,
    name: `Test ${publicId}`,
    phase: "created",
    creatingUserId: uuidv4(),
    facilitatorUserId: uuidv4(),
  });
}

