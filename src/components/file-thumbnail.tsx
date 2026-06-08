import { Loader2, Trash2 } from "lucide-react"
import type { FileType } from "../../server/files-server"
import { Anchor } from "./file-modal"
import { Button } from "./ui/button"
import { useDeleteFile } from "../../queries/files-queries"

export default function FileThumbnail({
	file,
	className,
}: {
	file: FileType
	className?: string
}) {
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

	if (!file.key) return null
	return (
		<div className="flex flex-col items-center gap-1.5 group">
			<button className={`relative size-14 sm:size-20 ${className}`}>
				<img
					src={`https://utfs.io/f/${file.key}`}
					alt={file.name}
					className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
					onError={e => {
						;(e.target as HTMLImageElement).src =
							"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3C/svg%3E"
					}}
				/>

				<div className="absolute z-10 -inset-1 bg-gray-900 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2 items-center justify-between border border-gray-600 rounded">
					<div></div>
					<div className="flex flex-col gap-2 items-center justify-center font-mono">
						<span>
							{file.name.length > 20 ? `...${file.name.slice(-20)}` : file.name}
						</span>
						<span>
							{file.key.length > 20 ? `...${file.key.slice(-20)}` : file.key}
						</span>
						<span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
					</div>
					<div className="flex justify-between items-center w-full">
						<Button
							variant="ghost"
							disabled={isPending}
							onClick={() => handleDelete(file.key)}
						>
							{isPending ? (
								<Loader2 className="size-4 animate-spin" />
							) : (
								<Trash2 className="size-4" />
							)}
						</Button>
						<Anchor fileKey={file.key} />
					</div>
				</div>
			</button>
		</div>
	)
}
