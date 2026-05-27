import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$id/reporte/reporte-nuevo/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/$id/reporte/reporte-nuevo/"!</div>
}
