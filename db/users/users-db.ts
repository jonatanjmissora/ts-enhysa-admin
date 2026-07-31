import { db } from "#/db/index"
import { user } from "./schema"
import { eq } from "drizzle-orm"

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

export async function getUserByIdDB(id: string) {
	try {
		return await db.select().from(user).where(eq(user.id, id))
	} catch (error) {
		console.error(
			"ERROR obteniendo usuario:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
