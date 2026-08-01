// src/routes/files/unused.index.tsx
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useMemo } from "react"
import { filesQueryOptions } from "../../../queries/files-queries"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import { allEmpresasQueryOptions } from "../../../queries/empresas-queries"
import { allInstrumentosQueryOptions } from "../../../queries/instrumentos-queries"
import { allAreasQueryOptions } from "../../../queries/iluminacion/areas-queries"
import FileThumbnail from "#/components/file-thumbnail"
import Loading from "#/components/loading"

export const Route = createFileRoute("/files/unused/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div className="w-full h-full p-20">
			<Suspense fallback={<Loading />}>
				<Inner />
			</Suspense>
		</div>
	)
}

function Inner() {
	const { data: files } = useSuspenseQuery(filesQueryOptions)
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	const { data: empresas } = useSuspenseQuery(allEmpresasQueryOptions)
	const { data: instrumentos } = useSuspenseQuery(allInstrumentosQueryOptions)
	const { data: areas } = useSuspenseQuery(allAreasQueryOptions)

	// -----------------------------------------------------------------
	// 2️⃣   📂   CÁLCULO DE ARCHIVOS NO USADOS POR TÉCNICO
	// -----------------------------------------------------------------
	const unusedFiles = useMemo(() => {
		if (!files?.files) return []

		const extractKey = (url?: string) => {
			if (!url) return null
			const parts = url.split("/")
			return parts[parts.length - 1]
		}

		const usedKeys = new Set<string>()

		// Tecnico images
		tecnicos?.forEach(t => {
			;[t.matriculaImg, t.firmaImg, t.empresaLogo].forEach(url => {
				const k = extractKey(url)
				if (k) usedKeys.add(k)
			})
		})

		// Instrumentos images
		instrumentos?.forEach(inst => {
			;[...(inst.imagenes ?? []), ...(inst.imagenesCalibracion ?? [])].forEach(
				url => {
					const k = extractKey(url)
					if (k) usedKeys.add(k)
				}
			)
		})

		// Empresas logos
		empresas?.forEach(emp => {
			const k = extractKey(emp.logo)
			if (k) usedKeys.add(k)
		})

		// Areas images
		areas?.forEach(area => {
			;(area.imagenes ?? []).forEach(url => {
				const k = extractKey(url)
				if (k) usedKeys.add(k)
			})
		})

		return files.files.filter(f => !usedKeys.has(f.key))
	}, [files?.files, tecnicos, instrumentos, empresas, areas])

	const unusedTotalSize = useMemo(() => {
		return unusedFiles.reduce((acc, file) => acc + file.size, 0)
	}, [unusedFiles])

	return (
		<div className="flex flex-col gap-6 p-4 w-full bg-gray-800 rounded-lg">
			<div className="border-b border-gray-200 pb-4 dark:border-gray-600 mb-4">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
						Archivos SIN uso:
					</h2>
					<span>
						{unusedFiles.length > 1
							? `(${unusedFiles.length} / ${files?.files.length}) archivos`
							: "No hay"}
					</span>
				</div>
				<div className="font-mono text-gray-500 dark:text-gray-400 flex justify-between items-center">
					<span>
						Espacio desperdiciado:{" "}
						<strong>{(unusedTotalSize / 1024 / 1024).toFixed(2)} MB</strong>
					</span>
					<span>
						{(((unusedTotalSize / 1024 / 1024 / 1024) * 100) / 2).toFixed(2)} %
					</span>
				</div>
			</div>
			{unusedFiles.length === 0 ? (
				<p className="text-gray-500">No hay archivos sin usar.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{unusedFiles.map(file => (
						<FileThumbnail
							key={file.id}
							file={file}
							className={"size-60 sm:size-60"}
						/>
					))}
				</div>
			)}

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
