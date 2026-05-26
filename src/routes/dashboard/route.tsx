import { createFileRoute, Outlet } from "@tanstack/react-router"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"

export const Route = createFileRoute("/dashboard")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(tecnicosQueryOptions)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	return <Outlet />
}
