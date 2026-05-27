import { queryOptions } from "@tanstack/react-query"
import { getAllInstrumentosServer, getInstrumentosServer } from "../server/instrumentos-server"

export const instrumentosQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["instrumentos", userId],
		queryFn: () => getInstrumentosServer({ data: { userId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

	export const allInstrumentosQueryOptions = queryOptions({
		queryKey: ["instrumentos", "all"],
		queryFn: () => getAllInstrumentosServer(),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})