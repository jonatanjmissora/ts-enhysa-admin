import { createServerFn } from "@tanstack/react-start"
import { getInstrumentosDB } from "../db/instrumentos/instrumentos-db"
import { z } from "zod"

const instrumentoIdValidator = z.object({
	userId: z.string(),
})

export const getInstrumentosServer = createServerFn()
	.inputValidator(instrumentoIdValidator)
	.handler(async ({ data }) => {
		return await getInstrumentosDB(data.userId)
	})
