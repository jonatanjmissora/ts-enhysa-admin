import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
	getReporteDB,
	getReporteNuevoDB,
	getReportesDB,
} from "../../db/reportes/iluminacion/reportes-db"

const reporteIdValidator = z.object({
	userId: z.string(),
})

export const getReportesServer = createServerFn()
	.inputValidator(reporteIdValidator)
	.handler(async ({ data }) => {
		return await getReportesDB(data.userId)
	})

export const getReporteServer = createServerFn()
	.inputValidator((data: { userId: string; reporteId: string }) => data)
	.handler(async ({ data }) => {
		return await getReporteDB(data.userId, data.reporteId)
	})

export const getReporteNuevoServer = createServerFn()
	.inputValidator(reporteIdValidator)
	.handler(async ({ data }) => {
		return await getReporteNuevoDB(data.userId)
	})
