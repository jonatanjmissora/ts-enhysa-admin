import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query"
import {
	deleteUploadthingFile,
	listUploadthingFiles,
} from "../server/files-server"

export const filesQueryOptions = queryOptions({
	queryKey: ["files"],
	queryFn: () => listUploadthingFiles(),

	// refetchInterval: 60 * 1000, // refrescar cada 60 segundos
})

export function useDeleteFile() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (key: string) => deleteUploadthingFile({ data: key }),
		onSuccess: (_, key) => {
			queryClient.setQueryData(["files"], (oldFiles: any) => {
				if (!oldFiles || !oldFiles.files) return oldFiles
				return {
					...oldFiles,
					files: oldFiles.files.filter((item: any) => item.key !== key),
				}
			})
			queryClient.invalidateQueries({ queryKey: ["files"] })
		},
	})
}
