import { db } from "#/db/index"
import { user } from "./schema"

export async function getUsersDB() {
	try {
		return await db.select().from(user)
	} catch (error) {
		console.error(
			"ERROR obteniendo usuarios:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
