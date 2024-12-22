import { cardsInRetroSpeck, participantsInRetroSpeck, retroColumnsInRetroSpeck, retrosInRetroSpeck, votesInRetroSpeck } from "@/db/schema";

export type Retro = typeof retrosInRetroSpeck.$inferSelect;
export type Participant = typeof participantsInRetroSpeck.$inferSelect;
export type Column = typeof retroColumnsInRetroSpeck.$inferSelect;
export type Card = typeof cardsInRetroSpeck.$inferSelect;
export type Vote = typeof votesInRetroSpeck.$inferSelect;

