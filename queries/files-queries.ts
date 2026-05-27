import { queryOptions } from "@tanstack/react-query"
import { listUploadthingFiles } from "../server/files-server"

export const filesQueryOptions = queryOptions({
		queryKey: ["files"],
		queryFn: () => listUploadthingFiles(),
		// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
	})