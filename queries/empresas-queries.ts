import { queryOptions } from "@tanstack/react-query"
import { getEmpresasServer } from "../server/empresas-server"

export const empresasQueryOptions = (userId: string) =>
	queryOptions({
		queryKey: ["empresas", userId],
		queryFn: () => getEmpresasServer({ data: { userId } }),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})
