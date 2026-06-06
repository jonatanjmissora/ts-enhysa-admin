import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
	filesQueryOptions,
	useDeleteFile,
} from "../../../queries/files-queries"
import { Button } from "#/components/ui/button"
import {
	Download,
	Link as LinkLucide,
	Trash2,
	X,
	Image,
	Loader,
} from "lucide-react"

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
	const { mutateAsync: deleteFile, isPending: isLoading } = useDeleteFile()
	if (!files?.files) return <div>No hay archivos</div>

	const totalBytes = files.files.reduce((acc, file) => acc + file.size, 0)

	const downloadFile = async (key: string, name: string, format?: string) => {
		try {
			const response = await fetch(`https://utfs.io/f/${key}`)
			if (!response.ok) throw new Error("Error al descargar el archivo")
			const blob = await response.blob()

			if (format) {
				const img = document.createElement("img")
				img.src = URL.createObjectURL(blob)
				await img.decode()
				const canvas = document.createElement("canvas")
				canvas.width = img.width
				canvas.height = img.height
				const ctx = canvas.getContext("2d")
				if (!ctx) throw new Error("Error al procesar la imagen")
				ctx.drawImage(img, 0, 0)
				const dataUrl = canvas.toDataURL(`image/${format}`)
				const a = document.createElement("a")
				a.href = dataUrl
				const base = name.replace(/\.[^/.]+$/, "")
				a.download = `${base}.${format}`
				a.click()
				URL.revokeObjectURL(img.src)
			} else {
				const url = URL.createObjectURL(blob)
				const a = document.createElement("a")
				a.href = url
				a.download = name
				a.click()
				URL.revokeObjectURL(url)
			}
		} catch (error) {
			console.error(error)
		}
	}

	const deleteFiles = async (key: string) => {
		try {
			if (!key) return
			await deleteFile(key)
			console.log("Archivo eliminado correctamente", key)
			setSelectedFileKey("")
		} catch (error) {
			console.error(error)
		}
	}

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
							className={`sm:w-auto sm:h-50 w-full h-auto object-contain  rounded-lg cursor-pointer border-3 ${borderColor(file.size / 1024 / 1024)}`}
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
								<div className="flex justify-between items-center w-1/3 gap-2">
									<span>{(meta.size / 1024 / 1024).toFixed(2)} MB</span>
									<Button
										variant="outline"
										onClick={() => downloadFile(meta.key, meta.name)}
									>
										<Download />
									</Button>
									<Button
										variant="outline"
										onClick={() => downloadFile(meta.key, meta.name, "png")}
									>
										<Image />
									</Button>
									<Link to={`https://utfs.io/f/${meta.key}`} target="_blank">
										<Button variant="outline">
											<LinkLucide />
										</Button>
									</Link>
									<Button
										variant="outline"
										disabled={isLoading}
										onClick={() => deleteFiles(meta.key)}
									>
										{isLoading ? (
											<Loader className="size-7 animate-spin" />
										) : (
											<Trash2 />
										)}
									</Button>
								</div>
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

function borderColor(size: number) {
	let color = "border-red-500/80"
	if (size < 3) color = "border-orange-500/80"
	if (size < 1) color = "border-yellow-500/80"
	if (size < 0.5) color = "border-green-500/80"
	return color
}
