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
import type {
	AreaIluminacionType,
	EmpresaType,
	InstrumentoType,
} from "#/db/schema"

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

	// 1. Técnico images
	const tecnicoImages = [
		tecnico.firmaImg,
		tecnico.matriculaImg,
		tecnico.empresaLogo,
	].filter(Boolean) as string[]

	// 2. Empresas images
	const empresaImages = (empresas ?? [])
		.map(empresa => empresa.logo)
		.filter(Boolean) as string[]

	// 3. Instrumentos images
	const instrumentosImagesCount = (instrumentos ?? []).reduce((acc, inst) => {
		const imgs = [
			...(inst.imagenes ?? []),
			...(inst.imagenesCalibracion ?? []),
		].filter(Boolean)
		return acc + imgs.length
	}, 0)

	// 4. Áreas images
	const areaImages = (areas ?? [])
		.filter(area => area.userId === tecnico.userId)
		.flatMap(area => area.imagenes ?? [])
		.filter(Boolean) as string[]

	const totalImagesCount =
		tecnicoImages.length +
		empresaImages.length +
		instrumentosImagesCount +
		areaImages.length

	const renderThumbnail = (img: string, label?: string) => {
		if (!img) return null
		const key = img.split("/").pop() ?? ""
		return (
			<div key={img} className="flex flex-col items-center gap-1.5 group">
				<button
					className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 shadow-sm hover:shadow-md transition-all duration-300 relative flex items-center justify-center"
					onClick={() => setSelectedFileKey(key)}
				>
					<img
						src={img}
						alt={label || "Imagen"}
						className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
						onError={e => {
							;(e.target as HTMLImageElement).src =
								"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3C/svg%3E"
						}}
					/>
				</button>
				{label && (
					<span
						className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 font-medium text-center truncate w-24 sm:w-28"
						title={label}
					>
						{label}
					</span>
				)}
			</div>
		)
	}

	return (
		<div className="bg-white dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6">
			{/* Technician Header */}
			<div className="flex justify-between items-start flex-wrap gap-4 border-b border-gray-100 dark:border-gray-700/50 pb-4">
				<div className="flex flex-col gap-1">
					<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
						{tecnico.nombre.toUpperCase()}
					</h2>
					<span className="text-xs font-mono text-gray-400">
						ID de Usuario: {tecnico.userId}
					</span>
				</div>
				<span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/30 flex items-center gap-1.5">
					<span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
					{totalImagesCount} imágenes
				</span>
			</div>

			{/* Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{/* 1. Tecnico Card */}
				<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl p-4 flex flex-col gap-4">
					<h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2">
						Técnico
					</h3>
					<div className="flex flex-wrap gap-3">
						{renderThumbnail(tecnico.firmaImg, "Firma")}
						{renderThumbnail(tecnico.matriculaImg, "Matrícula")}
						{renderThumbnail(tecnico.empresaLogo, "Logo Empresa")}
					</div>
				</div>

				{/* 2. Empresas Card */}
				<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl p-4 flex flex-col gap-4">
					<h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2">
						Empresas
					</h3>
					{empresas && empresas.length > 0 ? (
						<div className="flex flex-wrap gap-3">
							{empresas.map(empresa =>
								renderThumbnail(
									empresa.logo,
									empresa.razonSocial ||
										(empresa as EmpresaType).razonSocial ||
										"Logo"
								)
							)}
						</div>
					) : (
						<span className="text-xs text-gray-400 italic">
							No hay empresas asociadas
						</span>
					)}
				</div>

				{/* 3. Instrumentos Cards */}
				{instrumentos && instrumentos.length > 0 ? (
					instrumentos.map(instrumento => {
						const images = [
							...(instrumento.imagenesCalibracion ?? []),
							...(instrumento.imagenes ?? []),
						].filter(Boolean)

						return (
							<div
								key={instrumento.id}
								className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl p-4 flex flex-col gap-4"
							>
								<h3
									className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2 truncate"
									title={
										instrumento.nombre ||
										(instrumento as InstrumentoType).nombre
									}
								>
									Instrumento:{" "}
									{instrumento.nombre ||
										(instrumento as InstrumentoType).nombre ||
										"Sin nombre"}
								</h3>
								{images.length > 0 ? (
									<div className="flex flex-wrap gap-3">
										{images.map((img, idx) =>
											renderThumbnail(img, `Imagen ${idx + 1}`)
										)}
									</div>
								) : (
									<span className="text-xs text-gray-400 italic">
										Sin imágenes
									</span>
								)}
							</div>
						)
					})
				) : (
					<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl p-4 flex flex-col gap-4">
						<h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2">
							Instrumentos
						</h3>
						<span className="text-xs text-gray-400 italic">
							No hay instrumentos asociados
						</span>
					</div>
				)}

				{/* 4. Áreas de Reportes Card */}
				<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl p-4 flex flex-col gap-4">
					<h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2">
						Áreas de Reportes
					</h3>
					{(() => {
						const filteredAreas = (areas ?? []).filter(
							area => area.userId === tecnico.userId
						)
						const hasImages = filteredAreas.some(
							area => area.imagenes && area.imagenes.length > 0
						)

						if (hasImages) {
							return (
								<div className="flex flex-col gap-3">
									{filteredAreas.map(area => {
										if (!area.imagenes || area.imagenes.length === 0)
											return null
										return (
											<div key={area.id} className="flex flex-col gap-1.5">
												<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
													{area.nombre ||
														(area as AreaIluminacionType).nombre ||
														"Área"}
												</span>
												<div className="flex flex-wrap gap-2.5">
													{area.imagenes.map((img, idx) =>
														renderThumbnail(img, `Área Img ${idx + 1}`)
													)}
												</div>
											</div>
										)
									})}
								</div>
							)
						}
						return (
							<span className="text-xs text-gray-400 italic">
								No hay imágenes en las áreas
							</span>
						)
					})()}
				</div>
			</div>

			{/* Modal for file metadata */}
			{selectedFileKey && (
				<div className="fixed z-10 top-0 bottom-0 w-full bg-white/90 backdrop-blur-sm inset-0 dark:bg-gray-800/90 p-4 overflow-y-scroll overflow-x-hidden">
					<Button variant={"outline"} onClick={() => setSelectedFileKey("")}>
						<X className="size-7" aria-hidden="true" />
					</Button>
					{(() => {
						const meta = files?.files?.find(f => f.key === selectedFileKey)
						if (!meta) return <p>No hay datos disponibles.</p>
						return (
							<div className="flex flex-col gap-2 items-center justify-center py-5 h-max sm:h-max lg:h-5/6">
								<span className="font-semibold text-gray-800 dark:text-gray-100">
									{meta.name}
								</span>
								<span className="text-xs text-gray-500">
									{(meta.size / 1024 / 1024).toFixed(2)} MB
								</span>
								<span className="text-xs text-gray-400">
									{new Date(meta.uploadAt).toLocaleString()}
								</span>
								<img
									src={`https://utfs.io/f/${meta.key}`}
									alt={meta.name}
									className="mt-2 w-full h-auto lg:w-auto lg:h-full rounded shadow-md border border-gray-200 dark:border-gray-700"
								/>
							</div>
						)
					})()}
				</div>
			)}
		</div>
	)
}
