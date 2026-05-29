import { eq, and, isNull } from "drizzle-orm"
import { db } from "#/db/index"
import { reportes_iluminacion } from "./scheme"

export async function getAllReportesDB() {
	try {
		return await db
			.select()
			.from(reportes_iluminacion)
	} catch (error) {
		console.error(
			"ERROR obteniendo reportes de iluminacion:",
			error instanceof Error ? error.message : error
		)
		return []
	}
}

export async function getReportesDB(userId: string) {
	try {
		return await db
			.select()
			.from(reportes_iluminacion)
			.where(eq(reportes_iluminacion.userId, userId))
	} catch (error) {
		console.error(
			"ERROR obteniendo reportes de iluminacion:",
			error instanceof Error ? error.message : error
		)
		return []
	}
}

export async function getReporteDB(userId: string, id: string) {
	try {
		const result = await db.query.reportes_iluminacion.findFirst({
			where: and(
				eq(reportes_iluminacion.id, id),
				eq(reportes_iluminacion.userId, userId)
			),
			with: {
				empresa: true,
				instrumento: true,
				tecnico: true,
			},
		})
		return result ?? null
	} catch (error) {
		console.error(
			"ERROR leyendo reporte:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}

export async function getReporteNuevoDB(userId: string) {
	try {
		return await db
			.select()
			.from(reportes_iluminacion)
			.where(
				and(
					isNull(reportes_iluminacion.finishedAt),
					eq(reportes_iluminacion.userId, userId)
				)
			)
			.limit(1)
			.then(rows => rows[0] ?? null)
	} catch (error) {
		console.error(
			"ERROR leyendo instrumento:",
			error instanceof Error ? error.message : error
		)
		return null
	}
}
