import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteNuevoQueryOptions } from "../../../../../../queries/iluminacion/reportes-queries"

export const Route = createFileRoute("/dashboard/$id/reporte/reporte-nuevo/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando datos del reporte nuevo...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { id: userId } = Route.useParams()
	const { data: reporteNuevo } = useSuspenseQuery(
		reporteNuevoQueryOptions(userId)
	)

	return (
		<div>
			<pre>{JSON.stringify(reporteNuevo, null, 2)}</pre>
		</div>
	)
}
