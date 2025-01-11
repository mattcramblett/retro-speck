"use server";
import { getPhase, getPhaseByIndex, Retro } from "@/types/model";
import {
  getRetro as queryRetro,
  createRetro as insertRetro,
  updateRetro,
} from "../repositories/retro-repository";
import { assertAccess } from "./authZ-action";
import { getUserOrThrow } from "./authN-actions";
import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { EVENT } from "@/types/event";

export async function getRetro(retroId: number): Promise<Retro> {
  const retro = await queryRetro(retroId);
  await assertAccess(retroId);
  return retro;
}

export async function createRetro(name: string): Promise<string> {
  // TODO: AuthZ check is just an authenticated user. There should be probably be some form of rate limiting here.
  const user = await getUserOrThrow();
  console.log(`user ${user.id} is creating a new retro`);
  return await insertRetro({
    name: name.replaceAll(/<|>/g, ""),
    userId: user.id,
    email: user.email || "unknown",
  });
}

export async function advancePhase(retroId: number): Promise<Retro> {
  await assertAccess(retroId, true); // Must be facilitator
  const retro = await queryRetro(retroId);
  const phase = getPhase(retro.phase);
  const newPhase = getPhaseByIndex(phase.index + 1);
  if (!newPhase) throw `Invalid state - retro ${retroId}, no phase with index ${phase.index + 1}`;

  const updatedRetro = await updateRetro({ id: retro.id, phase: newPhase?.name });
  if (newPhase.stateFunction) await newPhase.stateFunction(retro.id);

  // send message notifying of the update
  const supabase = createServerActionClient({ cookies });
  await supabase.channel(retro.publicId).send({
    type: "broadcast",
    event: EVENT.retroPhaseUpdated,
    payload: { phase: newPhase?.name },
  });
  return updatedRetro;
}

export async function updateTopic(retroId: number, topicId: number): Promise<number> {
  const retroPublicId = await assertAccess(retroId, true); // Must be facilitator
  await updateRetro({ id: retroId, currentTopicId: topicId });
  const supabase = createServerActionClient({ cookies });
  await supabase.channel(retroPublicId).send({
    type: "broadcast",
    event: EVENT.retroTopicUpdated,
    payload: { currentTopicId: topicId },
  });
  return topicId;
}

