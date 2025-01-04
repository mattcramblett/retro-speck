"use server";
import { assertAccess, assertAccessToTopic } from "./authZ-action";
import {
  getVotes as queryVotes,
  createVote as insertVote,
  deleteVote,
  getParticipantVotes,
} from "../repositories/vote-repository";
import { getUserOrThrow } from "./authN-actions";
import { getParticipantInRetro } from "../repositories/participant-repository";

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
  return vote;
}

export async function removeVote(topicId: number) {
  const retroPublicId = await assertAccessToTopic(topicId);
  const user = await getUserOrThrow();
  const participant = await getParticipantInRetro({
    retroPublicId,
    userId: user.id,
  });

  await deleteVote({
    topicId,
    participantId: participant.id,
    retroId: participant.retroId,
  });
}
