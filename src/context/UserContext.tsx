import { type User } from 'firebase/auth'
import React from 'react'

interface UserContextType {
  user?: User
}

const UserContext = React.createContext<UserContextType | undefined>(undefined)

export default UserContext
