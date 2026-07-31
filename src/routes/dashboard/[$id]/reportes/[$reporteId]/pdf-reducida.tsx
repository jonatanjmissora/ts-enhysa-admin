import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, lazy } from "react"
import { reporteQueryOptions } from "../../../../../../queries/iluminacion/reportes-queries"
import { areasQueryOptions } from "../../../../../../queries/iluminacion/areas-queries"
import { ClientComponent } from "#/components/client-component"

const MyDocument = lazy(() =>
	import("#/components/my-document-reducida").then(m => ({
		default: m.MyDocumentReducida,
	}))
)

export const Route = createFileRoute("/dashboard/$id/reportes/$reporteId/pdf-reducida")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando PDF...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { id, reporteId } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(
		reporteQueryOptions({ userId: id, reporteId })
	)
	const { data: areas } = useSuspenseQuery(
		areasQueryOptions({ userId: id, reporteId: reporte?.id ?? "" })
	)

	if (!reporte)
		return <span className="text-red-500">Reporte no encontrado</span>

	return (
		<ClientComponent fallback={<div>preparando entorno...</div>}>
			<Suspense fallback={<div>preparando entorno2...</div>}>
				<MyDocument
					reporte={reporte}
					areas={areas}
					tecnico={reporte.tecnico}
					empresa={reporte.empresa}
					instrumento={reporte.instrumento}
				/>
			</Suspense>
		</ClientComponent>
	)
}
