import { db } from "#/db/index"
import { empresas } from "./schema"
import { eq, asc } from "drizzle-orm"

export async function getEmpresasDB(userId: string) {
	try {
		return await db
			.select()
			.from(empresas)
			.where(eq(empresas.userId, userId))
			.orderBy(asc(empresas.razonSocial))
	} catch (error) {
		console.error(
			"ERROR obteniendo empresas:",
			error instanceof Error ? error.message : error
		)
	}
}
