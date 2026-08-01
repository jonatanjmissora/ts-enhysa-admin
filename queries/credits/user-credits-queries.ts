import { queryOptions } from "@tanstack/react-query"
import {
	getAllUserCreditsServer,
	getUserCreditsByUserServer,
} from "../../server/credits/user-credits-server"

export const allUserCreditsQueryOptions = queryOptions({
	queryKey: ["user_credits", "all"],
	queryFn: () => getAllUserCreditsServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const userCreditsByUserQueryOptions = ({
	userId,
}: {
	userId: string
}) =>
	queryOptions({
		queryKey: ["user_credits", userId],
		queryFn: () => getUserCreditsByUserServer({ data: { userId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})
