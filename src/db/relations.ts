import { relations } from "drizzle-orm/relations";
import { retroColumnsInRetroSpeck, topicsInRetroSpeck, retrosInRetroSpeck, participantsInRetroSpeck, cardsInRetroSpeck, votesInRetroSpeck } from "./schema";

export const topicsInRetroSpeckRelations = relations(topicsInRetroSpeck, ({one, many}) => ({
	retroColumnsInRetroSpeck: one(retroColumnsInRetroSpeck, {
		fields: [topicsInRetroSpeck.retroColumnId],
		references: [retroColumnsInRetroSpeck.id]
	}),
	retrosInRetroSpecks: many(retrosInRetroSpeck),
	cardsInRetroSpecks: many(cardsInRetroSpeck),
}));

export const retroColumnsInRetroSpeckRelations = relations(retroColumnsInRetroSpeck, ({one, many}) => ({
	topicsInRetroSpecks: many(topicsInRetroSpeck),
	retrosInRetroSpeck: one(retrosInRetroSpeck, {
		fields: [retroColumnsInRetroSpeck.retroId],
		references: [retrosInRetroSpeck.id]
	}),
	cardsInRetroSpecks: many(cardsInRetroSpeck),
}));

export const retrosInRetroSpeckRelations = relations(retrosInRetroSpeck, ({one, many}) => ({
	topicsInRetroSpeck: one(topicsInRetroSpeck, {
		fields: [retrosInRetroSpeck.currentTopicId],
		references: [topicsInRetroSpeck.id]
	}),
	retroColumnsInRetroSpecks: many(retroColumnsInRetroSpeck),
	participantsInRetroSpecks: many(participantsInRetroSpeck),
	votesInRetroSpecks: many(votesInRetroSpeck),
}));

export const participantsInRetroSpeckRelations = relations(participantsInRetroSpeck, ({one, many}) => ({
	retrosInRetroSpeck: one(retrosInRetroSpeck, {
		fields: [participantsInRetroSpeck.retroId],
		references: [retrosInRetroSpeck.id]
	}),
	cardsInRetroSpecks: many(cardsInRetroSpeck),
	votesInRetroSpecks: many(votesInRetroSpeck),
}));

export const cardsInRetroSpeckRelations = relations(cardsInRetroSpeck, ({one, many}) => ({
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
	votesInRetroSpecks: many(votesInRetroSpeck),
}));

export const votesInRetroSpeckRelations = relations(votesInRetroSpeck, ({one}) => ({
	cardsInRetroSpeck: one(cardsInRetroSpeck, {
		fields: [votesInRetroSpeck.cardId],
		references: [cardsInRetroSpeck.id]
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