import { Link } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { TriangleAlert } from "lucide-react"

export default function NotFound() {

	return (
		<section className="w-full sm:max-w-5xl 2xl:max-w-7xl sm:mx-auto min-h-svh flex flex-col items-center justify-center gap-20">
			<div className="flex justify-center items-center flex-col mt-0 sm:mt-10 relative overflow-visible px-6 sm:w-2/3 mx-auto">
				<p className="text-xl font-semibold text-center tracking-wider text-pretty w/11/12 sm:w-2/3">
					Proximamente en nuevas actualizaciones. Estamos trabajando para ello.
					Disculpe las molestias.
				</p>
				<TriangleAlert className="text-amber-700 size-20" />
				<Link to="/" className="w-5/6 sm:w-1/2">
					<Button className="mt-[10svh] w-full py-5">Volver</Button>
				</Link>
			</div>
		</section>
	)
}
