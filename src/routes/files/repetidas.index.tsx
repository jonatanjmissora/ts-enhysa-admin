import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useMemo } from "react"
import {
	filesQueryOptions,
	useDeleteFile,
} from "../../../queries/files-queries"

export const Route = createFileRoute("/files/repetidas/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando archivos...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { data: files } = useSuspenseQuery(filesQueryOptions)

	// Find repeated files by grouping by name and size
	const repeatedGroups = useMemo(() => {
		if (!files?.files) return []
		const groups = new Map<string, typeof files.files>()
		for (const file of files.files) {
			const groupKey = `${file.name.toLowerCase()}_${file.size}`
			const existing = groups.get(groupKey) || []
			groups.set(groupKey, [...existing, file])
		}
		return Array.from(groups.values()).filter(group => group.length > 1)
	}, [files?.files])

	// Calculate the count and space of redundant files (extra copies)
	const { redundantCount, redundantSize } = useMemo(() => {
		let count = 0
		let size = 0
		for (const group of repeatedGroups) {
			const duplicatesCount = group.length - 1
			count += duplicatesCount
			size += duplicatesCount * group[0].size
		}
		return { redundantCount: count, redundantSize: size }
	}, [repeatedGroups])

	const { mutateAsync: deleteFile, isPending } = useDeleteFile()

	const handleDelete = async (key: string) => {
		try {
			if (
				confirm("¿Estás seguro de que deseas eliminar este archivo duplicado?")
			) {
				await deleteFile(key)
			}
		} catch (error) {
			console.error("Error deleting file:", error)
		}
	}

	if (repeatedGroups.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center p-10 text-gray-500">
				<p className="text-lg font-medium">
					No se encontraron archivos repetidos.
				</p>
				<p className="text-sm text-gray-400 mt-1">
					Todos los archivos tienen nombres o tamaños únicos.
				</p>
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-6 p-4 w-full">
			<div className="border-b border-gray-200 pb-4 dark:border-gray-700">
				<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
					Archivos Duplicados ({repeatedGroups.length} grupos, {redundantCount}{" "}
					repetidas)
				</h2>
				<div className="font-mono text-gray-500 dark:text-gray-400 flex justify-between items-center">
					<span>
						Espacio desperdiciado:{" "}
						<strong>{(redundantSize / 1024 / 1024).toFixed(2)} MB</strong>
					</span>
					<span>{(redundantSize / 1024 / 1024 / 1024).toFixed(2)} / 2GB</span>
				</div>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Se compararon los archivos por nombre y tamaño exacto. Puedes eliminar
					las copias innecesarias.
				</p>
			</div>

			<div className="flex flex-col gap-6">
				{repeatedGroups.map((group, index) => {
					const firstFile = group[0]
					const sizeInMB = (firstFile.size / 1024 / 1024).toFixed(2)

					return (
						<div
							key={index}
							className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
						>
							<div className="bg-gray-50 dark:bg-gray-700/50 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-wrap gap-2">
								<div className="flex flex-col">
									<span className="font-semibold text-gray-700 dark:text-gray-300 break-all">
										{firstFile.name}
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-400">
										Tamaño: {sizeInMB} MB
									</span>
								</div>
								<span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
									{group.length} duplicados
								</span>
							</div>

							<div className="divide-y divide-gray-100 dark:divide-gray-700">
								{group.map(file => (
									<div
										key={file.id}
										className="p-4 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors gap-4"
									>
										<div className="flex items-center gap-4 min-w-0">
											<img
												src={`https://utfs.io/f/${file.key}`}
												alt={file.name}
												className="w-12 h-12 object-cover rounded-md bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
												onError={e => {
													;(e.target as HTMLImageElement).src =
														"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3C/svg%3E"
												}}
											/>
											<div className="flex flex-col min-w-0">
												<span className="text-xs font-mono text-gray-500 dark:text-gray-400 truncate">
													Key: {file.key}
												</span>
												<div className="flex gap-2 justify-between items-center">
													<span className="text-xs text-gray-400">
														Subido el:{" "}
														{new Date(file.uploadAt).toLocaleString()}
													</span>
													<span className="text-xs text-gray-400">
														{(file.size / 1024 / 1024).toFixed(2)} MB
													</span>
												</div>
											</div>
										</div>

										<div className="flex gap-2 shrink-0">
											<a
												href={`https://utfs.io/f/${file.key}`}
												target="_blank"
												rel="noopener noreferrer"
												className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
												title="Ver archivo"
											>
												<span className="sr-only">Ver archivo</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													aria-hidden="true"
												>
													<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
													<polyline points="15 3 21 3 21 9"></polyline>
													<line x1="10" y1="14" x2="21" y2="3"></line>
												</svg>
											</a>
											<button
												onClick={() => handleDelete(file.key)}
												disabled={isPending}
												className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
												title="Eliminar duplicado"
												aria-label="Eliminar duplicado"
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="18"
													height="18"
													viewBox="0 0 24 24"
													fill="none"
													stroke="currentColor"
													stroke-width="2"
													stroke-linecap="round"
													stroke-linejoin="round"
													aria-hidden="true"
												>
													<polyline points="3 6 5 6 21 6"></polyline>
													<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
													<line x1="10" y1="11" x2="10" y2="17"></line>
													<line x1="14" y1="11" x2="14" y2="17"></line>
												</svg>
											</button>
										</div>
									</div>
								))}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
