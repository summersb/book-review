import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DeleteIcon from '@mui/icons-material/Delete'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useContext, useState } from 'react'
import UserContext from '../../context/UserContext'
import { LargeTable, SmallTable } from '../../components'
import { getAuthor, getBooks, deleteBook } from '~/api'
import { type Author, type AuthorRecord, type Book, type BookRecord } from '~/type'
import BookReview from '~/pages/books/BookReview'
import { DocumentData, DocumentReference, QueryDocumentSnapshot } from 'firebase/firestore'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import Paper from '@mui/material/Paper'
import NoUser from '../home/NoUser'

type AuthorMap = Record<string, string>

const Books = (): JSX.Element => {
  const ctx = useContext(UserContext)
  const [map, setMap] = useState<AuthorMap>({})
  const [deleting, setDeleting] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [book, setBook] = useState<QueryDocumentSnapshot<DocumentData>>()
  const { data: reviewList, isSuccess: bookLoaded } = useQuery({
    queryKey: ['Book'],
    queryFn: getBooks,
    onError: (err: Error) => {
      alert(err.message)
    },
    enabled: ctx?.user !== undefined,
  })

  const { isSuccess: authorLoaded } = useQuery({
    queryKey: ['Author'],
    queryFn: getAuthor,
    onSuccess: (data) => {
      const map: AuthorMap = {}
      data?.docs
        .map((doc): AuthorRecord => ({ id: doc.id, author: doc.data() as Author }))
        .forEach((record) => {
          map[record.id] = `${record.author.lastName}, ${record.author.firstName}`
        })
      setMap(map)
    },
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    enabled: ctx?.user !== undefined,
  })

  const handleDeleteBook = (): void => {
    if (!book) {
      return
    }
    setConfirmDelete(false)
    setDeleting(true)
    const startTime = new Date().getTime()
    deleteBook(book.ref)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['Book'] })
      })
      .finally(() => {
        let delay = 500
        const now = new Date().getTime()
        if (now - startTime < 500) {
          delay = 500 - (now - startTime)
        }
        setTimeout(() => {
          setDeleting(false)
        }, delay)
      })
  }

  const handleClose = (): void => {
    setConfirmDelete(false)
  }

  if (ctx?.user === undefined) {
    return <NoUser />
  }

  if (!bookLoaded || !authorLoaded) {
    return <>Loading</>
  }

  return (
    <div>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={deleting}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={confirmDelete}
        onClose={handleClose}
        PaperComponent={Paper}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>Delete {book?.data().title}?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDeleteBook}>Delete</Button>
        </DialogActions>
      </Dialog>
      <LargeTable>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Author</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Series</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Review</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reviewList?.docs.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>{map[row.data().authorId]}</TableCell>
                <TableCell>{row.data().title}</TableCell>
                <TableCell>{row.data().rating}</TableCell>
                <TableCell>{row.data().series}</TableCell>
                <TableCell>{row.data().number}</TableCell>
                <TableCell>{row.data().genre}</TableCell>
                <TableCell>{row.data().bookType}</TableCell>
                <TableCell>
                  <BookReview review={row.data().review} />
                </TableCell>
                <TableCell>
                  <DeleteIcon
                    onClick={() => {
                      setBook(row)
                      setConfirmDelete(true)
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </LargeTable>
      <SmallTable>
        <h2>Books</h2>
        {reviewList?.docs
          .map((row): BookRecord => ({ id: row.id, book: row.data() as Book }))
          .map((data) => (
            <div key={data.id}>
              <h3>{data.book.title}</h3>
              <dl>
                <dt>Rating</dt>
                <dd>{data.book.rating}</dd>
                <dt>Author</dt>
                <dd>{map[data.book.authorId]}</dd>
                {data.book.series !== '' && (
                  <>
                    <dt>Series</dt>
                    <dd>{data.book.series}</dd>
                    <dt>Number</dt>
                    <dd>{data.book.number}</dd>
                  </>
                )}
                {data.book.genre !== '' && (
                  <>
                    <dt>Genre</dt>
                    <dd>{data.book.genre}</dd>
                  </>
                )}
                {data.book.bookType !== undefined && (
                  <>
                    <dt>Type</dt>
                    <dd>{data.book.bookType}</dd>
                  </>
                )}
                {data.book.review !== '' && (
                  <>
                    <dt>Review</dt>
                    <dd>Show Review</dd>
                  </>
                )}
              </dl>
            </div>
          ))}
      </SmallTable>
    </div>
  )
}

export default Books
