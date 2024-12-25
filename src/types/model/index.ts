import { cardsInRetroSpeck, participantsInRetroSpeck, retroColumnsInRetroSpeck, retrosInRetroSpeck, votesInRetroSpeck } from "@/db/schema";

export type Retro = typeof retrosInRetroSpeck.$inferSelect;
export type Participant = typeof participantsInRetroSpeck.$inferSelect;
export type Column = typeof retroColumnsInRetroSpeck.$inferSelect;
export type Card = typeof cardsInRetroSpeck.$inferSelect;
export type Vote = typeof votesInRetroSpeck.$inferSelect;

export type PhaseName = "setup" | "brainstorm" | "grouping" | "voting" | "discussion" | "complete";

export type Phase = {
  name: PhaseName,
  index: number,
  description: string,
  isDraftState: boolean,
};

export const phases: Record<PhaseName, Phase> = {
  setup: {
    name: "setup",
    index: 0,
    description: "Add and edit columns.",
    isDraftState: true,
  },
  brainstorm: {
    name: "brainstorm",
    index: 1,
    description: "Add cards to the board.",
    isDraftState: true,
  },
  grouping: {
    name: "grouping",
    index: 2,
    description: "Group similar cards together into topics.",
    isDraftState: false,
  },
  voting: {
    name: "voting",
    index: 3,
    description: "Vote on the topics you want to discuss.",
    isDraftState: true,
  },
  discussion: {
    name: "discussion",
    index: 4,
    description: "Take time to discuss each topic.",
    isDraftState: true,
  },
  complete: {
    name: "complete",
    index: 5,
    description: "The retrospective is complete!",
    isDraftState: true,
  },
}

export const getPhase = (phaseName?: string) => {
  return phases[phaseName  as PhaseName|| "setup"] || phases.setup;
}

