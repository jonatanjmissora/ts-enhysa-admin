import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { tecnicosQueryOptions } from "../../../../queries/tecnicos-queries"
import { Suspense } from "react"

export const Route = createFileRoute("/dashboard/$id/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando datos del técnico...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	const id = Route.useParams().id
	const tecnico = tecnicos?.find(t => t.userId === id)
	if (!tecnico) return <div>No hay técnico...</div>
	return (
		<div className="w-full flex flex-col gap-10 my-20 bg-accent sm:bg-background p-10 text-sm rounded-lg">
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
						src={tecnico.matriculaImg}
						alt="foto"
						className="object-contain w-auto h-40 rounded-lg"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<span className="font-semibold text-amber-700">Firma Digital:</span>
					<img
						src={tecnico.firmaImg}
						alt="foto"
						className="object-contain w-auto h-40 rounded-lg bg-white"
					/>
				</div>

				<div className="flex flex-col gap-1">
					<span className="font-semibold text-amber-700">Empresa Imagen:</span>
					<img
						src={tecnico.empresaLogo}
						alt="foto"
						className="object-contain w-auto h-40 rounded-lg"
					/>
				</div>
			</div>
		</div>
	)
}
