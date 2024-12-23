"use server";
import { Card } from "@/types/model";
import { getCards as queryCards, updateCard as persistCard } from "../repositories/card-repository";
import { assertAccess, assertAccessToCard } from "./authZ-action";

export async function getCards(retroId: number): Promise<Card[]> {
  assertAccess(retroId);
  return await queryCards(retroId);
}

export async function updateCard(card: Partial<Card>): Promise<Card> {
  const cardId = card.id;
  if (!cardId) throw "Must set cardId for update";
  assertAccessToCard(cardId);
  return await persistCard(card); 
}

