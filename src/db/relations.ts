import { relations } from "drizzle-orm/relations";
import { topicsInRetroSpeck, votesInRetroSpeck, participantsInRetroSpeck, retrosInRetroSpeck, retroColumnsInRetroSpeck, cardsInRetroSpeck } from "./schema";

export const votesInRetroSpeckRelations = relations(votesInRetroSpeck, ({one}) => ({
	topicsInRetroSpeck: one(topicsInRetroSpeck, {
		fields: [votesInRetroSpeck.topicId],
		references: [topicsInRetroSpeck.id]
	}),
	participantsInRetroSpeck: one(participantsInRetroSpeck, {
		fields: [votesInRetroSpeck.participantId],
		references: [participantsInRetroSpeck.id]
	}),
	retrosInRetroSpeck: one(retrosInRetroSpeck, {
		fields: [votesInRetroSpeck.retroId],
		references: [retrosInRetroSpeck.id]
	}),
}));

export const topicsInRetroSpeckRelations = relations(topicsInRetroSpeck, ({one, many}) => ({
	votesInRetroSpecks: many(votesInRetroSpeck),
	retroColumnsInRetroSpeck: one(retroColumnsInRetroSpeck, {
		fields: [topicsInRetroSpeck.retroColumnId],
		references: [retroColumnsInRetroSpeck.id]
	}),
	retrosInRetroSpecks: many(retrosInRetroSpeck),
	cardsInRetroSpecks: many(cardsInRetroSpeck),
}));

export const participantsInRetroSpeckRelations = relations(participantsInRetroSpeck, ({one, many}) => ({
	votesInRetroSpecks: many(votesInRetroSpeck),
	retrosInRetroSpeck: one(retrosInRetroSpeck, {
		fields: [participantsInRetroSpeck.retroId],
		references: [retrosInRetroSpeck.id]
	}),
	cardsInRetroSpecks: many(cardsInRetroSpeck),
}));

export const retrosInRetroSpeckRelations = relations(retrosInRetroSpeck, ({one, many}) => ({
	votesInRetroSpecks: many(votesInRetroSpeck),
	topicsInRetroSpeck: one(topicsInRetroSpeck, {
		fields: [retrosInRetroSpeck.currentTopicId],
		references: [topicsInRetroSpeck.id]
	}),
	retroColumnsInRetroSpecks: many(retroColumnsInRetroSpeck),
	participantsInRetroSpecks: many(participantsInRetroSpeck),
}));

export const retroColumnsInRetroSpeckRelations = relations(retroColumnsInRetroSpeck, ({one, many}) => ({
	topicsInRetroSpecks: many(topicsInRetroSpeck),
	retrosInRetroSpeck: one(retrosInRetroSpeck, {
		fields: [retroColumnsInRetroSpeck.retroId],
		references: [retrosInRetroSpeck.id]
	}),
	cardsInRetroSpecks: many(cardsInRetroSpeck),
}));

export const cardsInRetroSpeckRelations = relations(cardsInRetroSpeck, ({one}) => ({
	participantsInRetroSpeck: one(participantsInRetroSpeck, {
		fields: [cardsInRetroSpeck.participantId],
		references: [participantsInRetroSpeck.id]
	}),
	topicsInRetroSpeck: one(topicsInRetroSpeck, {
		fields: [cardsInRetroSpeck.topicId],
		references: [topicsInRetroSpeck.id]
	}),
	retroColumnsInRetroSpeck: one(retroColumnsInRetroSpeck, {
		fields: [cardsInRetroSpeck.retroColumnId],
		references: [retroColumnsInRetroSpeck.id]
	}),
}));