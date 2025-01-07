import { useContext } from 'react'

import { UserContext } from '@/components/context/user'

// Custom hook for consuming the context
export const useUser = () => useContext(UserContext)
