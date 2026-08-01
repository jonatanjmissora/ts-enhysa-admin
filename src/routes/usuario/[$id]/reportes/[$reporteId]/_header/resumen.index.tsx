import { Label } from "#/components/ui/label"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { reporteQueryOptions } from "../../../../../../../queries/iluminacion/reportes-queries"
import { Button } from "#/components/ui/button"
import { Lock, LockOpen } from "lucide-react"

export const Route = createFileRoute(
	"/usuario/$id/reportes/$reporteId/_header/resumen/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<span>Cargando reporte...</span>}>
			<Resumen />
		</Suspense>
	)
}

function Resumen() {
	const { id, reporteId } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(
		reporteQueryOptions({ userId: id, reporteId })
	)

	if (!reporte)
		return (
			<div className="italic text-foreground/50 tracking-wider text-sm p-10">
				No se encontro el reporte
			</div>
		)
	return (
		<div className="w-5/6 mx-auto flex flex-col gap-10 tracking-wider my-14 relative">
			<div className="flex flex-col gap-6">
				<span className="col-span-2 border-b border-white/50 mb-6">
					Resumen
				</span>
				<div className="flex flex-col gap-2">
					<Label className="text-amber-700 font-semibold">
						Conclusiones :{" "}
					</Label>
					<span>{reporte.conclusion}</span>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="text-amber-700 font-semibold">
						Observaciones :{" "}
					</Label>
					<span>{reporte.observacion}</span>
				</div>
				<div className="flex flex-col gap-2">
					<Label className="text-amber-700 font-semibold">
						Recomendaciones :{" "}
					</Label>
					<span>{reporte.recomendacion}</span>
				</div>

				<div className="mt-10 flex justify-center gap-4 items-center w-full">
					{reporte.creditConsumed ? (
						<LockOpen className="text-green-600" />
					) : (
						<Lock className="text-red-600" />
					)}

					<Link
						to={`/usuario/$id/reportes/$reporteId/pdf`}
						params={{ id, reporteId }}
					>
						<Button> Generar PDF</Button>
					</Link>
					<Link
						to={`/usuario/$id/reportes/$reporteId/pdf-reducida`}
						params={{ id, reporteId }}
					>
						<Button> Generar PDF (reducida)</Button>
					</Link>
				</div>
			</div>
		</div>
	)
}
