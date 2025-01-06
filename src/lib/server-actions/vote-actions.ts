"use server";
import { assertAccess, assertAccessToTopic } from "./authZ-action";
import {
  getVotes as queryVotes,
  createVote as insertVote,
  deleteVote,
  getParticipantVotes,
  getVote,
} from "../repositories/vote-repository";
import { getUserOrThrow } from "./authN-actions";
import { getParticipantInRetro } from "../repositories/participant-repository";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { EVENT } from "@/types/event";
import { cookies } from "next/headers";

export async function getVotes(retroId: number) {
  await assertAccess(retroId);
  return await queryVotes(retroId);
}

export async function createVote(topicId: number) {
  const retroPublicId = await assertAccessToTopic(topicId);
  const user = await getUserOrThrow();
  const participant = await getParticipantInRetro({
    retroPublicId,
    userId: user.id,
  });
  const existingVotes = (await getParticipantVotes(participant.id)).length;
  if (existingVotes >= (participant?.voteAllotment || 0)) {
    throw "Max votes exceeded!";
  }

  const vote = await insertVote({
    topicId,
    participantId: participant.id,
    retroId: participant.retroId,
  });
  const supabase = createServerActionClient({ cookies });
  await supabase.channel(retroPublicId).send({
    type: "broadcast",
    event: EVENT.voteAdded,
    payload: { voteId: vote.id, topicId, participantId: participant.id },
  });
  return vote;
}

export async function removeVote(voteId: number) {
  const vote = await getVote(voteId);
  const retroPublicId = await assertAccess(vote.retroId);

  await deleteVote(voteId);

  const supabase = createServerActionClient({ cookies });
  await supabase.channel(retroPublicId).send({
    type: "broadcast",
    event: EVENT.voteRemoved,
    payload: { voteId },
  });
}
