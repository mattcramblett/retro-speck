import { relations } from "drizzle-orm/relations";
import { participantsInRetroSpeck, cardsInRetroSpeck, retroColumnsInRetroSpeck, retrosInRetroSpeck, votesInRetroSpeck } from "./schema";

export const cardsInRetroSpeckRelations = relations(cardsInRetroSpeck, ({one, many}) => ({
	participantsInRetroSpeck: one(participantsInRetroSpeck, {
		fields: [cardsInRetroSpeck.participantId],
		references: [participantsInRetroSpeck.id]
	}),
	cardsInRetroSpeck: one(cardsInRetroSpeck, {
		fields: [cardsInRetroSpeck.parentCardId],
		references: [cardsInRetroSpeck.id],
		relationName: "cardsInRetroSpeck_parentCardId_cardsInRetroSpeck_id"
	}),
	cardsInRetroSpecks: many(cardsInRetroSpeck, {
		relationName: "cardsInRetroSpeck_parentCardId_cardsInRetroSpeck_id"
	}),
	retroColumnsInRetroSpeck: one(retroColumnsInRetroSpeck, {
		fields: [cardsInRetroSpeck.retroColumnId],
		references: [retroColumnsInRetroSpeck.id]
	}),
	retrosInRetroSpecks: many(retrosInRetroSpeck),
	votesInRetroSpecks: many(votesInRetroSpeck),
}));

export const participantsInRetroSpeckRelations = relations(participantsInRetroSpeck, ({one, many}) => ({
	cardsInRetroSpecks: many(cardsInRetroSpeck),
	retrosInRetroSpeck: one(retrosInRetroSpeck, {
		fields: [participantsInRetroSpeck.retroId],
		references: [retrosInRetroSpeck.id]
	}),
	votesInRetroSpecks: many(votesInRetroSpeck),
}));

export const retroColumnsInRetroSpeckRelations = relations(retroColumnsInRetroSpeck, ({one, many}) => ({
	cardsInRetroSpecks: many(cardsInRetroSpeck),
	retrosInRetroSpeck: one(retrosInRetroSpeck, {
		fields: [retroColumnsInRetroSpeck.retroId],
		references: [retrosInRetroSpeck.id]
	}),
}));

export const retrosInRetroSpeckRelations = relations(retrosInRetroSpeck, ({one, many}) => ({
	cardsInRetroSpeck: one(cardsInRetroSpeck, {
		fields: [retrosInRetroSpeck.currentCardId],
		references: [cardsInRetroSpeck.id]
	}),
	retroColumnsInRetroSpecks: many(retroColumnsInRetroSpeck),
	participantsInRetroSpecks: many(participantsInRetroSpeck),
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