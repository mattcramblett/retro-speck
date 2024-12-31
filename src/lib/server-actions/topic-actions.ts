"use server"
import { getTopics as queryTopics, updateTopic as persistTopic } from "../repositories/topic-repository";
import { Topic } from "@/types/model";
import { assertAccess } from "./authZ-action";

export async function getTopics(retroId: number): Promise<Topic[]> {
  assertAccess(retroId);
  return await queryTopics(retroId);
}

export async function updateTopic(topic: Partial<Topic>): Promise<Topic> {
  // TODO: assert access
  const updatedTopic = await persistTopic(topic);
  // TODO: send websocket message with update
  return updatedTopic;
}

