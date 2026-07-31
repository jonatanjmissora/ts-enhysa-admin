import { queryOptions } from "@tanstack/react-query"
import { getAllCreditHistoryServer } from "../../server/credits/history-server"

export const allCreditHistoryQueryOptions = queryOptions({
	queryKey: ["creditHistory", "all"],
	queryFn: () => getAllCreditHistoryServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
