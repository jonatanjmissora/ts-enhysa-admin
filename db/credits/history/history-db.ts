import { db } from "#/db/index"
import { creditHistory } from "./schema"
import { asc } from "drizzle-orm"

export async function getAllCreditHistoryDB() {
	try {
		return await db
			.select()
			.from(creditHistory)
			.orderBy(asc(creditHistory.createdAt))
	} catch (error) {
		console.error(
			"ERROR obteniendo creditHistory:",
			error instanceof Error ? error.message : error
		)
	}
}
