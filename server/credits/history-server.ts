import { createServerFn } from "@tanstack/react-start"
import { getAllCreditHistoryDB } from "../../db/credits/history/history-db"

export const getAllCreditHistoryServer = createServerFn().handler(async () => {
	return await getAllCreditHistoryDB()
})
