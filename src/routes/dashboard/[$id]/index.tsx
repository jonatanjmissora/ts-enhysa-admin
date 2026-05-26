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
		<div className="w-full flex flex-col gap-10">
			<div className="grid grid-cols-2 gap-2">
				<span className="text-right font-semibold">Nombre:</span>
				<span>{tecnico.nombre.toUpperCase()}</span>
				<span className="text-right font-semibold">Telefono:</span>
				<span>{tecnico.telefono.toUpperCase()}</span>
				<span className="text-right font-semibold">Cargo:</span>
				<span>{tecnico.cargo.toUpperCase()}</span>
				<span className="text-right font-semibold">Localidad:</span>
				<span>{tecnico.localidad.toUpperCase()}</span>
				<span className="text-right font-semibold">Matricula:</span>
				<span>{tecnico.matricula.toUpperCase()}</span>
				<span className="text-right font-semibold">Matricula Imagen:</span>
				<div className="relative w-full h-50">
					<img
						src={tecnico.matriculaImg}
						alt="foto"
						className="object-contain absolute mr-auto w-max h-full rounded-lg"
					/>
				</div>
				<span className="text-right font-semibold">Firma Digital:</span>
				<div className="relative w-full h-50">
					<img
						src={tecnico.firmaImg}
						alt="firma"
						className="object-contain absolute mr-auto w-max h-full rounded-lg"
					/>
				</div>
				<span className="text-right font-semibold">Logo Empresa:</span>
				<div className="relative w-full h-50">
					<img
						src={tecnico.empresaLogo}
						alt="foto"
						className="object-contain absolute mr-auto w-max h-full rounded-lg"
					/>
				</div>
			</div>
		</div>
	)
}
