import { createServerFn } from "@tanstack/react-start"
import {
	getAllUserCreditsDB,
	getUserCreditsByUserDB,
} from "../../db/credits/user/user-db"
import { z } from "zod"

const userIdValidator = z.object({
	userId: z.string(),
})

export const getAllUserCreditsServer = createServerFn().handler(async () => {
	return await getAllUserCreditsDB()
})

export const getUserCreditsByUserServer = createServerFn()
	.inputValidator(userIdValidator)
	.handler(async ({ data }: { data: { userId: string } }) => {
		return await getUserCreditsByUserDB(data.userId)
	})
