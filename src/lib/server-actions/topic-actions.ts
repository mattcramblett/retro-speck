"use server"
import { getTopics as queryTopics } from "../repositories/topic-repository";
import { Topic } from "@/types/model";
import { assertAccess } from "./authZ-action";

export async function getTopics(retroId: number): Promise<Topic[]> {
  assertAccess(retroId);
  return await queryTopics(retroId);
}

