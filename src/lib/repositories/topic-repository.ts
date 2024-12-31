"use server";
import { db } from "@/db";
import {
  topicsInRetroSpeck as topicTable,
  retroColumnsInRetroSpeck as columnTable,
} from "@/db/schema";
import { Topic } from "@/types/model";
import { eq, sql } from "drizzle-orm";

export async function getTopics(retroId: number): Promise<Topic[]> {
  const rows = (await db
    .select()
    .from(topicTable)
    .fullJoin(columnTable, eq(columnTable.id, topicTable.retroColumnId))
    .where(eq(columnTable.retroId, retroId))) as { topics: Topic[] }[];
  return rows.map((it) => it.topics) as Topic[];
}

export async function getTopic(topicId: number): Promise<Topic> {
  const result = (await db
    .select()
    .from(topicTable)
    .where(eq(topicTable.id, topicId))
    .limit(1));
  return result[0] as Topic;
}

export async function updateTopic(topic: Partial<Topic>): Promise<Topic> {
  const result = await db
    .update(topicTable)
    .set({
      ...topic,
      updatedAt: sql`NOW()`,
      createdAt: undefined, // ensure not updated
    })
    .where(eq(topicTable.id, topic.id))
    .returning();
  return result[0] as Topic;
}
