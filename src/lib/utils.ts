import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserType } from "../../db/users/schema"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const FALLBACK_IMAGE =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z'%3E%3C/path%3E%3Cpolyline points='14 2 14 8 20 8'%3E%3C/polyline%3E%3C/svg%3E"

export function imgSrc(src?: string | null) {
	return src?.trim() ? src : FALLBACK_IMAGE
}

export function getUser(users: UserType[] | null, userId: string) {
	const user = users?.find(u => u.id === userId)
	return getOneUser(user)
}

export function getOneUser(user: UserType | undefined | null) {
	if (!user) return "No user"
	const nombreCompleto = capitalize(
		user.name
			.trim()
			.split(" ")
			.filter(s => s !== "")
	)
	let nombre: string, apellido: string
	if (nombreCompleto.length > 2) {
		nombre = `${nombreCompleto[0]} ${nombreCompleto[1]}`
		apellido = nombreCompleto[nombreCompleto.length - 1] ?? ""
	} else if (nombreCompleto.length === 2) {
		nombre = nombreCompleto[0] ?? ""
		apellido = nombreCompleto[1] ?? ""
	} else {
		nombre = ""
		apellido = nombreCompleto[0] ?? ""
	}

	if (nombre.includes("Demo") || apellido.includes("Demo"))
		return `${apellido} ${nombre} ${user.email[4]}`
	return `${apellido} ${nombre} `
}

function capitalize(stringArray: string[]) {
	return stringArray.map(s => s.charAt(0).toUpperCase() + s.slice(1))
}
