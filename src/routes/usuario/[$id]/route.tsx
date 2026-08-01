import { createFileRoute, Outlet } from "@tanstack/react-router"
import { empresasQueryOptions } from "../../../../queries/empresas-queries"
import { Suspense } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { tecnicosQueryOptions } from "../../../../queries/tecnicos-queries"
import { instrumentosQueryOptions } from "../../../../queries/instrumentos-queries"
import { reportesQueryOptions } from "../../../../queries/iluminacion/reportes-queries"
import { userQueryOptions } from "../../../../queries/users-queries"
import { z } from "zod"

const searchSchema = z.object({
	from: z.string().optional(),
})

export const Route = createFileRoute("/usuario/$id")({
	validateSearch: searchSchema,
	loader: ({ context, params }) => {
		context.queryClient.ensureQueryData(tecnicosQueryOptions)
		context.queryClient.ensureQueryData(empresasQueryOptions(params.id))
		context.queryClient.ensureQueryData(instrumentosQueryOptions(params.id))
		context.queryClient.ensureQueryData(reportesQueryOptions(params.id))
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full flex flex-col justify-center">
			<Suspense fallback={<div>Cargando nombre...</div>}>
				<UserName />
			</Suspense>
			<Outlet />
		</div>
	)
}

function UserName() {
	const id = Route.useParams().id
	const { data: user } = useSuspenseQuery(userQueryOptions(id))
	return (
		<div className="w-full px-10 text-center bg-background py-2 text-xl flex justify-center items-center gap-10">
			<span>
				{user?.[0]?.name
					? user?.[0]?.name?.toUpperCase()
					: "Usuario no encontrado"}
			</span>
			<span className="text-foreground/50 text-sm tracking-wide ml-auto">
				id: {user?.[0]?.id}
			</span>
		</div>
	)
}
