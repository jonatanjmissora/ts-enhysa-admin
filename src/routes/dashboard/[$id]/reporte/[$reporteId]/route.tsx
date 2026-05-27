import { createFileRoute, Outlet } from "@tanstack/react-router"
import { reporteQueryOptions } from "../../../../../../queries/iluminacion/reportes-queries"
import { empresasQueryOptions } from "../../../../../../queries/empresas-queries"
import { areasQueryOptions } from "../../../../../../queries/iluminacion/areas-queries"

export const Route = createFileRoute("/dashboard/$id/reporte/$reporteId")({
	// loader: ({ context, params }) => {
	// 	context.queryClient.ensureQueryData(
	// 		reporteQueryOptions({ userId: params.id, reporteId: params.reporteId })
	// 	)
	// context.queryClient.ensureQueryData(
	// 	empresasQueryOptions({ userId: params.id })
	// )
	// 	context.queryClient.ensureQueryData(
	// 		areasQueryOptions({ userId: params.id, reporteId: params.reporteId })
	// 	)
	// 	return null
	// },
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			MENU
			<Outlet />
		</div>
	)
}
