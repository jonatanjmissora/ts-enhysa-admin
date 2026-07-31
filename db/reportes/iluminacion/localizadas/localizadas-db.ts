import { eq, and } from "drizzle-orm"
import { localizadas_iluminacion } from "./scheme"
import { db } from "#/db/index"

export async function getLocalizadasDB(userId: string, reportId: string) {
	try {
		return await db
			.select()
			.from(localizadas_iluminacion)
			.where(
				and(
					eq(localizadas_iluminacion.userId, userId),
					eq(localizadas_iluminacion.reportId, reportId)
				)
			)
	} catch (error) {
		console.error(
			"ERROR obteniendo localizadas de iluminacion:",
			error instanceof Error ? error.message : error
		)
		return []
	}
}

export async function getAllLocalizadasDB() {
	try {
		return await db.select().from(localizadas_iluminacion)
	} catch (error) {
		console.error(
			"ERROR leyendo localizada:",
			error instanceof Error ? error.message : error
		)
		return []
	}
}
