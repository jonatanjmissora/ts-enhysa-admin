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
import { localizadasQueryOptions } from "../../../../../../../queries/iluminacion/localizadas-queries"
import type { LocalizadaIluminacionType } from "../../../../../../../db/reportes/iluminacion/localizadas/scheme"
import { getNumeroCeldas } from "#/lib/utils"

export const Route = createFileRoute(
	"/usuario/$id/reportes/$reporteId/_header/areas/"
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
	const { data: localizadas } = useSuspenseQuery(
		localizadasQueryOptions({ userId: id, reporteId })
	)
	if (!areas) return <AreasVacias />
	if (!localizadas) return <LocalizadasVacias />
	return (
		<article className="flex flex-col gap-4">
			<div className="flex flex-col gap-2 py-20">
				<span className="text-foreground text-xl font-semibold">Areas</span>
				<div className="w-full flex flex-col gap-2">
					<Accordion
						type="single"
						collapsible
						defaultValue=""
						className="flex flex-col gap-2 w-11/12 mx-auto"
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
			<div className="flex flex-col gap-2">
				<span className="text-foreground text-xl font-semibold">
					Localizadas
				</span>
				<div className="w-full flex flex-col gap-2">
					<Accordion
						type="single"
						collapsible
						defaultValue=""
						className="flex flex-col gap-2 w-11/12 mx-auto"
					>
						{localizadas.map(localizada => (
							<AccordionItem
								key={localizada.id}
								value={localizada.id}
								className="py-2"
							>
								<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center bg-accent ring-[1px] dark:ring-foreground/10 ring-foreground/50">
									<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
										{localizada.nombre.toUpperCase()} -{" "}
										{localizada.tipo.toUpperCase()}
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<Localizada localizada={localizada} />
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</article>
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
		<div className="py-20 flex items-center justify-center flex-col relative">
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
				<span className="ml-auto text-amber-700 font-semibold">
					Nro mediciones :
				</span>
				<span>{getNumeroCeldas(area.largo, area.ancho, area.alto)}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Mediciones :
				</span>
				<span>
					{area.puntos.filter(punto => punto > 0).length} / {area.puntos.length}
				</span>
				<span className="ml-auto text-amber-700 font-semibold">Puntos :</span>
				<span>{area.puntos.join(", ")}</span>

				<Grilla area={area} />

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

function Grilla({ area }: { area: AreaIluminacionType }) {
	const ancho = area.ancho
	const largo = area.largo
	const alto = area.alto
	const div = Math.sqrt(getNumeroCeldas(ancho, largo, alto))

	return (
		<div className="w-full flex flex-col items-center gap-2 col-span-2 pt-6 pb-4">
			<div className="relative w-full max-w-[560px]">
				<div className="absolute -top-5 left-0 right-0 flex justify-center">
					<span className="text-xs text-gray-500">Ancho {ancho}m</span>
				</div>
				<div className="absolute top-1/2 -translate-y-1/2 -left-7 rotate-[-90deg]">
					<span className="text-xs text-gray-500 whitespace-nowrap">
						Largo {largo}m
					</span>
				</div>
				<div
					className="grid w-full border border-gray-300"
					style={{
						gridTemplateColumns: `repeat(${div}, minmax(0, 1fr))`,
						gridTemplateRows: `repeat(${div}, minmax(0, 1fr))`,
						aspectRatio: `${ancho} / ${largo}`,
					}}
				>
					{area.puntos.map((punto, index) => (
						<div
							key={index}
							className="flex flex-col items-center justify-center border border-gray-300"
						>
							{punto !== 0 && (
								<>
									<span className="text-[8px] leading-none opacity-50">
										({index + 1})
									</span>
									<span className="text-sm leading-none">{punto}</span>
								</>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

function Localizada({ localizada }: { localizada: LocalizadaIluminacionType }) {
	return (
		<div className="py-20 flex items-center justify-center flex-col relative">
			<span className="absolute top-2 right-2 text-foreground/50">
				id: {localizada.id}
			</span>
			<div className="grid grid-cols-2 gap-2">
				<span className="ml-auto text-amber-700 font-semibold">Nombre :</span>
				<span>{localizada.nombre.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">Tipo :</span>
				<span>{localizada.tipo.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Iluminación :
				</span>
				<span>{localizada.iluminacion.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Iluminación tipo :
				</span>
				<span>{localizada.iluminacionTipo.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Iluminación fuente :
				</span>
				<span>{localizada.iluminacionFuente.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Valor requerido :
				</span>
				<span>{localizada.valorRequerido.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">
					Observaciones :
				</span>
				<span>{localizada.observaciones.toUpperCase()}</span>
				<span className="ml-auto text-amber-700 font-semibold">Valor :</span>
				<span>{localizada.valor} lux</span>
				<span className="ml-auto text-amber-700 font-semibold">Comienzo :</span>
				<span>
					{localizada.timestamps[0]?.toLocaleDateString("it-IT")}-{" "}
					{localizada.timestamps[0]?.toLocaleTimeString("it-IT")}
				</span>

				{localizada.imagenes.length > 0 && (
					<div className="w-full flex gap-2 flex-wrap content-center justify-center col-span-2">
						{localizada.imagenes.map(imagen => (
							<img
								key={imagen}
								src={imagen}
								alt="Imagen del instrumento"
								className="w-auto h-39 object-contain object-center border"
							/>
						))}
					</div>
				)}
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

function LocalizadasVacias() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes localizadas registradas
			</span>
		</div>
	)
}
