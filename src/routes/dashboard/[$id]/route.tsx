import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { empresasQueryOptions } from "../../../../queries/empresas-queries"

export const Route = createFileRoute("/dashboard/$id")({
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(empresasQueryOptions(params.id))
		// 	context.queryClient.ensureQueryData(instrumentosQueryOptions)
		// 	context.queryClient.ensureQueryData(reportesQueryOptions)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	const id = Route.useParams().id
	return (
		<div className="w-full flex flex-col justify-center">
			<ul className="w-full flex gap-4 items-center justify-center py-6">
				<Link
					to="/dashboard"
					className="py-2 px-4 rounded-lg"
					activeProps={{ className: "bg-black" }}
					activeOptions={{ exact: true }}
				>
					<li>Inicio</li>
				</Link>
				<Link
					to="/dashboard/$id"
					className="py-2 px-4 rounded-lg"
					params={{ id }}
					activeProps={{ className: "bg-black" }}
					activeOptions={{ exact: true }}
				>
					<li>Tecnico</li>
				</Link>
				<Link
					to="/dashboard/$id/empresas"
					className="py-2 px-4 rounded-lg"
					params={{ id }}
					activeProps={{ className: "bg-black" }}
					activeOptions={{ exact: true }}
				>
					<li>Empresas</li>
				</Link>
				<Link
					to="/dashboard/$id/instrumentos"
					className="py-2 px-4 rounded-lg"
					params={{ id }}
					activeProps={{ className: "bg-black" }}
					activeOptions={{ exact: true }}
				>
					<li>Instrumentos</li>
				</Link>
				<Link
					className="py-2 px-4 rounded-lg"
					to="/dashboard/$id/reportes"
					params={{ id }}
					activeProps={{ className: "bg-black" }}
					activeOptions={{ exact: true }}
				>
					<li>Reportes</li>
				</Link>
			</ul>
			<Outlet />
		</div>
	)
}
