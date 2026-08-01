import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { tecnicosQueryOptions } from "../../../../queries/tecnicos-queries"
import { Suspense } from "react"
import { imgSrc } from "#/lib/utils"
import Loading from "#/components/loading"

export const Route = createFileRoute("/usuario/$id/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<Loading />}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	const id = Route.useParams().id
	const tecnico = tecnicos?.find(t => t.userId === id)
	if (!tecnico) return <TecnicoVacio />
	return (
		<div className="w-full flex flex-col gap-10 my-20 p-10 text-sm rounded-lg">
			<span className="text-foreground/50 ml-auto">Id: {tecnico.id}</span>
			<div className="grid grid-cols-2 gap-2">
				<span className="text-right font-semibold text-amber-700">
					Telefono:
				</span>
				<span>{tecnico.telefono.toUpperCase()}</span>
				<span className="text-right font-semibold text-amber-700">Cargo:</span>
				<span>{tecnico.cargo.toUpperCase()}</span>
				<span className="text-right font-semibold text-amber-700">
					Localidad:
				</span>
				<span>{tecnico.localidad.toUpperCase()}</span>
				<span className="text-right font-semibold text-amber-700">
					Matricula:
				</span>
				<span>{tecnico.matricula.toUpperCase()}</span>
			</div>
			<div className="flex gap-4 flex-wrap justify-center items-center w-full">
				<div className="flex flex-col gap-1">
					<span className="font-semibold text-amber-700">
						Matricula Imagen:
					</span>
					<img
						src={imgSrc(tecnico.matriculaImg)}
						alt="foto"
						className="object-contain w-auto h-40 rounded-lg"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<span className="font-semibold text-amber-700">Firma Digital:</span>
					<img
						src={imgSrc(tecnico.firmaImg)}
						alt="foto"
						className="object-contain w-auto h-40 rounded-lg bg-white"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<span className="font-semibold text-amber-700">Empresa Imagen:</span>
					<img
						src={imgSrc(tecnico.empresaLogo)}
						alt="foto"
						className="object-contain w-auto h-40 rounded-lg"
					/>
				</div>
			</div>
		</div>
	)
}

function TecnicoVacio() {
	return (
		<div className="w-5/6 h-[30svh] flex flex-col gap-8 items-center justify-center mx-auto my-12">
			<span className="text-sm font-medium text-gray-500 italic text-center text-pretty">
				¡Ups! Parece que no tienes técnico registrado
			</span>
		</div>
	)
}
