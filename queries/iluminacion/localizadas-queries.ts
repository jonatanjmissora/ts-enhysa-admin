import { queryOptions } from "@tanstack/react-query"
import {
	getAllLocalizadasServer,
	getLocalizadasServer,
} from "../../server/iluminacion/localizadas-server"

export const localizadasQueryOptions = ({
	userId,
	reporteId,
}: {
	userId: string
	reporteId: string
}) =>
	queryOptions({
		queryKey: ["localizadas_iluminacion", userId, reporteId],
		queryFn: () => getLocalizadasServer({ data: { userId, reporteId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

export const allLocalizadasQueryOptions = queryOptions({
	queryKey: ["localizadas_iluminacion", "all"],
	queryFn: () => getAllLocalizadasServer(),
	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})
