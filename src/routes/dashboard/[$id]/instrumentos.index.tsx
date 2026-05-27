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
		<Suspense fallback={<div>Cargando datos de las empresas...</div>}>
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
						className="border-b border-foreground/10 last:border-b-0 py-2"
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
		<div className="bg-accent py-20 flex items-center justify-center flex-col relative">
			<div className="grid-cols-1 grid sm:grid-cols-2 gap-8 w-5/6 my-10">
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="marca">
						Marca
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="marca"
						placeholder="Marca"
						value={instrumento.marca.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="cargo">
						Modelo
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="modelo"
						placeholder="Modelo"
						value={instrumento.modelo.toUpperCase()}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="serie">
						Nro Serie
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="serie"
						placeholder="Serie"
						value={instrumento.serie}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1">
					<Label className="tracking-wider" htmlFor="calibracion">
						Calibración
					</Label>
					<Input
						onFocus={e => e.target.select()}
						id="calibracion"
						placeholder="Calibracion"
						value={instrumento.fechaCalibracion.toLocaleDateString("it-IT", {
							day: "2-digit",
							month: "2-digit",
							year: "numeric",
						})}
						readOnly
					/>
				</div>
				<div className="flex flex-col gap-1 col-span-2">
					<Label>Imágenes del Certificado</Label>
					{instrumento.imagenesCalibracion.length > 0 ? (
						<div className="flex w-fullgap-2 content-center">
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

				<div className="flex flex-col gap-1 col-span-2">
					<Label>Imágenes Instrumento</Label>
					{instrumento.imagenes.length > 0 ? (
						<div className="w-full flex gap-2 content-center">
							{instrumento.imagenes.map(imagen => (
								<img
									key={imagen}
									src={imagen}
									alt="Imagen del instrumento"
									className="w-auto h-40 object-contain object-center"
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
