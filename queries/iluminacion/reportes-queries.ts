import { queryOptions, useQueryClient } from "@tanstack/react-query"
import {
	getReporteNuevoServer,
	getReporteServer,
	getReportesServer,
} from "../../server/iluminacion/reportes-server"
import type { ReporteIluminacionType } from "../../db/reportes/iluminacion/scheme"

export const reportesQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["reportes-iluminacion", userId],
		queryFn: () => getReportesServer({ data: { userId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})

export const reporteNuevoQueryOptions = (userId: string) => {
	const queryClient = useQueryClient()
	return queryOptions({
		queryKey: ["reporte-iluminacion-nuevo", userId],
		queryFn: () => getReporteNuevoServer({ data: { userId } }),
		initialData: () => {
			const reportes = queryClient.getQueryData<ReporteIluminacionType[]>([
				"reportes-iluminacion",
				userId,
			])
			return reportes?.find(item => !item.finishedAt)
		},
	})
}

export const reporteQueryOptions = ({
	userId,
	reporteId,
}: {
	userId: string
	reporteId: string
}) => {
	return queryOptions({
		queryKey: ["reporte-iluminacion", userId, reporteId],
		queryFn: () => getReporteServer({ data: { userId, reporteId } }),
	})
}
