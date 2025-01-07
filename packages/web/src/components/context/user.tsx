'use client'

import { createContext, FC, useState } from 'react'
import { User } from '@/types/user'

type UserContext = {
	user: User
	setUser: (user: User) => void
}

/**
 * Context to store user data
 * NOTE: The imitial data is empty values, the actual data is set by the provider
 * Context will always be used by components under protected routes
 * For the ease of use by avoiding null check and for cleaner code
 * I am not 100% sure if this approach is correct or safe but I find it quite tedious to always perform a null check everywhere I use the hook
 */
export const UserContext = createContext<UserContext>({
	user: { id: '', name: '', email: '', avatar: '' },
	setUser: (user: User) => {
		console.log(`${user}\nFunction not initialized`)
	}
})

type CurrentUserProviderProps = {
	children: React.ReactNode
	initialUser: User
}

// Provider component
export const UserProvider: FC<CurrentUserProviderProps> = ({ children, initialUser }) => {
	const [user, setUser] = useState(initialUser)

	return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}
