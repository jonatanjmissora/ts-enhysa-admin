import { createFileRoute, Outlet } from "@tanstack/react-router"
import { filesQueryOptions } from "../../../queries/files-queries"

export const Route = createFileRoute("/files")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(filesQueryOptions)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	return <Outlet />
}
