import { db } from "#/db/index"
import { instrumentos } from "./schema"
import { eq, asc } from "drizzle-orm"

export async function getInstrumentosDB(userId: string) {
	try {
		return await db
			.select()
			.from(instrumentos)
			.where(eq(instrumentos.userId, userId))
			.orderBy(asc(instrumentos.nombre))
	} catch (error) {
		console.error(
			"ERROR obteniendo instrumental:",
			error instanceof Error ? error.message : error
		)
	}
}
