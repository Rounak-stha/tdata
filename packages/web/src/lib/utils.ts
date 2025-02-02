import { TaskActivityUserSubtype, User } from '@/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function calcUserDiff(prevUsers: User[], newUser: User[]) {
	const [larger, smaller] = prevUsers.length > newUser.length ? [prevUsers, newUser] : [newUser, prevUsers]
	const action: TaskActivityUserSubtype = prevUsers.length > newUser.length ? 'remove' : 'add'
	const diff: User[] = []

	larger.forEach((lUser) => {
		if (!smaller.some((sUser) => sUser.id == lUser.id)) diff.push(lUser)
	})

	return { action, diff }
}
