import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { allAreasQueryOptions } from '../../../queries/iluminacion/areas-queries'
import { allReportesQueryOptions } from '../../../queries/iluminacion/reportes-queries'

export const Route = createFileRoute('/areas')({
  loader: ({ context }) => {
      context.queryClient.ensureQueryData(allAreasQueryOptions)
       context.queryClient.ensureQueryData(allReportesQueryOptions)
      return null
    },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <Link to="/" className="flex gap-4 items-center justify-center p-4">
        <div className="flex gap-4 size-12 relative">
          <img
            src="EnHySa_logo.webp"
            alt="logo"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <span className="text-2xl font-semibold">Enhysa Admin Panel</span>
      </Link>
      
      <Outlet />
    </div>
  )
}
