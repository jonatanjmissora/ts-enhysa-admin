import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { UserType } from "../../db/users/schema"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function getUser(users: UserType[] | null, userId: string) {
	const user = users?.find(u => u.id === userId)
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
