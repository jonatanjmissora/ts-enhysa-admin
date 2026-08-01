import { createFileRoute, Link } from "@tanstack/react-router"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useSuspenseQuery } from "@tanstack/react-query"
import { creditHistoryByUserQueryOptions } from "../../../../queries/credits/credit-history-queries"
import { Suspense } from "react"
import { creditPaymentsByUserQueryOptions } from "../../../../queries/credits/credit-payments-queries"
import { reporteQueryOptions } from "../../../../queries/iluminacion/reportes-queries"

const spanishTypeObj = {
	purchase: "Compra",
	bonus: "Recarga",
	refund: "Reembolso",
	consume: "Consumo",
}

const spanishPaymentStatusObj = {
	approved: "Aprobado",
	rejected: "Rechazado",
	pending: "Pendiente",
	undef: "",
}

export const Route = createFileRoute("/usuario/$id/creditos/")({
	component: RouteComponent,
})

function RouteComponent() {
	const id = Route.useParams().id
	return (
		<Suspense fallback={<div>Cargando créditos...</div>}>
			<Inner id={id} />
		</Suspense>
	)
}

function Inner({ id }: { id: string }) {
	const { data: creditHistory } = useSuspenseQuery(
		creditHistoryByUserQueryOptions({ userId: id })
	)
	const { data: payments } = useSuspenseQuery(
		creditPaymentsByUserQueryOptions({ userId: id })
	)

	console.log("payments", payments)
	// const { data: users } = useSuspenseQuery(usersQueryOptions)

	const rows = creditHistory?.map(ch => {
		return {
			id: ch.id,
			fecha:
				payments?.find(p => p.mpPaymentId === ch.paymentId)?.updatedAt ||
				ch.createdAt,
			operacion: ch.type,
			creditos: ch.credits,
			reporteId: ch.reportId,
			userId: ch.userId,
			mercadopagoId: ch.paymentId,
			estado: payments?.find(p => p.mpPaymentId === ch.paymentId)?.status,
			comienzo: payments?.find(p => p.mpPaymentId === ch.paymentId)?.createdAt,
			finalizado: payments?.find(p => p.mpPaymentId === ch.paymentId)
				?.updatedAt,
		}
	})

	return (
		<Table className="w-full mx-auto my-10">
			<TableHeader>
				<TableRow>
					<TableHead>Fecha</TableHead>
					<TableHead className="text-center">Operacion</TableHead>
					<TableHead className="text-center">Créditos</TableHead>
					<TableHead className="text-center">Reporte ID</TableHead>
					<TableHead className="text-center">Mercadopago ID</TableHead>
					<TableHead className="text-center">Estado</TableHead>
					<TableHead className="text-center">Comienzo</TableHead>
					<TableHead className="text-center">Finalizado</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows?.map(
					({
						fecha,
						operacion,
						creditos,
						reporteId,
						mercadopagoId,
						estado,
						comienzo,
						finalizado,
					}) => (
						<TableRow key={mercadopagoId}>
							<TableCell className="text-xs">
								{fecha?.toLocaleString()}
							</TableCell>
							<TableCell className="text-center">
								{spanishTypeObj[operacion]}
							</TableCell>
							<TableCell className="text-center">{creditos}</TableCell>
							<TableCell className="text-center">
								<Suspense fallback={<div>...</div>}>
									<ReporteTitle userId={id} reporteId={reporteId || ""} />
								</Suspense>
							</TableCell>
							<TableCell className="text-center">{mercadopagoId}</TableCell>
							<TableCell className="text-center">
								{spanishPaymentStatusObj[estado || "undef"]}
							</TableCell>
							<TableCell className="text-center text-xs">
								{comienzo?.toLocaleString()}
							</TableCell>
							<TableCell className="text-center text-xs">
								{finalizado?.toLocaleString()}
							</TableCell>
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
