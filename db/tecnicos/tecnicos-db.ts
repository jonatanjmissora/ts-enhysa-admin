import { db } from "#/db/index"
import { tecnicos } from "./schema"

export async function getTecnicosDB() {
	try {
		return await db.select().from(tecnicos)
	} catch (error) {
		console.error(
			"ERROR obteniendo tecnico:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
