import { Label } from "#/components/ui/label"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
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

	if (!reporte)
		return (
			<div className="italic text-foreground/50 tracking-wider text-sm p-10">
				No se encontro el reporte
			</div>
		)

	return (
		<article className="min-h-screen w-5/6 mx-auto flex flex-col gap-10 tracking-wider my-14 relative">
			<div className="grid grid-cols-2 gap-2">
				<span className="col-span-2 border-b border-white/50">Empresa</span>
				<Label className="text-right ml-auto">Nombre : </Label>
				<span>{reporte.empresa.razonSocial.toUpperCase()}</span>
				<Label className="text-right ml-auto">CUIT : </Label>
				<span>{reporte.empresa.cuit.toUpperCase()}</span>
				<Label className="text-right ml-auto">Direccion : </Label>
				<span>{reporte.empresa.direccion.toUpperCase()}</span>
				<Label className="text-right ml-auto">Localidad : </Label>
				<span>{reporte.empresa.localidad.toUpperCase()}</span>
				<Label className="text-right ml-auto">Provincia : </Label>
				<span>{reporte.empresa.provincia.toUpperCase()}</span>
				<Label className="text-right ml-auto">Horarios : </Label>
				<span>{reporte.empresa.horarios.toUpperCase()}</span>
				{reporte.empresa.logo && (
					<div className="col-span-2">
						<div className="h-20 w-full flex items-center justify-center">
							<img
								src={reporte.empresa.logo}
								alt="logo"
								className="h-full w-full object-contain"
							/>
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<span className="col-span-2 border-b border-white/50">Instrumento</span>
				<Label className="text-right ml-auto">Nombre : </Label>
				<span>{reporte.instrumento.nombre.toUpperCase()}</span>
				<Label className="text-right ml-auto">Marca : </Label>
				<span>{reporte.instrumento.marca.toUpperCase()}</span>
				<Label className="text-right ml-auto">Modelo : </Label>
				<span>{reporte.instrumento.modelo.toUpperCase()}</span>
				<Label className="text-right ml-auto">Serie : </Label>
				<span>{reporte.instrumento.serie.toUpperCase()}</span>
				<Label className="text-right ml-auto">Calibración : </Label>
				<span>
					{reporte.instrumento.fechaCalibracion.toLocaleDateString("it-IT")}
				</span>
				{reporte.instrumento.imagenesCalibracion[0] !== "" && (
					<div className="w-full my-10 col-span-2">
						<div className="w-full flex gap-2 flex-wrap content-center justify-center">
							{reporte.instrumento.imagenesCalibracion.map(url => {
								return (
									<img
										key={url}
										src={url}
										alt=""
										className="w-auto h-35 object-contain object-center"
									/>
								)
							})}
						</div>
					</div>
				)}
				{reporte.instrumento.imagenes[0] !== "" && (
					<div className="w-full my-10 col-span-2">
						<div className="w-full flex gap-2 flex-wrap content-center justify-center">
							{reporte.instrumento.imagenes.map(url => {
								return (
									<img
										key={url}
										src={url}
										alt=""
										className="w-auto h-35 object-contain object-center"
									/>
								)
							})}
						</div>
					</div>
				)}
			</div>

			<div className="grid grid-cols-2 gap-2">
				<span className="col-span-2 border-b border-white/50">Condiciones</span>
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
