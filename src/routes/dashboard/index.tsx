import { createFileRoute, Link } from "@tanstack/react-router"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"

export const Route = createFileRoute("/dashboard/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4 justify-center items-center">
			<div className="flex gap-4 items-center justify-center p-4">
				<div className="flex gap-4 size-12 relative">
					<img
						src="EnHySa_logo.webp"
						alt="logo"
						className="absolute inset-0 w-full h-full object-cover"
					/>
				</div>
				<span className="text-2xl font-semibold">Enhysa Admin Panel</span>
			</div>
			<Suspense fallback={<div>Cargando técnicos...</div>}>
				<Inner />
			</Suspense>
		</div>
	)
}

function Inner() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	if (!tecnicos) return <div>No hay técnicos...</div>
	return (
		<ul className="flex flex-col gap-4 my-20">
			{tecnicos.map(tecnico => (
				<li key={tecnico.id}>
					<Link
						to="/dashboard/$id"
						params={{ id: tecnico.userId }}
						className="tracking-widest text-lg"
					>
						{tecnico.nombre.toUpperCase()}
					</Link>
				</li>
			))}
		</ul>
	)
}
