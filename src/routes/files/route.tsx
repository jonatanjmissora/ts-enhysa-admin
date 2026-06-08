import { createFileRoute, Link, Outlet } from "@tanstack/react-router"
import { filesQueryOptions } from "../../../queries/files-queries"
import { Suspense } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"

export const Route = createFileRoute("/files")({
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(filesQueryOptions)
		return null
	},
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="flex flex-col gap-4 justify-center items-center">
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
			<nav className="flex gap-1 flex-wrap w-full mx-auto">
				<Link
					to="/files"
					className="flex gap-1 items-center justify-center p-4 py-1 flex-1"
					activeProps={{ className: "bg-black rounded-lg" }}
					activeOptions={{ exact: true }}
				>
					<span className="">x Tecnico</span>
				</Link>

				<Link
					to="/files/unused"
					className="flex gap-1 items-center justify-center p-4 py-1 flex-1"
					activeProps={{ className: "bg-black rounded-lg" }}
					activeOptions={{ exact: true }}
				>
					<span className="">Sin utilizar</span>
				</Link>
				<Link
					to="/files/repetidas"
					className="flex gap-1 items-center justify-center p-4 py-1 flex-1"
					activeProps={{ className: "bg-black rounded-lg" }}
					activeOptions={{ exact: true }}
				>
					Repetidas
				</Link>
			</nav>
			<Outlet />
		</div>
	)
}

function FilesLengthSuspense() {
	const { data: files } = useSuspenseQuery(filesQueryOptions)
	if (!files?.files) return <div>(0)</div>

	return (
		<div className="flex items-center justify-center gap-4 size-10 rounded-lg">
			({files.files.length})
		</div>
	)
}
