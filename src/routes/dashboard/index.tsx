import { createFileRoute, Link } from "@tanstack/react-router"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Check } from "lucide-react"
import { usersQueryOptions } from "../../../queries/users-queries"
import { allEmpresasQueryOptions } from "../../../queries/empresas-queries"
import { allReportesQueryOptions } from "../../../queries/iluminacion/reportes-queries"
import { allCreditHistoryQueryOptions } from "../../../queries/credits/credit-history-queries"
import { getUser } from "#/lib/utils"

export const Route = createFileRoute("/dashboard/")({
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
			<Suspense fallback={<div>Cargando usuarios...</div>}>
				<Inner />
			</Suspense>
		</div>
	)
}

function Inner() {
	const { data: users } = useSuspenseQuery(usersQueryOptions)
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	const { data: empresas } = useSuspenseQuery(allEmpresasQueryOptions)
	const { data: reportes } = useSuspenseQuery(allReportesQueryOptions)
	const { data: creditHistory } = useSuspenseQuery(allCreditHistoryQueryOptions)

	const rows = (users ?? [])
		.map(user => {
			const userTecnicos = tecnicos?.filter(t => t.userId === user.id) ?? []
			const userEmpresas = empresas?.filter(e => e.userId === user.id) ?? []
			const userReportes = reportes?.filter(r => r.userId === user.id) ?? []
			const userCredits = creditHistory?.filter(c => c.userId === user.id) ?? []

			return {
				user,
				nombre: getUser(users, user.id),
				esTecnico: userTecnicos.length > 0,
				cantEmpresas: userEmpresas.length,
				cantReportes: userReportes.length,
				creditosAdquiridos: userCredits
					.filter(c => c.type === "purchase")
					.reduce((sum, c) => sum + c.credits, 0),
				creditosConsumidos: userCredits
					.filter(c => c.type === "consume")
					.reduce((sum, c) => sum + c.credits, 0),
			}
		})
		.sort((a, b) => a.nombre.localeCompare(b.nombre))

	return (
		<Table className="w-full mx-auto my-10">
			<TableHeader>
				<TableRow>
					<TableHead>Nombre</TableHead>
					<TableHead>Mail</TableHead>
					<TableHead className="text-center">Imagen</TableHead>
					<TableHead className="text-center">Técnico</TableHead>
					<TableHead className="text-center">Empresas</TableHead>
					<TableHead className="text-center">Reportes</TableHead>
					<TableHead className="text-center">
						<span>Créditos</span>
						<span className="block">adquiridos</span>
					</TableHead>
					<TableHead className="text-center">
						<span>Créditos</span>
						<span className="block">consumidos</span>
					</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{rows.map(
					({
						user,
						nombre,
						esTecnico,
						cantEmpresas,
						cantReportes,
						creditosAdquiridos,
						creditosConsumidos,
					}) => (
						<TableRow key={user.id}>
							<TableCell>
								<Link to="/dashboard/$id" params={{ id: user.id }}>
									{nombre}
								</Link>
							</TableCell>
							<TableCell className="text-xs">{user.email}</TableCell>
							<TableCell className="text-center">
								{user.image ? (
									<img
										src={user.image}
										alt={`${user.name} avatar`}
										className="mx-auto size-8 rounded-full object-cover"
									/>
								) : null}
							</TableCell>
							<TableCell className="text-center">
								{esTecnico ? <Check className="mx-auto size-4" /> : null}
							</TableCell>
							<TableCell className="text-center">
								{cantEmpresas || null}
							</TableCell>
							<TableCell className="text-center">
								{cantReportes || null}
							</TableCell>
							<TableCell className="text-center">
								{creditosAdquiridos || null}
							</TableCell>
							<TableCell className="text-center">
								{creditosConsumidos || null}
							</TableCell>
						</TableRow>
					)
				)}
			</TableBody>
		</Table>
	)
}
