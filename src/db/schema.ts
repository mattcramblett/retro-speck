import { pgTable, pgSchema, index, foreignKey, integer, varchar, timestamp, uuid, boolean } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const retroSpeck = pgSchema("retro_speck");


export const topicsInRetroSpeck = retroSpeck.table("topics", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "retro_speck.topics_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	retroColumnId: integer("retro_column_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_topics_retro_column_id").using("btree", table.retroColumnId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.retroColumnId],
			foreignColumns: [retroColumnsInRetroSpeck.id],
			name: "topics_retro_column_id_fkey"
		}),
]);

export const retrosInRetroSpeck = retroSpeck.table("retros", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "retro_speck.retros_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	publicId: uuid("public_id").notNull(),
	name: varchar().notNull(),
	phase: varchar().notNull(),
	creatingUserId: uuid("creating_user_id").notNull(),
	facilitatorUserId: uuid("facilitator_user_id").notNull(),
	currentTopicId: integer("current_topic_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_retros_creating_user_id").using("btree", table.creatingUserId.asc().nullsLast().op("uuid_ops")),
	index("idx_retros_current_topic_id").using("btree", table.currentTopicId.asc().nullsLast().op("int4_ops")),
	index("idx_retros_facilitator_user_id").using("btree", table.facilitatorUserId.asc().nullsLast().op("uuid_ops")),
	index("idx_retros_public_id").using("btree", table.publicId.asc().nullsLast().op("uuid_ops")),
	index("idx_retros_retro_phase").using("btree", table.phase.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.currentTopicId],
			foreignColumns: [topicsInRetroSpeck.id],
			name: "retros_current_topic_id_fkey"
		}),
]);

export const retroColumnsInRetroSpeck = retroSpeck.table("retro_columns", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "retro_speck.retro_columns_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar().notNull(),
	retroId: integer("retro_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_retro_columns_retro_id").using("btree", table.retroId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.retroId],
			foreignColumns: [retrosInRetroSpeck.id],
			name: "retro_columns_retro_id_fkey"
		}),
]);

export const participantsInRetroSpeck = retroSpeck.table("participants", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "retro_speck.participants_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	publicId: uuid("public_id").notNull(),
	name: varchar().notNull(),
	retroId: integer("retro_id").notNull(),
	userId: uuid("user_id").notNull(),
	voteAllotment: integer("vote_allotment"),
	isAccepted: boolean("is_accepted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_participants_public_id").using("btree", table.publicId.asc().nullsLast().op("uuid_ops")),
	index("idx_participants_retro_id").using("btree", table.retroId.asc().nullsLast().op("int4_ops")),
	index("idx_participants_user_id").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.retroId],
			foreignColumns: [retrosInRetroSpeck.id],
			name: "participants_retro_id_fkey"
		}),
]);

export const cardsInRetroSpeck = retroSpeck.table("cards", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "retro_speck.cards_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	content: varchar().notNull(),
	participantId: integer("participant_id").notNull(),
	retroColumnId: integer("retro_column_id").notNull(),
	topicId: integer("topic_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_cards_participant_id").using("btree", table.participantId.asc().nullsLast().op("int4_ops")),
	index("idx_cards_retro_column_id").using("btree", table.retroColumnId.asc().nullsLast().op("int4_ops")),
	index("idx_cards_topic_id").using("btree", table.topicId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.participantId],
			foreignColumns: [participantsInRetroSpeck.id],
			name: "cards_participant_id_fkey"
		}),
	foreignKey({
			columns: [table.topicId],
			foreignColumns: [topicsInRetroSpeck.id],
			name: "cards_topic_id_fkey"
		}),
	foreignKey({
			columns: [table.retroColumnId],
			foreignColumns: [retroColumnsInRetroSpeck.id],
			name: "cards_retro_column_id_fkey"
		}),
]);

export const votesInRetroSpeck = retroSpeck.table("votes", {
	id: integer().primaryKey().generatedByDefaultAsIdentity({ name: "retro_speck.votes_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	participantId: integer("participant_id").notNull(),
	cardId: integer("card_id").notNull(),
	retroId: integer("retro_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("idx_votes_card_id").using("btree", table.cardId.asc().nullsLast().op("int4_ops")),
	index("idx_votes_participant_id").using("btree", table.participantId.asc().nullsLast().op("int4_ops")),
	index("idx_votes_retro_id").using("btree", table.retroId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.cardId],
			foreignColumns: [cardsInRetroSpeck.id],
			name: "votes_card_id_fkey"
		}),
	foreignKey({
			columns: [table.participantId],
			foreignColumns: [participantsInRetroSpeck.id],
			name: "votes_participant_id_fkey"
		}),
	foreignKey({
			columns: [table.retroId],
			foreignColumns: [retrosInRetroSpeck.id],
			name: "votes_retro_id_fkey"
		}),
]);
