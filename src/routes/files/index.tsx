import { createFileRoute, Link } from '@tanstack/react-router'
import { Suspense, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { filesQueryOptions } from '../../../queries/files-queries'

export const Route = createFileRoute('/files/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
          <Suspense fallback={<div>Cargando archivos...</div>}>
            <Inner />
          </Suspense>
        )}

        function Inner() {
         const {data: files} = useSuspenseQuery(filesQueryOptions)
         const [selectedFileKey, setSelectedFileKey] = useState('')
         
         if(!files?.files) return <div>No hay archivos</div>

         const totalBytes = files.files.reduce((acc, file) => acc + file.size, 0)
         
         return (
          <article className='flex flex-col gap-4'>
          <span>Almacenamiento Total: {(totalBytes / 1024 / 1024 / 1024).toFixed(3)} GB / 2 GB ({((totalBytes / 1024 / 1024 / 1024) / 2 * 100).toFixed(1)}%)</span>
          <div className='flex gap-4 my-20 w-full flex-wrap min-h-svg justify-center items-center'>
            {files.files.map(file => (
              <div key={file.id} className='w-full sm:w-auto h-50 rounded-lg flex flex-col items-center justify-center relative'>
              <button 
                onClick={() => setSelectedFileKey("")} 
                className={`text-black absolute inset-0 ${selectedFileKey === file.key ? 'z-10' : 'hidden'} text-xs p-2 flex flex-col gap-2 items-center justify-center bg-white/50 rounded-lg backdrop-blur-lg`}
                >
                  <span className='min-w-auto w-35 break-words'>{file.name}</span>
                  <span>size: {(file.size / 1024 / 1024).toFixed(1)}MB</span>
                  <span>subida: {new Date(file.uploadAt).toLocaleDateString("it-IT")} - {new Date(file.uploadAt).toLocaleTimeString("it-IT")}</span>
                </button> 
                
                  <button
                    onClick={() => setSelectedFileKey(file.key)}
                  >
                  <img
                    src={`https://utfs.io/f/${file.key}`}
                    alt="file"
                    className="w-auto h-50 object-contain border border-white/20 rounded-lg"
                    />
                    </button>
              </div>
            ))}
          </div>
          </article>
         )  
        }