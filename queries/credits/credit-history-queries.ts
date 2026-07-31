import { queryOptions } from "@tanstack/react-query"
import {
	getAllCreditHistoryServer,
	getCreditHistoryByUserServer,
} from "../../server/credits/history-server"

export const allCreditHistoryQueryOptions = queryOptions({
	queryKey: ["credit_history", "all"],
	queryFn: () => getAllCreditHistoryServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export const creditHistoryByUserQueryOptions = ({
	userId,
}: {
	userId: string
}) =>
	queryOptions({
		queryKey: ["credit_history", userId],
		queryFn: () => getCreditHistoryByUserServer({ data: { userId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})
