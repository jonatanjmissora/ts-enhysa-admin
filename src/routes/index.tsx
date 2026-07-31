import { Button } from "#/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"
import { UserRound, Image, CircleDollarSign, File } from "lucide-react"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	return (
		<div className="p-18">
			<div className="flex gap-4 items-center">
				<div className="flex gap-4 size-12 relative">
					<img
						src="EnHySa_logo.webp"
						alt="logo"
						className="absolute inset-0 w-full h-full object-cover"
					/>
				</div>
				<span className="text-4xl font-bold text-center text-pretty">
					EnHySa Administrador
				</span>
			</div>
			<nav className="flex flex-col gap-8 my-20 items-center justify-center w-full sm:w-1/2 mx-auto">
				<Link to="/dashboard" className="w-full">
					<Button className="w-full min-w-40 py-5">
						Usuarios <UserRound />
					</Button>
				</Link>
				<Link to="/reportes" className="w-full">
					<Button className="w-full min-w-40 py-5">
						Reportes <File />
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
