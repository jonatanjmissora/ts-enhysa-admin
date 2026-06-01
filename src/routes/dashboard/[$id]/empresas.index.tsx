import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { empresasQueryOptions } from "../../../../queries/empresas-queries"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "#/components/ui/accordion"
import type { EmpresaType } from "../../../../db/empresas/schema"
import { Suspense } from "react"

export const Route = createFileRoute("/dashboard/$id/empresas/")({
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
	const { data: empresas } = useSuspenseQuery(empresasQueryOptions(id))
	if (!empresas) return <EmpresasVacias />
	return (
		<div>
			<div className="w-full flex flex-col gap-2">
				<Accordion
					type="single"
					collapsible
					defaultValue=""
					className="flex flex-col gap-2 w-11/12 mx-auto py-20"
				>
					{empresas.map(empresa => (
						<AccordionItem key={empresa.id} value={empresa.id} className="py-2">
							<AccordionTrigger className="flex px-5 w-11/12 sm:w-full flex-wrap items-center bg-accent ring-[1px] dark:ring-foreground/10 ring-foreground/50">
								<div className="flex items-center gap-2 text-sm tracking-wider w-60 sm:w-max truncate">
									{empresa.razonSocial.toUpperCase()} -{" "}
									{empresa.direccion.toUpperCase()} - {empresa.cuit}
								</div>
							</AccordionTrigger>
							<AccordionContent>
								<Empresa empresa={empresa} />
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	)
}

function Empresa({ empresa }: { empresa: EmpresaType }) {
	return (
		<div className="bg-accent sm:bg-background py-20 flex items-center justify-center flex-col relative">
			<div className="grid grid-cols-2 gap-2">
				<span className="text-right font-semibold text-amber-700">
					Razón Social :
				</span>
				<span>{empresa.razonSocial.toUpperCase()}</span>
				<span className="text-right font-semibold text-amber-700">CUIT :</span>
				<span>{empresa.cuit}</span>
				<span className="text-right font-semibold text-amber-700">
					Dirección :
				</span>
				<span>{empresa.direccion.toUpperCase()}</span>
				<span className="text-right font-semibold text-amber-700">
					Localidad :
				</span>
				<span>{empresa.localidad.toUpperCase()}</span>
				<span className="text-right font-semibold text-amber-700">CP :</span>
				<span>{empresa.codigoPostal}</span>
				<span className="text-right font-semibold text-amber-700">
					Provincia :
				</span>
				<span>{empresa.provincia.toUpperCase()}</span>
				<span className="text-right font-semibold text-amber-700">
					Horarios :
				</span>
				<span>{empresa.horarios.toUpperCase()}</span>
			</div>

			<div className="flex gap-4 flex-wrap justify-center items-center w-full mt-10">
				<div className="flex flex-col gap-1 w-1/2">
					<span className="font-semibold text-amber-700">Empresa Logo :</span>
					<img
						src={empresa.logo}
						alt="foto"
						className="object-contain w-auto h-40 rounded-lg"
					/>
				</div>
			</div>
		</div>
	)
}

function EmpresasVacias() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes empresas registradas
			</span>
		</div>
	)
}
