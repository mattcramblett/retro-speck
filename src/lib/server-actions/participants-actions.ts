"use server";
import { Participant } from "@/types/model";
import {
  getParticipants as queryParticipants,
  updateParticipant as persistParticipant,
} from "../repositories/participant-repository";
import { assertAccess, assertAccessToParticipant } from "./authZ-action";

export async function getParticipants(retroId: number): Promise<Participant[]> {
  await assertAccess(retroId);
  return await queryParticipants(retroId);
}

export async function updateParticipant(
  participant: Partial<Participant>,
): Promise<Participant> {
  await assertAccessToParticipant(participant.id || 0);
  return await persistParticipant(participant);
}
