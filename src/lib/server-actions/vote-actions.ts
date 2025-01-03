"use server"
import { assertAccess } from "./authZ-action";
import { getVotes as queryVotes } from "../repositories/vote-repository";

export async function getVotes(retroId: number) {
  await assertAccess(retroId);
  return await queryVotes(retroId);
}
