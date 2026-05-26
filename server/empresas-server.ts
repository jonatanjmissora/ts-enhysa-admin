import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { getEmpresasDB } from "../db/empresas/empresas-db"

const empresaIdValidator = z.object({
	userId: z.string(),
})

export const getEmpresasServer = createServerFn()
	.inputValidator(empresaIdValidator)
	.handler(async ({ data }) => {
		return await getEmpresasDB(data.userId)
	})
