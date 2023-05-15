import { createTheme, ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import './index.css'

const theme = createTheme({
  palette: {
    mode: 'dark',
    secondary: {
      main: '#f44336',
    },
  },
})

const client = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/*',
    element: <App />,
  },
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={client}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
)
