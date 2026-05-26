import { createFileRoute, Link } from "@tanstack/react-router"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando técnicos...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	if (!tecnicos) return <div>No hay técnicos...</div>
	return (
		<div>
			<h1>Enhysa Admin Panel</h1>
			<h2>Tecnicos</h2>
			<ul>
				{tecnicos.map(tecnico => (
					<li key={tecnico.id}>
						<Link to="/dashboard/$id" params={{ id: tecnico.userId }}>
							{tecnico.nombre}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
