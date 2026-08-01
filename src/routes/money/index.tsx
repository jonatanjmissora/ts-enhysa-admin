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
import Loading from "#/components/loading"

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
		<div className="w-full h-full p-20">
			<Suspense fallback={<Loading />}>
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
			<TableHeader className="bg-background">
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
								<Link to="/usuario/$id" params={{ id: userId }}>
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
					? "/usuario/$id/reportes/$reporteId/general"
					: "/usuario/$id/reportes/$reporteId/general"
			}
			params={{ id: userId, reporteId }}
		>
			{reporte?.title.toUpperCase()}
		</Link>
	)
}
