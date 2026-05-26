import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$id/reportes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/$id/reportes/"!</div>
}
