import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import {
	getAllLocalizadasDB,
	getLocalizadasDB,
} from "../../db/reportes/iluminacion/localizadas/localizadas-db"

const localizadaIdValidator = z.object({
	userId: z.string(),
	reporteId: z.string(),
})

export const getLocalizadasServer = createServerFn()
	.inputValidator(localizadaIdValidator)
	.handler(async ({ data }) => {
		return await getLocalizadasDB(data.userId, data.reporteId)
	})

export const getAllLocalizadasServer = createServerFn().handler(async () => {
	return await getAllLocalizadasDB()
})
