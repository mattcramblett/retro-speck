"use server";

import { retroColumnsInRetroSpeck as columnTable } from "@/db/schema";
import { Column } from "@/types/model";
import { eq } from "drizzle-orm";
import { db } from "@/db";

export async function getColumns(retroId: number): Promise<Column[]> {
  const results = await db
    .select()
    .from(columnTable)
    .where(eq(columnTable.retroId, retroId))
    .orderBy(columnTable.createdAt);
  return results as Column[];
}
