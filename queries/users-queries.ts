import { queryOptions } from "@tanstack/react-query"
import { getUserByIdServer, getUsersServer } from "../server/users-server"

export const usersQueryOptions = queryOptions({
	queryKey: ["users"],
	queryFn: () => getUsersServer(),
})

export const userQueryOptions = (id: string) =>
	queryOptions({
		queryKey: ["users", id],
		queryFn: async () => getUserByIdServer({ data: { userId: id } }),
	})
