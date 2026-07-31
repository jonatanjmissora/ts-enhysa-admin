import { pgTable, text, integer, timestamp, unique } from "drizzle-orm/pg-core"
import { user } from "../../users/schema"
import { reportes_iluminacion } from "../../reportes/iluminacion/scheme"

export const creditHistory = pgTable(
	"credit_history",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type", {
			enum: ["purchase", "consume", "bonus", "refund"],
		}).notNull(),
		credits: integer("credits").notNull(),
		reportId: text("report_id").references(() => reportes_iluminacion.id, {
			onDelete: "set null",
		}),
		paymentId: text("payment_id"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	table => ({
		paymentTypeUnique: unique().on(table.paymentId, table.type),
	})
)

export type CreditHistoryType = typeof creditHistory.$inferSelect
