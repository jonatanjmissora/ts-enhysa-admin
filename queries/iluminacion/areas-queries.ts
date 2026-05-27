import { queryOptions } from "@tanstack/react-query"
import { getAllAreasServer, getAreasServer } from "../../server/iluminacion/areas-server"

export const areasQueryOptions = ({
	userId,
	reporteId,
}: {
	userId: string
	reporteId: string
}) =>
	queryOptions({
		queryKey: ["areas_iluminacion", userId, reporteId],
		queryFn: () => getAreasServer({ data: { userId, reporteId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

	export const allAreasQueryOptions = queryOptions({
		queryKey: ["areas_iluminacion", "all"],
		queryFn: () => getAllAreasServer(),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})