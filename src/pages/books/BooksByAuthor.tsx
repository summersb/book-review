import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useQuery } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import { getAuthorById, getBooksByAuthor } from '~/api'
import { type Author, type Book } from '~/type'
import { useParams } from 'react-router-dom'
import BookReview from '~/pages/books/BookReview'
import NoUser from '../home/NoUser'

type BooksByAuthorProps = {
  // authorId: string
}

const BooksByAuthor = (props: BooksByAuthorProps): JSX.Element => {
  const ctx = useContext(UserContext)
  const [author, setAuthor] = useState<Author | null>(null)
  const { id } = useParams()

  console.log('hmmm')
  const { data: bookList, isSuccess: bookLoaded } = useQuery({
    queryKey: ['Book', id],
    queryFn: () => getBooksByAuthor(id as string),
    enabled: ctx?.user !== undefined && id !== undefined,
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
  })

  const { isSuccess: authorLoaded } = useQuery({
    queryKey: ['Author', id],
    queryFn: () => getAuthorById(id as string),
    onSuccess: (data) => {
      setAuthor(data)
    },
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    enabled: ctx?.user !== undefined && id !== undefined,
  })

  if (ctx?.user === undefined) {
    return <NoUser />
  }

  if (!bookLoaded || !authorLoaded) {
    return <>Loading</>
  }

  return (
    <div>
      <Paper>
        <h3>{`${author?.lastName}, ${author?.firstName}`}</h3>
        <Table sx={{ borderCollapse: 'collapse', width: '100%', tableLayout: 'fixed' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Series</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookList?.docs.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{row.data().title}</TableCell>
                <TableCell>{row.data().rating}</TableCell>
                <TableCell>{row.data().series}</TableCell>
                <TableCell>{row.data().number}</TableCell>
                <TableCell>{row.data().genre}</TableCell>
                <TableCell>{row.data().bookType}</TableCell>
                <TableCell>
                  <BookReview review={row.data().review} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

export default BooksByAuthor
