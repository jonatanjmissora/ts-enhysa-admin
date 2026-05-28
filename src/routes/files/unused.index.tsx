import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Suspense, useMemo } from "react"
import { filesQueryOptions } from "../../../queries/files-queries"
import { tecnicosQueryOptions } from "../../../queries/tecnicos-queries"
import { allEmpresasQueryOptions } from "../../../queries/empresas-queries"
import { allAreasQueryOptions } from "../../../queries/iluminacion/areas-queries"
import { allInstrumentosQueryOptions } from "../../../queries/instrumentos-queries"
import { Button } from "#/components/ui/button"

export const Route = createFileRoute("/files/unused/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<Suspense fallback={<div>Cargando todos los archivos...</div>}>
			<Inner />
		</Suspense>
	)
}

function Inner() {
	const { data: dataFiles } = useSuspenseQuery(filesQueryOptions)
	const { data: tecnicos } = useSuspenseQuery(tecnicosQueryOptions)
	const { data: empresas } = useSuspenseQuery(allEmpresasQueryOptions)
	const { data: instrumentos } = useSuspenseQuery(allInstrumentosQueryOptions)
	const { data: areas } = useSuspenseQuery(allAreasQueryOptions)

	const tecnicosImages = useMemo(() => {
		if (!tecnicos) return []
		const arr: string[] = []
		tecnicos.forEach(t => {
			arr.push(t.matriculaImg, t.firmaImg, t.empresaLogo)
		})
		return arr
	}, [tecnicos])
	const empresasImages = useMemo(() => {
		if (!empresas) return []
		const arr: string[] = []
		empresas.forEach(e => {
			arr.push(e.logo)
		})
		return arr
	}, [empresas])
	const instrumentosImages = useMemo(() => {
		if (!instrumentos) return []
		const arr: string[] = []
		instrumentos.forEach(i => {
			arr.push(...i.imagenesCalibracion, ...i.imagenes)
		})
		return arr
	}, [instrumentos])
	const areasImages = useMemo(() => {
		if (!areas) return []
		const arr: string[] = []
		areas.forEach(a => {
			arr.push(...a.imagenes)
		})
		return arr
	}, [areas])

	const imagesUsed = useMemo(() => {
		const set = new Set<string>()
		const addKey = (url?: string) => {
			if (!url) return
			// Extract the key part after the last slash (e.g., https://utfs.io/f/abc123 -> abc123)
			const parts = url.split("/")
			const key = parts[parts.length - 1]
			if (key) set.add(key)
		}
		tecnicosImages.forEach(k => {
			addKey(k)
		})
		empresasImages.forEach(k => {
			addKey(k)
		})
		instrumentosImages.forEach(k => {
			addKey(k)
		})
		areasImages.forEach(k => {
			addKey(k)
		})
		return set
	}, [tecnicosImages, empresasImages, instrumentosImages, areasImages])

	const imagesUnused = useMemo(() => {
		return dataFiles.files.filter(
			file =>
				!imagesUsed.has(file.key) &&
				/\.(png|jpe?g|gif|webp|svg)$/i.test(file.name ?? file.key)
		)
	}, [dataFiles.files, imagesUsed])

	const eliminarUnused = () => {}

	return (
		<article>
			<div className="flex flex-wrap gap-4 items-center justify-between w-full">
				<div className="flex gap-2 items-center justify-center my-10">
					<span>Imagenes no utilizadas : </span>
					<span>
						{imagesUnused.length} / {dataFiles.files.length}
					</span>
				</div>
				<Button
					variant="destructive"
					className="px-6 cursor-pointer"
					onClick={eliminarUnused}
				>
					Eliminar
				</Button>
			</div>
			{/* quiero listar los archivos no utilizados abajo */}
			<div className="flex gap-4 mb-20 w-full flex-wrap min-h-svg justify-center items-center">
				{imagesUnused.map(file => (
					<div
						key={file.id}
						className="w-full sm:w-auto h-50 rounded-lg flex flex-col items-center justify-center relative"
					>
						<img
							src={`https://utfs.io/f/${file.key}`}
							alt="file"
							className="w-auto h-50 object-contain border border-white/20 rounded-lg cursor-pointer"
						/>
					</div>
				))}
			</div>
		</article>
	)
}
