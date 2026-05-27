import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense, useMemo, useState } from 'react'
import { filesQueryOptions } from '../../../queries/files-queries'
import { tecnicosQueryOptions } from '../../../queries/tecnicos-queries'
import { allEmpresasQueryOptions } from '../../../queries/empresas-queries'
import { allAreasQueryOptions } from '../../../queries/iluminacion/areas-queries'
import { allInstrumentosQueryOptions } from '../../../queries/instrumentos-queries'

type FilesType = {
  id: string;
  key: string;
  name: string;
  size: number;
  uploadAt: number;
}

export const Route = createFileRoute('/files/unused/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Suspense fallback={<div>Cargando todos los archivos...</div>}>
			<Inner />
		</Suspense>
}

function Inner() {
	const {data: dataFiles} = useSuspenseQuery(filesQueryOptions)
  const {data: tecnicos} = useSuspenseQuery(tecnicosQueryOptions)
  const {data: empresas} = useSuspenseQuery(allEmpresasQueryOptions)
  const {data: instrumentos} = useSuspenseQuery(allInstrumentosQueryOptions)
  const {data: areas} = useSuspenseQuery(allAreasQueryOptions)
	
  const [unusedFiles, setUnusedFiles] = useState<FilesType[]>(dataFiles.files)
  
  let tecnicosImages: string[] = []
  if(tecnicos)
    tecnicos.forEach(tecnico => tecnicosImages.push(tecnico.matriculaImg, tecnico.firmaImg, tecnico.empresaLogo))

  let empresasImages: string[] = []
  if(empresas)
    empresas.forEach(empresa => empresasImages.push(empresa.logo))

  let instrumentosImages: string[] = []
  if (instrumentos) {
    instrumentos.forEach(instrumento => {
      instrumentosImages.push(...instrumento.imagenesCalibracion);
      instrumentosImages.push(...instrumento.imagenes);
    });
  }

let areasImages: string[] = []
  if (areas) {
    areas.forEach(area => {
      areasImages.push(...area.imagenes);
    });
  }

  const imagesUsed = useMemo(() => {
    const set = new Set<string>();

    // Agregar imágenes de técnicos
    tecnicosImages.forEach(key => {
      if (key) set.add(key);
    });

    // Agregar imágenes de empresas
    empresasImages.forEach(key => {
      if (key) set.add(key);
    });

    // Agregar imágenes de instrumentos (calibración + generales)
    instrumentosImages.forEach(key => {
      if (key) set.add(key);
    });

    // Agregar imágenes de áreas
    areasImages.forEach(key => {
      if (key) set.add(key);
    });

    return set;
  }, [tecnicosImages, empresasImages, instrumentosImages, areasImages]);

return (
  <article>
    {JSON.stringify(imagesUsed)} ********* {imagesUsed.size} {dataFiles.files.length}
  </article>
)
}