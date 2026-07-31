import { createFileRoute } from "@tanstack/react-router"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { useSuspenseQuery } from "@tanstack/react-query"

export const Route = createFileRoute("/dashboard/$id/creditos/")({
	component: RouteComponent,
})

function RouteComponent() {
	// const { data: creditHistory } = useSuspenseQuery(allCreditHistoryQueryOptions)
	// const { data: users } = useSuspenseQuery(usersQueryOptions)

	// const rows = creditHistory?.map(ch => {
	// 	return {
	// 		id: ch.id,
	// 		userId: ch.userId,
	// 		nombre: getUser(users, ch.userId),
	// 		credits: ch.credits,
	// 		type: ch.type,
	// 		createdAt: ch.createdAt,
	// 		reporteId: ch.reportId,
	// 		mercadopagoId: ch.paymentId,
	// 	}
	// })

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
			{/* <TableBody>
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
			</TableBody> */}
		</Table>
	)
}
