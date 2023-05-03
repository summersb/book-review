import { Route, Routes } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import React, { useState } from 'react'
import { type User } from 'firebase/auth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { auth } from '~/api'
import Home from './pages/home/Home'
import Authors from './pages/authors/Authors'
import Books from './pages/books/Books'
import ResponsiveAppBar from './pages/nav/ResponsiveAppBar'
import UserContext from './context/UserContext'
import CreateBook from './pages/books/CreateBook'
import CreateAuthor from './pages/authors/CreateAuthor'
import BooksByAuthor from '~/pages/books/BooksByAuthor'

const theme = createTheme({
  palette: {
    mode: 'dark',
    secondary: {
      main: '#f44336',
    },
  },
})

const client = new QueryClient()

const App = (): JSX.Element => {
  const [user, setUser] = useState<User>()

  auth.onAuthStateChanged((user) => {
    if (user != null) {
      setUser(user)
    } else {
      setUser(undefined)
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ user }}>
        <QueryClientProvider client={client}>
          <div>
            <nav>
              <ResponsiveAppBar />
            </nav>
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Authors" element={<Authors />} />
                <Route path="/Books" element={<Books />} />
                <Route path="/BooksByAuthor/:id" element={<BooksByAuthor />} />
                <Route path="/CreateBook" element={<CreateBook />} />
                <Route path="/CreateAuthor" element={<CreateAuthor />} />
              </Routes>
            </main>
          </div>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserContext.Provider>
    </ThemeProvider>
  )
}

export default App
