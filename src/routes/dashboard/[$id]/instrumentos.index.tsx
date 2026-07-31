import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion"
import { Input } from "#/components/ui/input"
import { Label } from "#/components/ui/label"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense } from "react"
import { instrumentosQueryOptions } from "../../../../queries/instrumentos-queries"
import type { InstrumentoType } from "../../../../db/instrumentos/schema"

export const Route = createFileRoute("/dashboard/$id/instrumentos/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando instrumentos...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const id = Route.useParams().id
	const { data: instrumentos } = useSuspenseQuery(instrumentosQueryOptions(id))

	if (!instrumentos || instrumentos.length === 0) return <InstrumentosVacios />

	return (
		<div className="w-full flex flex-col gap-2">
			<Accordion
				type="single"
				collapsible
				defaultValue=""
				className="flex flex-col gap-2 w-11/12 mx-auto py-20"
			>
				{instrumentos.map(instrumento => (
					<AccordionItem
						key={instrumento.id}
						value={instrumento.id}
						className="py-2"
					>
						<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center bg-accent ring-[1px] dark:ring-foreground/10 ring-foreground/50">
							<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
								{instrumento.nombre.toUpperCase()} -{" "}
								{instrumento.marca.toUpperCase()}
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<Instrumento instrumento={instrumento} />
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	)
}

function Instrumento({ instrumento }: { instrumento: InstrumentoType }) {
	return (
		<div className="bg-accent sm:bg-background py-20 flex items-center justify-center flex-col relative">
			<span className="absolute top-2 right-2 text-foreground/50 ml-auto">
				id: {instrumento.id}
			</span>
			<div className="grid grid-cols-2 gap-2">
				<span className="text-right  text-amber-700">Nombre :</span>
				<span>{instrumento.nombre.toUpperCase()}</span>

				<span className="text-right  text-amber-700">Marca :</span>
				<span>{instrumento.marca.toUpperCase()}</span>

				<span className="text-right  text-amber-700">Modelo :</span>
				<span>{instrumento.modelo.toUpperCase()}</span>

				<span className="text-right  text-amber-700">Serie :</span>
				<span>{instrumento.serie.toUpperCase()}</span>

				<span className="text-right  text-amber-700">Calibración :</span>
				<span>
					{instrumento.fechaCalibracion
						.toLocaleDateString("it-IT", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})
						.toUpperCase()}
				</span>
			</div>

			<div className="flex flex-col gap-1 col-span-2 mt-10">
				<span className="text-center font-semibold text-amber-700">
					Imágenes del Certificado
				</span>
				{instrumento.imagenesCalibracion.length > 0 ? (
					<div className="flex w-full gap-2 content-center">
						{instrumento.imagenesCalibracion.map(imagen => (
							<img
								key={imagen}
								src={imagen}
								alt="Imagen del Certificado"
								className="w-auto h-40 object-contain object-center"
							/>
						))}
					</div>
				) : (
					<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
						No has cargado el certificado de calibración
					</span>
				)}
			</div>

			<div className="flex flex-col gap-1 col-span-2 mt-10">
				<span className="text-center font-semibold text-amber-700">
					Imágenes Instrumento
				</span>
				{instrumento.imagenes.length > 0 ? (
					<div className="w-full flex gap-2 flex-wrap content-center">
						{instrumento.imagenes.map(imagen => (
							<img
								key={imagen}
								src={imagen}
								alt="Imagen del instrumento"
								className="w-auto h-39 object-contain object-center"
							/>
						))}
					</div>
				) : (
					<span className="w-full text-center rounded-lg bg-secondary/20 ring-[1px] ring-foreground/10 p-2.5 text-xs font-medium text-gray-500 italic">
						No has cargado imágenes del instrumento
					</span>
				)}
			</div>
		</div>
	)
}

function InstrumentosVacios() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes instrumentos registrados
			</span>
		</div>
	)
}
