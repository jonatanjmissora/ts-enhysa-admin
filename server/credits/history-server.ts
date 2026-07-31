import { createServerFn } from "@tanstack/react-start"
import {
	getAllCreditHistoryDB,
	getCreditHistoryByUserDB,
} from "../../db/credits/history/history-db"
import { z } from "zod"

const userIdValidator = z.object({
	userId: z.string(),
})

export const getAllCreditHistoryServer = createServerFn().handler(async () => {
	return await getAllCreditHistoryDB()
})

export const getCreditHistoryByUserServer = createServerFn()
	.inputValidator(userIdValidator)
	.handler(async ({ data }: { data: { userId: string } }) => {
		return await getCreditHistoryByUserDB(data.userId)
	})
