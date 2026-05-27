import { createServerFn } from "@tanstack/react-start"
import { getAreasDB } from "../../db/reportes/iluminacion/areas/areas-db"
import { z } from "zod"

const areaIdValidator = z.object({
	userId: z.string(),
	reporteId: z.string(),
})

export const getAreasServer = createServerFn()
	.inputValidator(areaIdValidator)
	.handler(async ({ data }) => {
		return await getAreasDB(data.userId, data.reporteId)
	})
