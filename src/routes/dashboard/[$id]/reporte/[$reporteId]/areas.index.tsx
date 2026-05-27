import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/dashboard/$id/reporte/$reporteId/areas/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/$id/reporte/$reporteId/areas/"!</div>
}
