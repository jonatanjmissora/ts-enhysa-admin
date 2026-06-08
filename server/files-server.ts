import { createServerFn } from "@tanstack/react-start"
import { utapi } from "./uploadthing"

export const listUploadthingFiles = createServerFn({
	method: "GET",
}).handler(async () => {
	const files = await utapi.listFiles()
	// Extract only the fields needed for the UI to ensure Seroval can serialize the response
	const serializable =
		files?.files?.map(f => ({
			id: f.id,
			key: f.key,
			name: f.name,
			size: f.size,
			uploadAt: f.uploadedAt,
		})) ?? []
	return { files: serializable }
})

export const deleteUploadthingFiles = createServerFn({
	method: "POST",
})
	.inputValidator((keys: string[]) => keys)
	.handler(async ({ data }) => {
		await utapi.deleteFiles(data)
	})

export const deleteUploadthingFile = createServerFn({
	method: "POST",
})
	.inputValidator((key: string) => key)
	.handler(async ({ data }) => {
		await utapi.deleteFiles(data)
		return { success: true }
	})

export type FileType = Awaited<
	ReturnType<typeof listUploadthingFiles>
>["files"][0]
