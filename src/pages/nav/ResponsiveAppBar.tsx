import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import PersonIcon from '@mui/icons-material/Person'
import Avatar from '@mui/material/Avatar'
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'
import { NavLink, useNavigate } from 'react-router-dom'
import { GoogleAuthProvider } from 'firebase/auth'
import { auth } from '~/api'
import useAuth from '~/hooks/useAuth'

interface MenuData {
  title: string
  link: string
}

const pages: MenuData[] = [
  { title: 'Authors', link: 'Authors' },
  { title: 'Books', link: 'Books' },
  { title: 'Create Review', link: 'CreateBook' },
  { title: 'Create Author', link: 'CreateAuthor' },
]

const googleProvider = new GoogleAuthProvider()

function ResponsiveAppBar(): JSX.Element {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null)
  }

  // const loginPopup = (): void => {
  //   signInWithPopup(auth, googleProvider)
  //     .catch(alert)
  //     .finally(() => setAnchorElUser(null))
  // }

  const logOut = (): void => {
    auth.signOut().then(() => {
      setAnchorElUser(null)
    })
  }

  console.log('AppBar')
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <LocalLibraryIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <NavLink to="/">
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'white',
                textDecoration: 'none',
              }}
            >
              Book Reviews
            </Typography>
          </NavLink>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'flex', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.title}
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate(page.link)
                  }}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <LocalLibraryIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Book Reviews
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <NavLink key={page.title} to={page.link}>
                <Button onClick={handleCloseNavMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
                  {page.title}
                </Button>
              </NavLink>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Login">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <>
                  {user?.name !== undefined && <Avatar alt={user.name as string} src={user.photoURL as string} />}
                  {user?.name === undefined && <PersonIcon />}
                </>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/*<MenuItem onClick={loginPopup} sx={{ display: user?.name ? 'none' : 'block' }}>*/}
              {/*  <Typography textAlign="center">Login</Typography>*/}
              {/*</MenuItem>*/}
              <MenuItem onClick={logOut} sx={{ display: user?.name ? 'block' : 'none' }}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ResponsiveAppBar
