import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useState } from "react"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import type { TecnicoType } from "../../../db/tecnicos/schema"
import { empresasQueryOptions } from "../../../queries/empresas-queries"
import { instrumentosQueryOptions } from "../../../queries/instrumentos-queries"
import { allAreasQueryOptions } from "../../../queries/iluminacion/areas-queries"
import { reportesQueryOptions } from "../../../queries/iluminacion/reportes-queries"
import { filesQueryOptions } from "../../../queries/files-queries"
import FileThumbnail from "#/components/file-thumbnail"
import type { InstrumentoType } from "../../../db/instrumentos/schema"
import type { AreaIluminacionType } from "../../../db/reportes/iluminacion/areas/scheme"
import Loading from "#/components/loading"

export const Route = createFileRoute("/files/tecnicos/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full h-full sm:p-10 2xl:p-20">
			<Suspense fallback={<Loading />}>
				<Inner />
			</Suspense>
		</div>
	)
}

function Inner() {
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	const [actualTecnico, setActualTecnico] = useState<string | null>("")

	if (!tecnicos)
		return (
			<div className="flex flex-col gap-4 justify-center items-center">
				<span>No hay técnicos</span>
			</div>
		)

	return (
		<article className="flex flex-col gap-4 w-full mb-40">
			{tecnicos.map(tecnico => (
				<Tecnico
					key={tecnico.id}
					tecnico={tecnico}
					actualTecnico={actualTecnico}
					setActualTecnico={setActualTecnico}
				/>
			))}
		</article>
	)
}

function Tecnico({
	tecnico,
	actualTecnico,
	setActualTecnico,
}: {
	tecnico: TecnicoType
	actualTecnico: string | null
	setActualTecnico: (value: string | null) => void
}) {
	const { data: empresas } = useSuspenseQuery(
		empresasQueryOptions(tecnico.userId)
	)
	const { data: instrumentos } = useSuspenseQuery(
		instrumentosQueryOptions(tecnico.userId)
	)
	const { data: reportes } = useSuspenseQuery(
		reportesQueryOptions(tecnico.userId)
	)
	const { data: areas } = useSuspenseQuery(allAreasQueryOptions)
	const { data: files } = useSuspenseQuery(filesQueryOptions)
	const [actualReporte, setActualReporte] = useState<string | null>(null)

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
	// 3. Instrumentos images
	const instrumentosImages = (instrumentos ?? [])
		.flatMap(inst => [
			...(inst.imagenes ?? []),
			...(inst.imagenesCalibracion ?? []),
		])
		.filter(Boolean) as string[]

	// 4. Áreas images
	const areaImages = (areas ?? [])
		.filter(area => area.userId === tecnico.userId)
		.flatMap(area => area.imagenes ?? [])
		.filter(Boolean) as string[]

	const totalImagesCount =
		tecnicoImages.length +
		empresaImages.length +
		instrumentosImages.length +
		areaImages.length

	const allTecnicoImages = [
		...tecnicoImages,
		...empresaImages,
		...instrumentosImages,
		...areaImages,
	]

	const uniqueKeys = Array.from(
		new Set(
			allTecnicoImages.map(img => img.split("/").pop() ?? "").filter(Boolean)
		)
	)

	const totalFilesSize =
		uniqueKeys.reduce((acc, key) => {
			const file = files?.files?.find(f => f.key === key)
			return acc + (file?.size ?? 0)
		}, 0) /
		(1024 * 1024)

	const handleActualTecnico = () => {
		if (actualTecnico === tecnico.userId) {
			setActualTecnico(null)
		} else {
			setActualTecnico(tecnico.userId)
		}
	}

	const handleActualReporte = (reportId: string) => {
		if (actualReporte === reportId) {
			setActualReporte(null)
		} else {
			setActualReporte(reportId)
		}
	}

	return (
		<div className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/60 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col gap-6 w-full">
			{/* Technician Header */}
			<button
				onClick={handleActualTecnico}
				className="flex justify-between items-start flex-wrap gap-4 border-b border-gray-100 dark:border-gray-700/50 pb-4"
			>
				<div className="flex flex-col items-start gap-1">
					<h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
						{tecnico.nombre.toUpperCase()}
					</h2>
					<span className="text-xs font-mono text-gray-400">
						ID de Usuario: {tecnico.userId}
					</span>
				</div>
				<div className="flex items-center gap-6">
					<span className="text-xs font-mono text-gray-400">
						{totalFilesSize.toFixed(2)} MB (
						{(((totalFilesSize / 1024) * 100) / 2).toFixed(2)}%)
					</span>
					<span className="bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-semibold px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/30 flex items-center gap-1.5">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
						{totalImagesCount} imágenes
					</span>
				</div>
			</button>

			{/* Cards Grid */}
			{actualTecnico === tecnico.userId && (
				<div className="flex flex-col gap-6">
					{/* 1. Tecnico Card */}
					<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl flex flex-col overflow-hidden ">
						<div className="flex justify-between items-center font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2 bg-gray-700 p-4">
							<h3 className="">Técnico</h3>
							<span className="text-xs font-mono text-gray-400">
								ID: {tecnico.id}
							</span>
						</div>
						<div className="flex flex-wrap gap-3 p-4">
							{tecnicoImages.map(img => {
								const actualFile = files?.files?.find(
									f => f.key === img.split("/").pop()
								)
								if (!actualFile) return null
								return (
									<FileThumbnail
										key={img}
										file={actualFile}
										className="size-60 sm:size-60"
									/>
								)
							})}
						</div>
					</div>

					{/* 2. Empresas Card */}
					<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl flex flex-col overflow-hidden">
						<h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2 bg-gray-700 p-4">
							Empresas
						</h3>
						{empresas && empresas.length > 0 ? (
							<div className="flex flex-wrap gap-3 p-4">
								{empresas.map(img => {
									const actualFile = files?.files?.find(
										f => f.key === img.logo?.split("/").pop()
									)
									if (!actualFile) return null
									return (
										<FileThumbnail
											key={img.id}
											file={actualFile}
											className="size-60 sm:size-60"
										/>
									)
								})}
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
									className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl flex flex-col overflow-hidden"
								>
									<div className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2 truncate bg-gray-700 p-4 flex justify-between items-center">
										<h3
											title={
												instrumento.nombre ||
												(instrumento as InstrumentoType).nombre
											}
										>
											{instrumento.nombre.toUpperCase() ||
												(instrumento as InstrumentoType).nombre.toUpperCase() ||
												"Sin nombre"}
										</h3>
										<span className="text-xs font-mono text-gray-400">
											{instrumento.marca.toUpperCase()} -{" "}
											{instrumento.modelo.toUpperCase()}
										</span>
										<span className="text-xs font-mono text-gray-400">
											ID: {instrumento.id}
										</span>
									</div>
									{images.length > 0 ? (
										<div className="flex flex-wrap gap-3 p-4">
											{images.map(img => {
												const actualFile = files?.files?.find(
													f => f.key === img?.split("/").pop()
												)
												if (!actualFile) return null
												return (
													<FileThumbnail
														key={img}
														file={actualFile}
														className="size-60 sm:size-60"
													/>
												)
											})}
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
						<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl flex flex-col overflow-hidden">
							<h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 pb-2 bg-gray-700 p-4">
								Instrumentos
							</h3>
							<span className="text-xs text-gray-400 italic">
								No hay instrumentos asociados
							</span>
						</div>
					)}

					{/* Reportes e Informes */}
					{reportes && reportes.length > 0 ? (
						reportes.map(reporte => {
							const reportAreas = (areas ?? []).filter(
								area => area.reportId === reporte.id
							)
							return (
								<button
									onClick={() => handleActualReporte(reporte.id)}
									key={reporte.id}
									className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl flex flex-col overflow-hidden"
								>
									{/* Card Header: Report Name & reportId */}
									<div className="font-semibold text-sm  dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 bg-gray-700 p-4 flex justify-between items-center text-gray-800">
										<h3 className="text-white font-semibold">
											{reporte.title.toUpperCase()}
										</h3>
										<div className="flex gap-10 items-center">
											<span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
												{getImagesPerReport(areas, reporte.id).length > 0
													? `${getImagesPerReport(areas, reporte.id).length} imágenes`
													: `No hay imágenes`}
											</span>
											<span className="text-xs font-mono text-gray-300">
												ID: {reporte.id}
											</span>
										</div>
									</div>

									{/* Card Content: List areas */}
									{actualReporte === reporte.id && (
										<div className="p-4 flex flex-col gap-4">
											{reportAreas.length > 0 ? (
												reportAreas.map(area => (
													<div
														key={area.id}
														className="border-b border-gray-100 dark:border-gray-600 pb-3 last:border-b-0 last:pb-0"
													>
														<div className="flex justify-between bg-gray-700 p-2">
															<span className="text-xs font-mono text-gray-600 dark:text-gray-400 block">
																{area.nombre.toUpperCase()} -{" "}
																{area.tipo.toUpperCase()}
															</span>
															<span className="text-xs font-mono text-gray-600 dark:text-gray-400 block">
																ID: {area.id}
															</span>
														</div>
														{area.imagenes && area.imagenes.length > 0 ? (
															<div className="flex flex-wrap gap-2.5">
																{area.imagenes.map(img => {
																	const actualFile = files?.files?.find(
																		f => f.key === img?.split("/").pop()
																	)
																	if (!actualFile) return null
																	return (
																		<FileThumbnail
																			key={img}
																			file={actualFile}
																			className="size-60 sm:size-60"
																		/>
																	)
																})}
															</div>
														) : (
															<span className="p-2 py-4 w-max flex items-center justify-center text-xs text-gray-400 italic text-center rounded-lg">
																Sin imágenes
															</span>
														)}
													</div>
												))
											) : (
												<span className="text-xs text-gray-400 italic">
													No hay áreas asociadas a este reporte
												</span>
											)}
										</div>
									)}
								</button>
							)
						})
					) : (
						<div className="bg-gray-50/50 dark:bg-gray-900/20 border border-gray-100 dark:border-gray-700/40 rounded-xl flex flex-col overflow-hidden">
							<h3 className="font-semibold text-sm text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700/40 bg-gray-700 p-4">
								Reportes
							</h3>
							<span className="text-xs text-gray-400 italic p-4">
								No hay reportes asociados
							</span>
						</div>
					)}
				</div>
			)}

			{/* Modal for file metadata */}
			{/* {selectedFileKey && (
				<FileModal
					selectedFileKey={selectedFileKey}
					setSelectedFileKey={setSelectedFileKey}
					files={files?.files}
				/>
			)} */}
		</div>
	)
}

function getImagesPerReport(areas: AreaIluminacionType[], reportId: string) {
	return areas
		.filter(area => area.reportId === reportId)
		.flatMap(area => area.imagenes)
}
