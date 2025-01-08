import {
  cardsInRetroSpeck,
  participantsInRetroSpeck,
  retroColumnsInRetroSpeck,
  retrosInRetroSpeck,
  topicsInRetroSpeck,
  votesInRetroSpeck,
} from "@/db/schema";
import { handleDiscussionPhase, handleGroupingPhase, handleVotingPhase } from "@/lib/services/phase-state-service";

export type Retro = typeof retrosInRetroSpeck.$inferSelect;
export type Participant = typeof participantsInRetroSpeck.$inferSelect;
export type Column = typeof retroColumnsInRetroSpeck.$inferSelect;
export type Card = typeof cardsInRetroSpeck.$inferSelect;
export type Topic = typeof topicsInRetroSpeck.$inferSelect;
export type Vote = typeof votesInRetroSpeck.$inferSelect;

export type PhaseName =
  | "setup"
  | "brainstorm"
  | "grouping"
  | "voting"
  | "discussion"
  | "complete";

export type LayoutType =
  | "column"
  | "sequence"
  | "summary";

export type Phase = {
  name: PhaseName;
  label: string;
  index: number;
  description: string;
  isDraftState: boolean; // whether cards are allowed to be edited
  usesTopics?: boolean; // whether cards should be aggregated into topics
  showsVotes?: boolean; // whether votes should be shown
  layoutType: LayoutType; // Format in which the board is displayed
  stateFunction?: (retroId: number) => Promise<void>; // Hook that manages the data state when transitioning to phase
};

export const phases: Record<PhaseName, Phase> = {
  setup: {
    name: "setup",
    label: "Setup",
    index: 0,
    description: "Add and edit columns, then move onto brainstorming.",
    isDraftState: true,
    layoutType: "column",
  },
  brainstorm: {
    name: "brainstorm",
    label: "Brainstorm",
    index: 1,
    description: "Add cards to the board with topics you'd like to discuss.",
    isDraftState: true,
    layoutType: "column",
  },
  grouping: {
    name: "grouping",
    label: "Grouping",
    index: 2,
    description: "Group similar cards together into topics.",
    isDraftState: false,
    usesTopics: true,
    layoutType: "column",
    stateFunction: handleGroupingPhase,
  },
  voting: {
    name: "voting",
    label: "Voting",
    index: 3,
    description: "Vote on the topics you want to discuss.",
    isDraftState: false,
    usesTopics: true,
    showsVotes: true,
    layoutType: "column",
    stateFunction: handleVotingPhase,
  },
  discussion: {
    name: "discussion",
    label: "Discussion",
    index: 4,
    description: "Take time to discuss each topic.",
    isDraftState: false,
    usesTopics: true,
    showsVotes: true,
    layoutType: "sequence",
    stateFunction: handleDiscussionPhase,
  },
  complete: {
    name: "complete",
    label: "Complete",
    index: 5,
    description: "The retrospective is complete!",
    isDraftState: false,
    usesTopics: true,
    showsVotes: true,
    layoutType: "summary",
  },
};

export const getPhase = (phaseName?: string) => {
  return phases[(phaseName as PhaseName) || "setup"] || phases.setup;
};

export const getPhaseByIndex = (index: number) => {
  const phaseList = Object.values(phases);
  if (index >= phaseList.length) {
    return phaseList[phaseList.length - 1];
  } else if (index < 0) {
    return phaseList[0];
  }

  return phaseList.find((p) => p.index === index);
};
