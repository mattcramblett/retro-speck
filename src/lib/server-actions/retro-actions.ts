"use server";
import { Retro } from "@/types/model";
import {
  getRetro as queryRetro,
  createRetro as insertRetro,
} from "../repositories/retro-repository";
import { assertAccess } from "./authZ-action";
import { getUserOrThrow } from "./authN-actions";

export async function getRetro(retroId: number): Promise<Retro> {
  const retro = await queryRetro(retroId);
  await assertAccess(retroId);
  return retro;
}

export async function createRetro(name: string): Promise<string> {
  // NOTE: AuthZ check is just an authenticated user. There should be probably be some form of rate limiting here.
  const user = await getUserOrThrow();
  return await insertRetro({
    name: name.replaceAll(/<|>/g, ""),
    userId: user.id,
    email: user.email || "unknown",
  });
}
