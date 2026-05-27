import { db } from "#/db/index"
import { and, eq } from "drizzle-orm"
import { areas_iluminacion } from "./scheme"

export async function getAreasDB(userId: string, reporteId: string) {
	try {
		return await db
			.select()
			.from(areas_iluminacion)
			.where(
				and(
					eq(areas_iluminacion.userId, userId),
					eq(areas_iluminacion.reportId, reporteId)
				)
			)
	} catch (error) {
		console.error(
			"ERROR obteniendo areas de iluminacion:",
			error instanceof Error ? error.message : error
		)
		return []
	}
}
