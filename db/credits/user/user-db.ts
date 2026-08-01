import { db } from "#/db/index"
import { userCredits } from "./schema"
import { asc, eq } from "drizzle-orm"

export async function getAllUserCreditsDB() {
	try {
		return await db
			.select()
			.from(userCredits)
			.orderBy(asc(userCredits.updatedAt))
	} catch (error) {
		console.error(
			"ERROR obteniendo creditos de usuarios:",
			error instanceof Error ? error.message : error
		)
	}
}

export async function getUserCreditsByUserDB(userId: string) {
	try {
		return await db
			.select()
			.from(userCredits)
			.where(eq(userCredits.userId, userId))
	} catch (error) {
		console.error(
			"ERROR obteniendo creditos de usuario:",
			error instanceof Error ? error.message : error
		)
	}
}
