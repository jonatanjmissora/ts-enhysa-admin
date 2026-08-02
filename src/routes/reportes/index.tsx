import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { allAreasQueryOptions } from "../../../queries/iluminacion/areas-queries"
import { allReportesQueryOptions } from "../../../queries/iluminacion/reportes-queries"
import { allLocalizadasQueryOptions } from "../../../queries/iluminacion/localizadas-queries"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { getUser } from "#/lib/utils"
import { usersQueryOptions } from "../../../queries/users-queries"
import { Lock, LockOpen } from "lucide-react"
import Loading from "#/components/loading"

export const Route = createFileRoute("/reportes/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full h-full sm:p-10 2xl:p-20">
			<Suspense fallback={<Loading />}>
				<Inner />
			</Suspense>
		</div>
	)
}

function Inner() {
	const { data: areas } = useSuspenseQuery(allAreasQueryOptions)
	const { data: localizadas } = useSuspenseQuery(allLocalizadasQueryOptions)
	const { data: reportes } = useSuspenseQuery(allReportesQueryOptions)
	const { data: users } = useSuspenseQuery(usersQueryOptions)

	if (!reportes) return <div>No hay informes</div>

	const rows = reportes
		?.map(reporte => {
			return {
				id: reporte.id,
				nombre: getUser(users, reporte.userId),
				reporte: reportes?.filter(r => r.id === reporte.id)[0],
				areas: areas?.filter(a => a.reportId === reporte.id),
				localizadas: localizadas?.filter(l => l.reportId === reporte.id),
			}
		})
		.sort((a, b) => a.nombre.localeCompare(b.nombre))

	return (
		<Table className="w-full mx-auto my-10">
			<TableHeader className="bg-background">
				<TableRow>
					<TableHead>Usuario</TableHead>
					<TableHead>Reporte</TableHead>
					<TableHead className="text-center">Areas</TableHead>
					<TableHead className="text-center">Localizadas</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows?.map(({ id, nombre, reporte, areas, localizadas }) => (
					<TableRow key={id}>
						<TableCell>
							<Link
								to="/usuario/$id"
								params={{ id: reporte.userId }}
								search={{ from: "reportes" }}
							>
								{nombre}
							</Link>
						</TableCell>
						<TableCell>
							<Link
								to="/usuario/$id/reportes/$reporteId/general"
								params={{ id: reporte.userId, reporteId: reporte.id }}
								search={{ from: "reportes" }}
							>
								{reporte.creditConsumed ? (
									<LockOpen className="size-4 text-green-500/50 inline mr-2" />
								) : (
									<Lock className="size-4 text-red-500/50 inline mr-2" />
								)}
								{reporte.title}
							</Link>
						</TableCell>
						<TableCell>
							<div className="flex flex-col gap-1">
								{areas?.map(a => (
									<span
										key={a.id}
										className="text-xs font-semibold text-primary"
									>
										{a.nombre} - {a.tipo}
									</span>
								))}
							</div>
						</TableCell>
						<TableCell>
							<div className="flex flex-col gap-1">
								{localizadas?.map(l => (
									<span
										key={l.id}
										className="text-xs font-semibold text-primary"
									>
										{l.nombre} - {l.tipo}
									</span>
								))}
							</div>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	)
}
