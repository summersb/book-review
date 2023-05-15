import * as React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import ResponsiveAppBar from '~/pages/nav/ResponsiveAppBar'
import useAuth from '~/hooks/useAuth'
import Login from '../home/Login'

type LayoutProps = {}

const Layout: React.FC<LayoutProps> = (props: LayoutProps): JSX.Element => {
  const { user } = useAuth()
  const location = useLocation()
  console.log('Layout', location)

  return (
    <div>
      <div>
        <nav>
          <ResponsiveAppBar />
        </nav>
        <main>{user?.name ? <Outlet /> : <Login />}</main>
      </div>
    </div>
  )
}

export default Layout
