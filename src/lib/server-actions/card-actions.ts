"use server";
import { Card } from "@/types/model";
import { getCards as queryCards } from "../repositories/card-repository";
import { assertAccess } from "./authZ-action";

export async function getCards(retroId: number): Promise<Card[]> {
  assertAccess(retroId);
  return await queryCards(retroId);
}

