import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core"
import { user } from "../../users/schema"

export const userCredits = pgTable("user_credits", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	credits: integer("credits").notNull().default(0),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
})

export type UserCreditsType = typeof userCredits.$inferSelect
