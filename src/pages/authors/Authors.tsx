import Paper from '@mui/material/Paper'
import React, { useEffect, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { deleteBook, getAuthor } from '~/api'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
import { Author } from '~/type'
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import useAuth from '~/hooks/useAuth'

const Authors = (): JSX.Element => {
  const ctx = useAuth()
  const [deleting, setIsDeleting] = useState<boolean>(false)
  const queryClient = useQueryClient()
  const [author, setAuthor] = useState<QueryDocumentSnapshot<DocumentData>>()
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Book Review - Author'
  }, [])

  const { data: reviewList } = useQuery({
    queryKey: ['Author'],
    queryFn: getAuthor,
    onError: (err: Error) => {
      alert(err.message)
    },
    retry: false,
    staleTime: 100_000,
    enabled: ctx?.user !== undefined,
  })

  const handleDeleteAuthor = (): void => {
    if (!author) {
      return
    }
    setConfirmDelete(false)
    setIsDeleting(true)
    const startTime = new Date().getTime()
    deleteBook(author.ref)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['Author'] })
      })
      .finally(() => {
        let delay = 500
        const now = new Date().getTime()
        if (now - startTime < 500) {
          delay = 500 - (now - startTime)
        }
        setTimeout(() => {
          setIsDeleting(false)
        }, delay)
      })
  }

  const handleClose = (): void => {
    setConfirmDelete(false)
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
          <DialogContentText>
            Delete {author?.data().lastName}, {author?.data().firstName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAuthor}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Paper>
        <table>
          <thead>
            <tr>
              <th scope="col">Edit</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Books</th>
              <th scope="col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {reviewList?.docs.map((row) => (
              <tr key={row.id}>
                <td data-label="Edit">
                  <Link component={RouterLink} to={`/Author/${row.id}`}>
                    <EditIcon />
                  </Link>
                </td>
                <td scope="row" data-label="First Name">
                  {row.data().firstName}
                </td>
                <td data-label="Last Name">{row.data().lastName}</td>
                <td data-label="Books">
                  <Link component={RouterLink} to={`/Author/${row.id}/Books`}>
                    Show Books
                  </Link>
                </td>
                <td data-label="Delete">
                  <DeleteIcon
                    onClick={() => {
                      setAuthor(row)
                      setConfirmDelete(true)
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </div>
  )
}

export default Authors
