import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useSuspenseQuery } from "@tanstack/react-query"
import { allCreditHistoryQueryOptions } from "../../../queries/credits/credit-history-queries"
import { usersQueryOptions } from "../../../queries/users-queries"
import { getUser } from "#/lib/utils"
import { reporteQueryOptions } from "../../../queries/iluminacion/reportes-queries"

const spanishObj = {
	purchase: "Compra",
	bonus: "Recarga",
	refund: "Reembolso",
	consume: "Consumo",
}

export const Route = createFileRoute("/money/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4 justify-center items-center w-full">
			<Link to="/" className="flex gap-4 items-center justify-center p-4">
				<div className="flex gap-4 size-12 relative">
					<img
						src="EnHySa_logo.webp"
						alt="logo"
						className="absolute inset-0 w-full h-full object-cover"
					/>
				</div>
				<span className="text-2xl font-semibold">Enhysa Admin Panel</span>
			</Link>
			<Suspense fallback={<div>Cargando historial de pagos...</div>}>
				<Inner />
			</Suspense>
		</div>
	)
}

function Inner() {
	const { data: creditHistory } = useSuspenseQuery(allCreditHistoryQueryOptions)
	const { data: users } = useSuspenseQuery(usersQueryOptions)

	const rows = creditHistory?.map(ch => {
		return {
			id: ch.id,
			userId: ch.userId,
			nombre: getUser(users, ch.userId),
			credits: ch.credits,
			type: ch.type,
			createdAt: ch.createdAt,
			reporteId: ch.reportId,
			mercadopagoId: ch.paymentId,
		}
	})

	return (
		<Table className="w-full mx-auto my-10">
			<TableHeader>
				<TableRow>
					<TableHead>Fecha</TableHead>
					<TableHead>Usuario</TableHead>
					<TableHead className="text-center">Operacion</TableHead>
					<TableHead className="text-center">Créditos</TableHead>
					<TableHead className="text-center">Reporte ID</TableHead>
					<TableHead className="text-center">Mercadopago ID</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows?.map(
					({
						id,
						userId,
						nombre,
						credits,
						type,
						createdAt,
						reporteId,
						mercadopagoId,
					}) => (
						<TableRow key={id}>
							<TableCell className="text-xs">
								{createdAt.toLocaleString()}
							</TableCell>
							<TableCell>
								<Link to="/dashboard/$id" params={{ id: userId }}>
									{nombre}
								</Link>
							</TableCell>
							<TableCell className="text-center">{spanishObj[type]}</TableCell>
							<TableCell className="text-center">{credits}</TableCell>
							<TableCell className="text-center">
								<Suspense fallback={<span>...</span>}>
									<ReporteTitle userId={userId} reporteId={reporteId || ""} />
								</Suspense>
							</TableCell>
							<TableCell className="text-center">{mercadopagoId}</TableCell>
						</TableRow>
					)
				)}
			</TableBody>
		</Table>
	)
}

function ReporteTitle({
	userId,
	reporteId,
}: {
	userId: string
	reporteId: string
}) {
	const { data: reporte } = useSuspenseQuery(
		reporteQueryOptions({ userId, reporteId })
	)
	return (
		<Link
			to={
				reporte?.finishedAt
					? "/dashboard/$id/reportes/$reporteId/general"
					: "/dashboard/$id/reportes/$reporteId/general"
			}
			params={{ id: userId, reporteId }}
		>
			{reporte?.title.toUpperCase()}
		</Link>
	)
}
