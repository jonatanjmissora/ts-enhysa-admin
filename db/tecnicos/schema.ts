import { pgTable, text } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { reportes_iluminacion } from "../reportes/iluminacion/scheme"

export const tecnicos = pgTable("tecnicos", {
	id: text("id").primaryKey(),

	nombre: text("nombre").notNull(),

	telefono: text("telefono").notNull(),

	localidad: text("localidad").notNull(),

	cargo: text("cargo").notNull(),

	matricula: text("matricula").notNull(),

	matriculaImg: text("matriculaImg").notNull(),

	firmaImg: text("firmaImg").notNull(),

	empresaLogo: text("empresaLogo").notNull(),

	userId: text("userId").notNull(),
})

export type TecnicoType = typeof tecnicos.$inferSelect

export const tecnicosRelations = relations(
  tecnicos,
  ({ many }) => ({
    reportes: many(reportes_iluminacion),
  })
)