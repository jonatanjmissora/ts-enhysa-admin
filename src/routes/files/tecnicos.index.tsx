import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import type { TecnicoType } from "../../../db/tecnicos/schema"
import { empresasQueryOptions } from "../../../queries/empresas-queries"
import { instrumentosQueryOptions } from "../../../queries/instrumentos-queries"
import { allAreasQueryOptions } from "../../../queries/iluminacion/areas-queries"
import { filesQueryOptions } from "../../../queries/files-queries"
import { Button } from "#/components/ui/button"
import { X } from "lucide-react"

export const Route = createFileRoute("/files/tecnicos/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando técnicos...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)

	if (!tecnicos)
		return (
			<div className="flex flex-col gap-4 justify-center items-center">
				<span>No hay técnicos</span>
			</div>
		)

	return (
		<article className="flex flex-col gap-4">
			{tecnicos.map(tecnico => (
				<Tecnico key={tecnico.id} tecnico={tecnico} />
			))}
		</article>
	)
}

function Tecnico({ tecnico }: { tecnico: TecnicoType }) {
	const { data: empresas } = useSuspenseQuery(
		empresasQueryOptions(tecnico.userId)
	)
	const { data: instrumentos } = useSuspenseQuery(
		instrumentosQueryOptions(tecnico.userId)
	)
	const { data: areas } = useSuspenseQuery(allAreasQueryOptions)
	const { data: files } = useSuspenseQuery(filesQueryOptions)
	const [selectedFileKey, setSelectedFileKey] = useState("")

	const tecnicosImages: string[] = [
		tecnico.empresaLogo,
		tecnico.firmaImg,
		tecnico.matriculaImg,
	]
	if (empresas)
		empresas.forEach(empresa => {
			tecnicosImages.push(empresa.logo)
		})
	if (instrumentos)
		instrumentos.forEach(instrumento => {
			tecnicosImages.push(...instrumento.imagenesCalibracion)
			tecnicosImages.push(...instrumento.imagenes)
		})

	if (areas)
		areas.forEach(area => {
			if (area.userId === tecnico.userId) tecnicosImages.push(...area.imagenes)
		})

	return (
		<div className="flex flex-col gap-2 items-center justify-center p-4">
			<span>
				{tecnico.nombre.toUpperCase()} ({tecnicosImages.length})
			</span>
			<div className="flex gap-4 mb-20 w-full flex-wrap min-h-svg justify-center items-center">
				{tecnicosImages.map((img, idx) => (
					<button
						key={idx}
						className="w-full sm:w-auto h-50 rounded-lg flex flex-col items-center justify-center relative"
						onClick={() => {
							const key = img.split("/").pop() ?? ""
							setSelectedFileKey(key)
						}}
					>
						<img
							src={img}
							alt="file"
							className="w-auto h-50 object-contain border border-white/20 rounded-lg cursor-pointer"
						/>
					</button>
				))}
			</div>

			{/* Modal for file metadata */}
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
		</div>
	)
}

{
	/* Modal for file metadata */
}
{
	/* {selectedFileKey && ( */
}
// <div
// 	className="fixed inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm"
// 	onClick={() => setSelectedFileKey("")}
// >
// 	<div
// 		className="bg-white dark:bg-gray-800 p-4 rounded-lg max-w-sm w-full"
// 		onClick={e => e.stopPropagation()}
// 	>
// 		<h2 className="text-lg font-semibold mb-2">
// 			Información del archivo
// 		</h2>
// 		{(() => {
// 			const meta = files?.files?.find(f => f.key === selectedFileKey)
// 			if (!meta) return <p>No hay datos disponibles.</p>
// 			return (
// 				<>
// 					<p><strong>Nombre:</strong> {meta.name}</p>
// 					<p><strong>Tamaño:</strong> {(meta.size / 1024 / 1024).toFixed(2)} MB</p>
// 					<p><strong>Subido:</strong> {new Date(meta.uploadAt).toLocaleString()}</p>
// 					<img
// 						src={`https://utfs.io/f/${meta.key}`}
// 						alt={meta.name}
// 						className="mt-2 w-full h-auto rounded"
// 					/>
// 				</>
// 			)
// 		})()}
// 		<button
// 			className="mt-3 px-4 py-2 bg-blue-600 text-white rounded"
// 			onClick={() => setSelectedFileKey("")}
// 		>
// 			Cerrar
// 		</button>
// 	</div>
// </div>
