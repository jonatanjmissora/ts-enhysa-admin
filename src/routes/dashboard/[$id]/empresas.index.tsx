import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { empresasQueryOptions } from "../../../../queries/empresas-queries"

export const Route = createFileRoute("/dashboard/$id/empresas/")({
	component: RouteComponent,
})

function RouteComponent() {
	const id = Route.useParams().id
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions(id))
	if (!empresas) return <div>No hay empresas...</div>
	return (
		<div>
			<h1>Empresas</h1>
			<ul>
				{empresas.map(empresa => (
					<li key={empresa.id}>
						<span>{empresa.razonSocial}</span>
					</li>
				))}
			</ul>
		</div>
	)
}
