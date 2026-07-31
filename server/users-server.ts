import { createServerFn } from "@tanstack/react-start"
import { getUserByIdDB, getUsersDB } from "../db/users/users-db"
import { z } from "zod"

const userIdValidator = z.object({
	userId: z.string(),
})

export const getUsersServer = createServerFn().handler(async () => {
	return await getUsersDB()
})

export const getUserByIdServer = createServerFn()
	.inputValidator(userIdValidator)
	.handler(async ({ data }) => {
		return await getUserByIdDB(data.userId)
	})
