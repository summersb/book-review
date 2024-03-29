import * as React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import useAuth from '~/hooks/useAuth'

type RequireAuthProps = {}

const RequireAuth: React.FC<RequireAuthProps> = (props: RequireAuthProps): JSX.Element => {
  const { user } = useAuth()
  const location = useLocation()
  console.log('RequireAuth', user, location)
  return user?.name ? <Outlet /> : <Navigate to="/Login" state={{ from: location }} replace />
}

export default RequireAuth
