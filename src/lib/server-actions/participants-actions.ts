"use server";
import { Participant } from "@/types/model";
import {
  getParticipants as queryParticipants,
  updateParticipant as persistParticipant,
  getParticipant as queryParticipant,
} from "../repositories/participant-repository";
import { assertAccess, assertAccessToParticipant } from "./authZ-action";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { EVENT } from "@/types/event";
import { getUserOrThrow } from "./authN-actions";

export async function getParticipants(retroId: number): Promise<Participant[]> {
  await assertAccess(retroId);
  return await queryParticipants(retroId);
}

export async function updateParticipant(
  participant: Partial<Participant>,
): Promise<Participant> {
  const retroPublicId = await assertAccessToParticipant(
    participant.id || 0,
    true,
  ); // must be facilitator
  const result = await persistParticipant(participant);

  const supabase = createServerActionClient({ cookies });
  await supabase.channel(retroPublicId).send({
    type: "broadcast",
    event: EVENT.participantUpdated,
    payload: {
      participantId: result.id,
      acceptanceUpdated: participant.isAccepted !== undefined,
    },
  });
  
  // Send message to waiting room to allow participant to join
  if (participant.isAccepted) {
    await supabase.channel(result.publicId).send({
      type: "broadcast",
      event: EVENT.participantAdmitted,
      payload: {
        participantId: result.id,
      },
    });
  }
  return result;
}

export async function getParticipant(participantId: number) {
  const participant = await queryParticipant(participantId);
  // A user can always access their own participant record(s)
  const user = await getUserOrThrow();
  if (user.id === participant.userId) return participant;

  await assertAccessToParticipant(participantId);
  return participant;
}
