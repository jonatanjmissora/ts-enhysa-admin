import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { filesQueryOptions } from "../../../queries/files-queries"
import { Button } from "#/components/ui/button"
import { X } from "lucide-react"

export const Route = createFileRoute("/files/")({
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
	const [selectedFileKey, setSelectedFileKey] = useState("")
	if (!files?.files) return <div>No hay archivos</div>

	const totalBytes = files.files.reduce((acc, file) => acc + file.size, 0)

	return (
		<article className="flex flex-col gap-4">
			<div className="flex flex-col sm:flex-row gap-2 items-center justify-center w-full">
				<span className="">Almacenamiento Total: </span>
				<span>
					{(totalBytes / 1024 / 1024 / 1024).toFixed(3)} GB / 2 GB (
					{((totalBytes / 1024 / 1024 / 1024 / 2) * 100).toFixed(1)}%)
				</span>
			</div>
			<div className="flex gap-4 mt-10 mb-20 w-full flex-wrap min-h-svg justify-center items-center">
				{files.files.map(file => (
					<button
						key={file.id}
						className="w-full sm:w-auto h-auto sm:h-50 rounded-lg flex flex-col items-center justify-center relative"
						onClick={() => {
							const key = file.key
							setSelectedFileKey(key)
						}}
					>
						<img
							src={`https://utfs.io/f/${file.key}`}
							alt="file"
							className="sm:w-auto sm:h-50 w-full h-auto object-contain border border-white/20 rounded-lg cursor-pointer"
						/>
					</button>
				))}
			</div>
			{selectedFileKey && (
				<div className="fixed z-10 top-0 bottom-0 w-full bg-white/90 backdrop-blur-sm inset-0 dark:bg-gray-800/90 p-4 overflow-y-scroll overflow-x-hidden">
					<Button variant={"outline"} onClick={() => setSelectedFileKey("")}>
						<X className="size-7" />
					</Button>
					{(() => {
						const meta = files?.files?.find(f => f.key === selectedFileKey)
						if (!meta) return <p>No hay datos disponibles.</p>
						return (
							<div className="flex flex-col gap-2 items-center justify-center py-5 h-max sm:h-max lg:h-5/6">
								<span>{meta.name}</span>
								<span>{(meta.size / 1024 / 1024).toFixed(2)} MB</span>
								<span>{new Date(meta.uploadAt).toLocaleString()}</span>
								<img
									src={`https://utfs.io/f/${meta.key}`}
									alt={meta.name}
									className="mt-2 w-full h-auto lg:w-auto lg:h-full rounded"
								/>
							</div>
						)
					})()}
				</div>
			)}
		</article>
	)
}
