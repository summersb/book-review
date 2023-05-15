import { Route, Routes, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react'
import { auth } from '~/api'
import Home from './pages/home/Home'
import Authors from './pages/authors/Authors'
import Books from './pages/books/Books'
import CreateBook from './pages/books/CreateBook'
import CreateAuthor from './pages/authors/CreateAuthor'
import BooksByAuthor from '~/pages/books/BooksByAuthor'
import Login from '~/pages/home/Login'
import EditAuthor from './pages/authors/EditAuthor'
import RequireAuth from '~/components/RequireAuth'
import useAuth from '~/hooks/useAuth'
import Layout from './pages/nav/Layout'

const App = (): JSX.Element => {
  const { user, setUser } = useAuth()
  const location = useLocation()

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      if (user != null) {
        setUser({ name: user.displayName, photoURL: user.photoURL })
      } else {
        setUser({})
      }
    })
  }, [])
  console.log('App', user, location)

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="Home" element={<Home />} />
        <Route path="Login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route path="Authors" element={<Authors />} />
          <Route path="Author/:id" element={<EditAuthor />} />
          <Route path="Author/:id/Books" element={<BooksByAuthor />} />
          <Route path="Books" element={<Books />} />
          <Route path="CreateBook" element={<CreateBook />} />
          <Route path="CreateAuthor" element={<CreateAuthor />} />
        </Route>
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default App
