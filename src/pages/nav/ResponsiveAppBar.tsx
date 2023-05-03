import React, { type MouseEvent, useContext, useEffect, useState } from 'react'
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
import { NavLink } from 'react-router-dom'
import { getRedirectResult, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth'
import { auth } from '../../api'
import UserContext from '../../context/UserContext'

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
  const ctx = useContext(UserContext)

  const user = ctx?.user

  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result !== null) {
          handleCloseUserMenu()
        }
      })
      .catch((e: Error) => {
        alert(e.message)
      })
  }, [])

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

  const login = (e: MouseEvent): void => {
    signInWithRedirect(auth, googleProvider).catch((error: Error) => {
      alert(error.message)
    })
  }

  const logOut = (e: MouseEvent): void => {
    auth.signOut().then(() => {
      setAnchorElUser(null)
    })
  }

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
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <NavLink to={page.link}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </NavLink>
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
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <>
                  {user !== undefined && <Avatar alt={user.displayName as string} src={user.photoURL as string} />}
                  {user === undefined && <PersonIcon />}
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
              {user === undefined && (
                <MenuItem onClick={login}>
                  <Typography textAlign="center">Login</Typography>
                </MenuItem>
              )}
              {user !== undefined && (
                <MenuItem onClick={logOut}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default ResponsiveAppBar
