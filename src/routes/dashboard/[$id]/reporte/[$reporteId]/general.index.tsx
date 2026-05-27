import { Label } from "#/components/ui/label"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { empresasQueryOptions } from "../../../../../../queries/empresas-queries"
import { instrumentosQueryOptions } from "../../../../../../queries/instrumentos-queries"
import { reporteQueryOptions } from "../../../../../../queries/iluminacion/reportes-queries"

export const Route = createFileRoute(
	"/dashboard/$id/reporte/$reporteId/general/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<span>Cargando reporte...</span>}>
			<General />
		</Suspense>
	)
}

function General() {
	const { id, reporteId } = Route.useParams()
	const { data: reporte } = useSuspenseQuery(
		reporteQueryOptions({ userId: id, reporteId })
	)
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions(id))
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions(id))
	const empresa = empresas?.find(empresa => empresa.id === reporte?.empresaId)
	const instrumento = instrumentos?.find(
		instrumento => instrumento.id === reporte?.instrumentoId
	)

	if (!reporte || !empresa || !instrumento)
		return (
			<div className="italic text-foreground/50 tracking-wider text-sm p-10">
				No se encontro el reporte
			</div>
		)

	return (
		<article className="min-h-screen w-5/6 mx-auto flex flex-col gap-10 tracking-wider mb-14 relative">
			<span className="text-center col-span-2 mb-14">
				{reporte.title.toUpperCase()} -{" "}
				{reporte?.finishedAt?.toLocaleDateString("it-IT")}
			</span>
			<div className="grid grid-cols-2 gap-2">
				<span className="col-span-2">Empresa</span>
				<Label className="text-right ml-auto">Nombre : </Label>
				<span>{empresa.razonSocial.toUpperCase()}</span>
				<Label className="text-right ml-auto">CUIT : </Label>
				<span>{empresa.cuit.toUpperCase()}</span>
				<Label className="text-right ml-auto">Direccion : </Label>
				<span>{empresa.direccion.toUpperCase()}</span>
				<Label className="text-right ml-auto">Localidad : </Label>
				<span>{empresa.localidad.toUpperCase()}</span>
				<Label className="text-right ml-auto">Provincia : </Label>
				<span>{empresa.provincia.toUpperCase()}</span>
				<Label className="text-right ml-auto">Horarios : </Label>
				<span>{empresa.horarios.toUpperCase()}</span>
				{empresa.logo && (
					<div className="col-span-2">
						<div className="h-20 w-full flex items-center justify-center">
							<img
								src={empresa.logo}
								alt="logo"
								className="h-full w-full object-contain"
							/>
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<span className="col-span-2">Instrumento</span>
				<Label className="text-right ml-auto">Nombre : </Label>
				<span>{instrumento.nombre.toUpperCase()}</span>
				<Label className="text-right ml-auto">Marca : </Label>
				<span>{instrumento.marca.toUpperCase()}</span>
				<Label className="text-right ml-auto">Modelo : </Label>
				<span>{instrumento.modelo.toUpperCase()}</span>
				<Label className="text-right ml-auto">Serie : </Label>
				<span>{instrumento.serie.toUpperCase()}</span>
				<Label className="text-right ml-auto">Calibración : </Label>
				<span>{instrumento.fechaCalibracion.toLocaleDateString("it-IT")}</span>
				{instrumento.imagenes[0] !== "" && (
					<div className="w-11/12 my-10 col-span-2">
						<div className="flex w-full grid-cols-4 gap-1 content-center">
							{instrumento.imagenes.map(url => {
								return (
									<div className="relative w-full h-20 " key={url}>
										<img
											src={url}
											alt=""
											className="h-full w-full object-contain rounded border border-foreground/10"
										/>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<span className="col-span-2">Condiciones</span>
				<Label className="text-right ml-auto">Clima : </Label>
				<span>{reporte.clima[0].toUpperCase()}</span>
				<Label className="text-right ml-auto">Humedad : </Label>
				<span>{reporte.clima[1].toUpperCase()}%</span>
				<Label className="text-right ml-auto">Temperatura : </Label>
				<span>{reporte.clima[2].toUpperCase()}°C</span>
				<Label className="text-right ml-auto">Fecha : </Label>
				<span>
					{reporte.finishedAt
						? reporte.finishedAt.toLocaleDateString("it-IT")
						: "En curso"}
				</span>
				<Label className="text-right ml-auto">Hora : </Label>
				<span>
					{reporte.finishedAt
						? reporte.finishedAt.toLocaleTimeString("it-IT")
						: "En curso"}
				</span>
			</div>
		</article>
	)
}
