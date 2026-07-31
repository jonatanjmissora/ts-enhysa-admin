import { queryOptions } from "@tanstack/react-query"
import { getUsersServer } from "../server/users-server"

export const usersQueryOptions = queryOptions({
	queryKey: ["users"],
	queryFn: () => getUsersServer(),
})
