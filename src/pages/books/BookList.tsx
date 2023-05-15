import DeleteIcon from '@mui/icons-material/Delete'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import BookReview from '~/pages/books/BookReview'
import { AuthorMap, Book } from '~/type'
import { deleteBook } from '~/api'
import { useQueryClient } from '@tanstack/react-query'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const hasNoValue = (field: any) => {
  return field === undefined || field === null || field === ''
}

export type BookListType = {
  book: DocumentData
  doc: QueryDocumentSnapshot<DocumentData>
}

type BookListProps = {
  rows: BookListType[]
  authors: AuthorMap
}

const BookList: React.FC<BookListProps> = (props: BookListProps): JSX.Element => {
  const [book, setBook] = useState<QueryDocumentSnapshot<DocumentData>>()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)
  const [deleting, setDeleting] = useState<boolean>(false)
  const queryClient = useQueryClient()

  useEffect(() => {
    document.title = 'Book Review - Books'
  }, [])

  const handleClose = (): void => {
    setConfirmDelete(false)
  }

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

  return (
    <>
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
      <table>
        <thead>
          <tr>
            <th scope="col">Author</th>
            <th scope="col">Title</th>
            <th scope="col">Rating</th>
            <th scope="col">Series</th>
            <th scope="col">Number</th>
            <th scope="col">Genre</th>
            <th scope="col">Type</th>
            <th scope="col">Review</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {props.rows?.map(({ book, doc }) => (
            <tr key={doc.id}>
              <td data-label="Author">{props.authors[book.authorId]}</td>
              {book.title && <td data-label="Title">{book.title}</td>}
              {hasNoValue(book.title) && <td></td>}
              {book.rating && <td data-label="Rating">{book.rating}</td>}
              {hasNoValue(book.rating) && <td className="small"></td>}
              {book.series && <td data-label="Series">{book.series}</td>}
              {hasNoValue(book.series) && <td className="small"></td>}
              {book.number && <td data-label="Number">{book.number}</td>}
              {hasNoValue(book.number) && <td className="small"></td>}
              {book.genre && <td data-label="Genre">{book.genre}</td>}
              {hasNoValue(book.genre) && <td className="small"></td>}
              {book.bookType && <td data-label="Type">{book.bookType}</td>}
              {hasNoValue(book.bookType) && <td className="small"></td>}
              {book.review && (
                <td data-label="Review">
                  <BookReview review={book.review} />
                </td>
              )}
              {hasNoValue(book.review) && <td className="small"></td>}
              <td data-label="Delete">
                <DeleteIcon
                  onClick={() => {
                    setBook(doc)
                    setConfirmDelete(true)
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default BookList
