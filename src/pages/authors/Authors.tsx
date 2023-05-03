import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { styled } from '@mui/material/styles'
import UserContext from '../../context/UserContext'
import { getAuthor } from '~/api'
import BooksByAuthor from '~/pages/books/BooksByAuthor'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

const FloatRight = styled('span')(({ theme }) => ({
  float: 'right',
}))

const Authors = (): JSX.Element => {
  const ctx = useContext(UserContext)

  const { data: reviewList } = useQuery({
    queryKey: ['Author'],
    queryFn: getAuthor,
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    enabled: ctx?.user !== undefined,
  })

  if (ctx?.user === undefined) {
    return <>No User</>
  }
  return (
    <div>
      <Paper>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Books</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewList?.docs.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.data().firstName}
                </TableCell>
                <TableCell>{row.data().lastName}</TableCell>
                <TableCell>
                  <Link component={RouterLink} to={`/BooksByAuthor/${row.id}`}>
                    Show Books
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

export default Authors
