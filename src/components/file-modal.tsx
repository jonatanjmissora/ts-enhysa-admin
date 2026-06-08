import { X } from "lucide-react"
import type { FileType } from "../../server/files-server"
import { Button } from "./ui/button"

export default function FileModal({
	selectedFileKey,
	setSelectedFileKey,
	files,
}: {
	selectedFileKey: string
	setSelectedFileKey: (fileKey: string) => void
	files: FileType[]
}) {
	const meta = files?.find(f => f.key === selectedFileKey)
	if (!meta) return <p>No hay datos disponibles.</p>
	return (
		<div className="fixed z-10 top-0 bottom-0 w-full bg-white/90 backdrop-blur-sm inset-0 dark:bg-gray-800/90 p-4 overflow-y-scroll overflow-x-hidden">
			<Button variant={"outline"} onClick={() => setSelectedFileKey("")}>
				<X className="size-7" aria-hidden="true" />
			</Button>

			<div className="flex flex-col gap-2 items-center justify-center py-5 h-max sm:h-max lg:h-5/6">
				<span className="font-semibold text-gray-800 dark:text-gray-100">
					{meta.name}
				</span>
				<div className="flex justify-between items-center gap-12 font-mono text-sm">
					<span className="">{new Date(meta.uploadAt).toLocaleString()}</span>
					<span className="">{(meta.size / 1024 / 1024).toFixed(2)} MB</span>
				</div>
				<div className="flex gap-4 items-center justify-center">
					<span>{meta.key}</span>
					<Anchor fileKey={meta.key} />
				</div>
				<img
					src={`https://utfs.io/f/${meta.key}`}
					alt={meta.name}
					className="mt-2 w-full h-auto lg:w-auto lg:h-full rounded shadow-md border border-gray-200 dark:border-gray-700"
				/>
			</div>
		</div>
	)
}

export function Anchor({ fileKey }: { fileKey: string }) {
	return (
		<a
			href={`https://utfs.io/f/${fileKey}`}
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
	)
}
