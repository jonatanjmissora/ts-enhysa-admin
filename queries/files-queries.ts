import {
	queryOptions,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query"
import {
	deleteUploadthingFile,
	deleteUploadthingFiles,
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

export function useDeleteFiles() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (keys: string[]) => deleteUploadthingFiles({ data: keys }),
		onSuccess: (_, keys) => {
			const keySet = new Set(keys)
			queryClient.setQueryData(["files"], (oldFiles: any) => {
				if (!oldFiles || !oldFiles.files) return oldFiles
				return {
					...oldFiles,
					files: oldFiles.files.filter((item: any) => !keySet.has(item.key)),
				}
			})
			queryClient.invalidateQueries({ queryKey: ["files"] })
		},
	})
}
