import { pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const instrumentos = pgTable("instrumentos", {
	id: text("id").primaryKey(),

	nombre: text("nombre").notNull(),

	marca: text("marca").notNull(),

	modelo: text("modelo").notNull(),

	serie: text("serie").notNull(),

	fechaCalibracion: timestamp("fecha_calibracion").notNull(),

	imagenesCalibracion: text("imagen_calibracion").array().notNull(),

	imagenes: text("imagenes").array().notNull(),

	userId: text("userId").notNull(),
})

export type InstrumentoType = typeof instrumentos.$inferSelect
