"use server";
import {
  getTopics as queryTopics,
  getTopic as findTopic,
  updateTopic as persistTopic,
} from "../repositories/topic-repository";
import { Topic } from "@/types/model";
import { assertAccess, assertAccessToTopic } from "./authZ-action";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { EVENT } from "@/types/event";

export async function getTopics(retroId: number): Promise<Topic[]> {
  await assertAccess(retroId);
  return await queryTopics(retroId);
}

export async function getTopic(topicId: number): Promise<Topic> {
  await assertAccessToTopic(topicId);
  return await findTopic(topicId);
}

export async function updateTopic(topic: Partial<Topic>): Promise<Topic> {
  const retroPublicId = await assertAccessToTopic(topic.id || 0);
  const updatedTopic = await persistTopic(topic);

  const supabase = createServerActionClient({ cookies });
  await supabase.channel(retroPublicId).send({
    type: "broadcast",
    event: EVENT.topicUpdated,
    payload: { topicId: topic.id },
  });
  return updatedTopic;
}
