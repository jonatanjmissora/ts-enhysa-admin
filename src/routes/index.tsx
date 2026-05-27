import { Button } from "#/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	return (
		<div className="p-8">
			<h1 className="text-4xl font-bold">Bienvenido a la seccion Administrados</h1>
			<nav className="flex flex-col gap-4 my-20">

			<Link to="/dashboard">
				<Button className="min-w-40">Tecnicos</Button>
			</Link>
			<Link to="/files">
				<Button className="min-w-40">Archivos</Button>
			</Link>
			</nav>

		</div>
	)
}
