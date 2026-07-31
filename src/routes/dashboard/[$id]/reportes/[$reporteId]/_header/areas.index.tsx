import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { areasQueryOptions } from "../../../../../../../queries/iluminacion/areas-queries"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion"
import type { AreaIluminacionType } from "../../../../../../../db/reportes/iluminacion/areas/scheme"
import { ChartArea } from "#/components/ChartArea"

export const Route = createFileRoute(
	"/dashboard/$id/reportes/$reporteId/_header/areas/"
)({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<span>Cargando reporte...</span>}>
			<Areas />
		</Suspense>
	)
}

function Areas() {
	const { id, reporteId } = Route.useParams()
	const { data: areas } = useSuspenseQuery(
		areasQueryOptions({ userId: id, reporteId })
	)
	if (!areas) return <AreasVacias />
	return (
		<div>
			<div className="w-full flex flex-col gap-2">
				<Accordion
					type="single"
					collapsible
					defaultValue=""
					className="flex flex-col gap-2 w-11/12 mx-auto py-20"
				>
					{areas.map(area => (
						<AccordionItem key={area.id} value={area.id} className="py-2">
							<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center bg-accent ring-[1px] dark:ring-foreground/10 ring-foreground/50">
								<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
									{area.nombre.toUpperCase()} - {area.tipo.toUpperCase()}
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<Area area={area} />
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	)
}

function Area({ area }: { area: AreaIluminacionType }) {
	const tiemposValidos = area.timestamps.filter(
		fecha => fecha > new Date(1970, 0, 1, 0, 0, 0)
	)
	const sortedTiemposValidosByTimestamp = tiemposValidos.sort(
		(a, b) => a.getTime() - b.getTime()
	)
	const tiempoValidoInicio = sortedTiemposValidosByTimestamp[0]
	const tiempoValidoFin =
		sortedTiemposValidosByTimestamp[sortedTiemposValidosByTimestamp.length - 1]

	return (
		<div className="bg-accent sm:bg-background py-20 flex items-center justify-center flex-col relative">
			<span className="absolute top-2 right-2 text-foreground/50">
				id: {area.id}
			</span>
			<div className="grid grid-cols-2 gap-2">
				<span className="ml-auto text-amber-700 font-semibold">Nombre :</span>
				<span>{area.nombre.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">Tipo :</span>
				<span>{area.tipo.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Iluminación :
				</span>
				<span>{area.iluminacion.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Iluminación tipo :
				</span>
				<span>{area.iluminacionTipo.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Iluminación fuente :
				</span>
				<span>{area.iluminacionFuente.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Valor requerido :
				</span>
				<span>{area.valorRequerido.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Observaciones :
				</span>
				<span>{area.observaciones.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">Largo :</span>
				<span>{area.largo}mts</span>
				<span className="ml-auto text-amber-700 font-semibold">Ancho :</span>
				<span>{area.ancho}mts</span>
				<span className="ml-auto text-amber-700 font-semibold">Alto :</span>
				<span>{area.alto}mts</span>
				<span className="ml-auto text-amber-700 font-semibold">Comienzo :</span>
				<span>
					{tiempoValidoInicio?.toLocaleDateString("it-IT")} -{" "}
					{tiempoValidoInicio?.toLocaleTimeString("it-IT")}
				</span>
				<span className="ml-auto text-amber-700 font-semibold">Fin :</span>
				<span>
					{tiempoValidoFin?.toLocaleDateString("it-IT")} -{" "}
					{tiempoValidoFin?.toLocaleTimeString("it-IT")}
				</span>
				<span className="ml-auto text-amber-700 font-semibold">Puntos :</span>
				<span>{area.puntos.join(", ")}</span>

				{area.imagenes.length > 0 && (
					<div className="w-full flex gap-2 flex-wrap content-center justify-center col-span-2">
						{area.imagenes.map(imagen => (
							<img
								key={imagen}
								src={imagen}
								alt="Imagen del instrumento"
								className="w-auto h-39 object-contain object-center border"
							/>
						))}
					</div>
				)}
				<div className="w-full flex items-center justify-center col-span-2 sm:overflow-x-visible overflow-x-scroll pl-15 py-5 sm:py-0">
					<ChartArea puntos={area.puntos} requerido={area.valorRequerido} />
				</div>
			</div>
		</div>
	)
}

function AreasVacias() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes areas registradas
			</span>
		</div>
	)
}
