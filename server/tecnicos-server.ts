import { createServerFn } from "@tanstack/react-start"
import { getTecnicosDB } from "../db/tecnicos/tecnicos-db"

export const getTecnicosServer = createServerFn().handler(async () => {
	return await getTecnicosDB()
})
