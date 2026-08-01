import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { allAreasQueryOptions } from "../../../queries/iluminacion/areas-queries"
import { allReportesQueryOptions } from "../../../queries/iluminacion/reportes-queries"
import { allLocalizadasQueryOptions } from "../../../queries/iluminacion/localizadas-queries"
import { usersQueryOptions } from "../../../queries/users-queries"

export const Route = createFileRoute("/reportes")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(allAreasQueryOptions)
		context.queryClient.ensureQueryData(allReportesQueryOptions)
		context.queryClient.ensureQueryData(allLocalizadasQueryOptions)
		context.queryClient.ensureQueryData(usersQueryOptions)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	return <Outlet />
}
