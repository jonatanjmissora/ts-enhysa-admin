import { createServerFn } from "@tanstack/react-start"
import { getUsersDB } from "../db/users/users-db"

export const getUsersServer = createServerFn().handler(async () => {
	return await getUsersDB()
})
