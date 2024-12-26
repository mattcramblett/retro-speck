"use server";
import { Participant } from "@/types/model";
import { getParticipants as queryParticipants } from "../repositories/participant-repository";
import { assertAccess } from "./authZ-action";

export async function getParticipants(retroId: number): Promise<Participant[]> {
  await assertAccess(retroId);
  return await queryParticipants(retroId);
}

