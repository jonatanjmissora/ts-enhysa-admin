import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/$id/instrumentos/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashboard/$id/instrumentos/"!</div>
}
