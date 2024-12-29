"use server";
import { db } from "@/db";
import {
  topicsInRetroSpeck as topicTable,
  retroColumnsInRetroSpeck as columnTable,
} from "@/db/schema";
import { Topic } from "@/types/model";
import { eq } from "drizzle-orm";

export async function getTopics(retroId: number): Promise<Topic[]> {
  const rows = (await db
    .select()
    .from(topicTable)
    .fullJoin(columnTable, eq(columnTable.id, topicTable.retroColumnId))
    .where(eq(columnTable.retroId, retroId))) as { topics: Topic[] }[];
  return rows.map((it) => it.topics) as Topic[];
}