import { pgTable, text } from "drizzle-orm/pg-core"

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
