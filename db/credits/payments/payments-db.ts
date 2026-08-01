import { db } from "#/db/index"
import { pendingPayments } from "./schema"
import { asc, eq } from "drizzle-orm"

export async function getAllPendingPaymentsDB() {
	try {
		return await db
			.select()
			.from(pendingPayments)
			.orderBy(asc(pendingPayments.createdAt))
	} catch (error) {
		console.error(
			"ERROR obteniendo pagos:",
			error instanceof Error ? error.message : error
		)
	}
}

export async function getPendingPaymentsByUserDB(userId: string) {
	try {
		return await db
			.select()
			.from(pendingPayments)
			.where(eq(pendingPayments.userId, userId))
			.orderBy(asc(pendingPayments.createdAt))
	} catch (error) {
		console.error(
			"ERROR obteniendo pagos:",
			error instanceof Error ? error.message : error
		)
	}
}
