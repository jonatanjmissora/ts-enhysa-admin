import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Suspense } from 'react'
import { tecnicosQueryOptions } from '../../../queries/tecnicos-queries'
import type { TecnicoType } from '../../../db/tecnicos/schema'
import { empresasQueryOptions } from '../../../queries/empresas-queries'
import { instrumentosQueryOptions } from '../../../queries/instrumentos-queries'
import { allAreasQueryOptions } from '../../../queries/iluminacion/areas-queries'

export const Route = createFileRoute('/files/tecnicos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Suspense fallback={<div>Cargando técnicos...</div>}>
    <Inner />
  </Suspense>
}

function Inner() {
  const {data: tecnicos} = useSuspenseQuery(tecnicosQueryOptions)
  

  if(!tecnicos) return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <span>No hay técnicos</span>
    </div>
  )

  return <article className="flex flex-col gap-4">
    {tecnicos.map(tecnico => (
      <Tecnico key={tecnico.id} tecnico={tecnico}/>
      ))}
  </article>
}

function Tecnico({tecnico}: {tecnico: TecnicoType}) {
const {data: empresas} = useSuspenseQuery(empresasQueryOptions(tecnico.userId))
  const {data: instrumentos} = useSuspenseQuery(instrumentosQueryOptions(tecnico.userId))
  const {data: areas} = useSuspenseQuery(allAreasQueryOptions)

let tecnicosImages: string[] = [tecnico.empresaLogo, tecnico.firmaImg, tecnico.matriculaImg]
if(empresas)
  empresas.forEach(empresa => tecnicosImages.push(empresa.logo))
if(instrumentos)
  instrumentos.forEach(instrumento => {
    tecnicosImages.push(...instrumento.imagenesCalibracion)
    tecnicosImages.push(...instrumento.imagenes)
  })

if(areas)
  areas.forEach(area => {if(area.userId === tecnico.userId) tecnicosImages.push(...area.imagenes)})


return <div className='flex flex-col gap-2 items-center justify-center p-4'>
  <span>{tecnico.nombre.toUpperCase()} ({tecnicosImages.length})</span>
  <div className='flex gap-4 mb-20 w-full flex-wrap min-h-svg justify-center items-center'>
    {tecnicosImages.map((img, idx) => (
      <div key={idx} className='w-full sm:w-auto h-50 rounded-lg flex flex-col items-center justify-center relative'>
        <img src={img} alt="file" className="w-auto h-50 object-contain border border-white/20 rounded-lg"/>
        </div>
    ))}
  </div>
</div>
}
  