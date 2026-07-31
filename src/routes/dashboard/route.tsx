import { createFileRoute, Outlet } from "@tanstack/react-router"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import { allEmpresasQueryOptions } from "../../../queries/empresas-queries"
import { allInstrumentosQueryOptions } from "../../../queries/instrumentos-queries"
import { allReportesQueryOptions } from "../../../queries/iluminacion/reportes-queries"

export const Route = createFileRoute("/dashboard")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(tecnicosQueryOptions)
		context.queryClient.ensureQueryData(tecnicosQueryOptions)
		context.queryClient.ensureQueryData(allEmpresasQueryOptions)
		context.queryClient.ensureQueryData(allInstrumentosQueryOptions)
		context.queryClient.ensureQueryData(allReportesQueryOptions)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	return <Outlet />
}
