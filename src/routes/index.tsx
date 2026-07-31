import { Button } from "#/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
	RulerDimensionLine,
	UserRound,
	Image,
	CircleDollarSign,
} from "lucide-react"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	return (
		<div className="p-18">
			<h1 className="text-4xl font-bold text-center text-pretty">
				Bienvenido a la seccion Administrador
			</h1>
			<nav className="flex flex-col gap-8 my-20 items-center justify-center w-full sm:w-1/2 mx-auto">
				<Link to="/dashboard" className="w-full">
					<Button className="w-full min-w-40 py-5">
						Usuarios <UserRound />
					</Button>
				</Link>
				<Link to="/areas" className="w-full">
					<Button className="w-full min-w-40 py-5">
						Mediciones <RulerDimensionLine />
					</Button>
				</Link>
				<Link to="/files" className="w-full">
					<Button className="w-full min-w-40 py-5">
						Imagenes <Image />
					</Button>
				</Link>
				<Link to="/money" className="w-full">
					<Button className="w-full min-w-40 py-5">
						Monetizacion <CircleDollarSign />
					</Button>
				</Link>
			</nav>
		</div>
	)
}
