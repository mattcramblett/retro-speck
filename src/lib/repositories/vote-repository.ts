"use server"
import { db } from "@/db";
import { votesInRetroSpeck as voteTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVotes(retroId: number) {
  return await db
    .select()
    .from(voteTable)
    .where(eq(voteTable.retroId, retroId));
}
